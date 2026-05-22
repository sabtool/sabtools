"""Email notification — tells the reviewer a draft is ready."""
import os
import smtplib
from email.mime.text import MIMEText


def send_notification(topic: dict, post: dict, created: dict) -> None:
    """Email the reviewer with a link to the new Blogger draft."""
    to_addr = os.environ.get("NOTIFY_TO", "").strip()
    if not to_addr:
        print("NOTIFY_TO not set — skipping email notification.")
        return

    blog_id = os.environ["BLOG_ID"]
    post_id = created.get("id", "")
    edit_url = f"https://www.blogger.com/blog/post/edit/{blog_id}/{post_id}"

    body = f"""A new blog draft is ready for your review.

Title:        {post['title']}
Topic type:   {topic.get('type', '-')}
Pillar:       {topic.get('pillar', '-')}

Suggested permalink:           {post.get('permalink', '(none)')}
Suggested search description:  {post.get('meta_description', '(none)')}
Labels:                        {', '.join(post.get('labels', [])) or '(none)'}

Open the draft to review and publish:
{edit_url}

Before you click Publish:
  1. Fact-check every number and claim.
  2. Set the custom permalink and the search description (fields above).
  3. Add a header image.
  4. Publish, then Request Indexing in Google Search Console.

This draft was generated automatically. Nothing goes live until you publish it.
"""

    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = f"[Blog draft ready] {post['title']}"
    msg["From"] = os.environ["SMTP_USER"]
    msg["To"] = to_addr

    host = os.environ.get("SMTP_HOST") or "smtp.gmail.com"
    port = int(os.environ.get("SMTP_PORT") or "587")

    with smtplib.SMTP(host, port) as server:
        server.starttls()
        server.login(os.environ["SMTP_USER"], os.environ["SMTP_PASSWORD"])
        server.send_message(msg)

    print(f"Notification email sent to {to_addr}")
