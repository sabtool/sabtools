"""Content generation via the Claude API.

Reads the SabTools content-engine system prompt, asks Claude to write one blog
post for the given topic, and parses the structured output into a dict.
"""
from __future__ import annotations  # PEP 563 — defer type-hint evaluation so
                                    # `str | None` works on Python 3.7-3.9.
import os
import re
from pathlib import Path

import anthropic

PROMPT_PATH = Path(__file__).resolve().parent.parent / "config" / "content_engine_prompt.md"

# tools.ts lives at <repo-root>/src/lib/tools.ts ; blogger-automation lives
# at <repo-root>/blogger-automation/src/generate.py — so two levels up.
TOOLS_TS_PATH = (
    Path(__file__).resolve().parent.parent.parent / "src" / "lib" / "tools.ts"
)

# Maps the topics.json "pillar" values to the catalog "category" values
# in src/lib/tools.ts. A topic gets its pillar's combined tool list injected
# into the user prompt so Claude can link the EXACT tool URL instead of the
# bare https://sabtools.in homepage. Pillars not in this map (news-explainer,
# world) don't get an injection — they tend to be general posts where naming
# a specific tool would feel forced.
PILLAR_TO_CATEGORIES: dict[str, list[str]] = {
    "finance": ["finance", "tax", "business"],
    "health": ["health"],
    "utility": [
        "utility",
        "indiaguide",
        "datetime",
        "pdf",
        "image",
        "converters",
        "math",
    ],
    "developer-ai": ["ai", "developer", "data", "seo"],
}

# Cap per-prompt tool list to keep the prompt focused — the catalog's first
# entries in each category are the highest-value tools (curated order in
# src/lib/tools.ts), so taking the first N keeps the EMIs / SIPs / GSTs.
MAX_TOOLS_IN_PROMPT = 30


def _load_tools_for_pillar(pillar: str | None) -> list[dict]:
    """Parse src/lib/tools.ts and return tools matching the given pillar.

    Returns a list of {"name": ..., "slug": ...} dicts, or [] for pillars
    that have no mapped categories (general / news / world posts).
    """
    if not pillar:
        return []
    cats = PILLAR_TO_CATEGORIES.get(pillar)
    if not cats:
        return []

    try:
        src = TOOLS_TS_PATH.read_text(encoding="utf-8")
    except (OSError, FileNotFoundError):
        return []

    # Per-entry regex: name + slug + category, in that order, within one
    # object literal. Non-greedy ".*?" + the closing `"` after category
    # bound it to a single entry. Verified against all ~460 tool entries.
    pattern = re.compile(
        r'name:\s*"([^"]+)"\s*,\s*slug:\s*"([^"]+)"[^}]*?category:\s*"([^"]+)"'
    )
    cat_set = set(cats)
    matches: list[dict] = []
    for name, slug, cat in pattern.findall(src):
        if cat in cat_set:
            matches.append({"name": name, "slug": slug})
        if len(matches) >= MAX_TOOLS_IN_PROMPT:
            break
    return matches


def _format_tools_block(tools: list[dict]) -> str:
    """Render the tool catalog as a clear instruction block for Claude."""
    if not tools:
        return ""
    lines = "\n".join(f"- {t['name']} → https://sabtools.in/tools/{t['slug']}" for t in tools)
    return (
        "\n\nAVAILABLE SABTOOLS TOOL URLS (USE THE EXACT URL IF YOU MENTION A TOOL):\n"
        "If you mention any of the following SabTools tools in the post, link to\n"
        "the EXACT tool page URL listed below — NEVER the bare homepage\n"
        "(https://sabtools.in/). For tools NOT in this list, do not invent a URL —\n"
        "either link the homepage or omit the link.\n\n"
        f"{lines}\n"
    )


TYPE_GUIDANCE = {
    "general": (
        "This is a GENERAL-INTEREST post. It is NOT about SabTools. Mention "
        "SabTools at most once, and only if one specific tool genuinely helps the "
        "reader. The article must stand fully on its own as a useful, honest piece."
    ),
    "sabtools": (
        "This is a SABTOOLS post. It may feature SabTools.in and its tools. Stay "
        "honest and factual: describe what the tools do, who they help, and their "
        "real limitations. No marketing fluff, no superlatives."
    ),
    "comparison": (
        "This is an HONEST COMPARISON post. Compare SabTools with named "
        "alternatives fairly. State plainly what each competitor does well. "
        "Present SabTools favourably ONLY where it genuinely earns it. Never rig "
        "the comparison; never disparage a competitor."
    ),
}


def build_user_prompt(topic: dict) -> str:
    ctype = topic.get("type", "general")
    pillar = topic.get("pillar", "general")
    guidance = TYPE_GUIDANCE.get(ctype, TYPE_GUIDANCE["general"])
    tools_block = _format_tools_block(_load_tools_for_pillar(pillar))
    return (
        "Write one complete blog post for the SabTools.in blog.\n\n"
        f"TOPIC: {topic['title']}\n"
        f"CONTENT TYPE: {ctype}\n"
        f"PILLAR: {pillar}\n\n"
        f"{guidance}"
        f"{tools_block}\n"
        "Follow the output format and every rule in your system instructions "
        "exactly. Respond with the four header lines, then the ---HTML--- "
        "separator, then the body-only HTML. No markdown code fences."
    )


def parse_output(raw: str) -> dict:
    """Split the model output into metadata + HTML."""
    if "---HTML---" not in raw:
        raise ValueError("Generator output is missing the ---HTML--- separator.")

    header, html = raw.split("---HTML---", 1)
    meta = {"title": "", "labels": [], "permalink": "", "meta_description": ""}

    for line in header.strip().splitlines():
        if ":" not in line:
            continue
        key, _, val = line.partition(":")
        key = key.strip().lower()
        val = val.strip()
        if key == "title":
            meta["title"] = val
        elif key == "labels":
            meta["labels"] = [x.strip() for x in val.split(",") if x.strip()]
        elif key == "permalink":
            meta["permalink"] = val
        elif key == "meta_description":
            meta["meta_description"] = val

    meta["html"] = html.strip()
    # Strip an accidental leading/trailing markdown fence if the model added one.
    if meta["html"].startswith("```"):
        meta["html"] = meta["html"].split("\n", 1)[-1]
    if meta["html"].endswith("```"):
        meta["html"] = meta["html"].rsplit("```", 1)[0].strip()

    if not meta["title"]:
        raise ValueError("Generator output is missing a TITLE.")
    if not meta["html"]:
        raise ValueError("Generator output is missing the HTML body.")
    return meta


def generate_post(topic: dict) -> dict:
    """Generate one blog post for the given topic. Returns a dict with
    title, labels, permalink, meta_description and html."""
    system_prompt = PROMPT_PATH.read_text(encoding="utf-8")
    user_prompt = build_user_prompt(topic)
    model = os.environ.get("CLAUDE_MODEL") or "claude-opus-4-7"

    client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from the environment

    # Stream because the HTML output is long; get_final_message() reassembles it.
    with client.messages.stream(
        model=model,
        max_tokens=32000,
        thinking={"type": "adaptive"},
        output_config={"effort": "high"},
        system=[
            {
                "type": "text",
                "text": system_prompt,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=[{"role": "user", "content": user_prompt}],
    ) as stream:
        message = stream.get_final_message()

    raw = "".join(block.text for block in message.content if block.type == "text")
    if not raw.strip():
        raise ValueError("Claude returned an empty response.")
    return parse_output(raw)
