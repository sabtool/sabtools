"""Blogger API v3 — create posts as DRAFTS (never auto-published).

The pipeline always inserts with isDraft=True. A human reviews the draft in the
Blogger dashboard and clicks Publish.
"""
import os

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/blogger"]


def get_service():
    """Build an authenticated Blogger API v3 service from the refresh token."""
    creds = Credentials(
        None,
        refresh_token=os.environ["BLOGGER_REFRESH_TOKEN"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=os.environ["BLOGGER_CLIENT_ID"],
        client_secret=os.environ["BLOGGER_CLIENT_SECRET"],
        scopes=SCOPES,
    )
    creds.refresh(Request())
    return build("blogger", "v3", credentials=creds, cache_discovery=False)


def count_drafts(service, blog_id: str) -> int:
    """Count how many unreviewed drafts already exist on the blog."""
    total = 0
    request = service.posts().list(
        blogId=blog_id, status="DRAFT", maxResults=20, fetchBodies=False
    )
    while request is not None:
        response = request.execute()
        total += len(response.get("items", []))
        request = service.posts().list_next(request, response)
    return total


def create_draft(service, blog_id: str, title: str, html: str, labels: list) -> dict:
    """Insert one post as a DRAFT. Returns the created post resource."""
    body = {"title": title, "content": html}
    if labels:
        body["labels"] = labels
    return (
        service.posts()
        .insert(blogId=blog_id, body=body, isDraft=True)
        .execute()
    )
