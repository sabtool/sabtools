"""Content generation via the Claude API.

Reads the SabTools content-engine system prompt, asks Claude to write one blog
post for the given topic, and parses the structured output into a dict.
"""
import os
from pathlib import Path

import anthropic

PROMPT_PATH = Path(__file__).resolve().parent.parent / "config" / "content_engine_prompt.md"

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
    guidance = TYPE_GUIDANCE.get(ctype, TYPE_GUIDANCE["general"])
    return (
        "Write one complete blog post for the SabTools.in blog.\n\n"
        f"TOPIC: {topic['title']}\n"
        f"CONTENT TYPE: {ctype}\n"
        f"PILLAR: {topic.get('pillar', 'general')}\n\n"
        f"{guidance}\n\n"
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
