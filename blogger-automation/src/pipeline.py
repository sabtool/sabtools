"""Daily pipeline orchestrator.

Run with:  python -m src.pipeline

Steps:
  1. Pick the next pending topic from config/topics.json.
  2. Stop if too many unreviewed drafts already exist (safety guard).
  3. Generate the post with Claude.
  4. Insert it into Blogger as a DRAFT.
  5. Mark the topic as 'drafted' and email the reviewer.

Nothing is ever auto-published. A human reviews and publishes every draft.
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

from src.generate import generate_post
from src import publish
from src.notify import send_notification

ROOT = Path(__file__).resolve().parent.parent
TOPICS_PATH = ROOT / "config" / "topics.json"
MAX_PENDING_DRAFTS = int(os.environ.get("MAX_PENDING_DRAFTS") or "5")


def load_topics() -> dict:
    return json.loads(TOPICS_PATH.read_text(encoding="utf-8"))


def save_topics(data: dict) -> None:
    TOPICS_PATH.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )


def next_pending(data: dict) -> dict | None:
    for topic in data.get("topics", []):
        if topic.get("status") == "pending":
            return topic
    return None


def review_banner(post: dict) -> str:
    """A visible note prepended to the draft so the reviewer sees the suggested
    permalink and search description without needing an email."""
    return (
        '<div style="background:#FFF3CD;border:1px solid #FFC107;'
        'padding:14px 18px;margin-bottom:22px;border-radius:6px;'
        'font-family:Arial,sans-serif;font-size:14px;line-height:1.6;">'
        "<strong>REVIEW NOTES — delete this box before publishing</strong><br>"
        f"<b>Suggested permalink:</b> {post.get('permalink') or '(none)'}<br>"
        f"<b>Suggested search description:</b> {post.get('meta_description') or '(none)'}<br>"
        "<b>Before publishing:</b> fact-check the numbers, set the permalink and "
        "search description in Post Settings, add a header image, then publish "
        "and Request Indexing in Search Console."
        "</div>"
    )


def main() -> int:
    data = load_topics()
    topic = next_pending(data)
    if topic is None:
        print("No pending topics left. Add more to config/topics.json.")
        return 0

    blog_id = os.environ["BLOG_ID"]
    service = publish.get_service()

    pending_drafts = publish.count_drafts(service, blog_id)
    if pending_drafts >= MAX_PENDING_DRAFTS:
        print(
            f"{pending_drafts} unreviewed drafts already exist "
            f"(limit {MAX_PENDING_DRAFTS}). Skipping generation today — "
            "review and publish some drafts first."
        )
        return 0

    print(f"Generating draft for topic #{topic['id']}: {topic['title']}")
    post = generate_post(topic)
    print(f"  Generated: {post['title']} ({len(post['html'])} chars of HTML)")

    html_with_notes = review_banner(post) + post["html"]
    created = publish.create_draft(
        service, blog_id, post["title"], html_with_notes, post["labels"]
    )
    print(f"  Blogger draft created (post id {created.get('id')})")

    topic["status"] = "drafted"
    save_topics(data)
    print("  topics.json updated — topic marked 'drafted'.")

    send_notification(topic, post, created)
    print("Done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
