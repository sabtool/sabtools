"""One-time helper: obtain a Blogger API refresh token.

Run this ONCE on your own computer:

    pip install -r requirements.txt
    python scripts/get_blogger_token.py

Prerequisites:
  1. A Google Cloud project with the Blogger API v3 enabled.
  2. An OAuth 2.0 Client ID of type "Desktop app".
  3. Download that client's JSON and save it as  client_secret.json
     in this project's root folder (next to requirements.txt).

The script opens a browser, asks you to sign in with the Google account that
owns the blog, and then prints three values. Copy them into your .env file and
into your GitHub repository Secrets:

    BLOGGER_CLIENT_ID
    BLOGGER_CLIENT_SECRET
    BLOGGER_REFRESH_TOKEN
"""
from pathlib import Path

from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/blogger"]
CLIENT_SECRET_FILE = Path(__file__).resolve().parent.parent / "client_secret.json"


def main() -> None:
    if not CLIENT_SECRET_FILE.exists():
        raise SystemExit(
            f"Missing {CLIENT_SECRET_FILE}.\n"
            "Download your OAuth Desktop-app client JSON from Google Cloud "
            "Console and save it there."
        )

    flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRET_FILE), SCOPES)
    # access_type=offline + prompt=consent guarantees a refresh token is returned.
    creds = flow.run_local_server(port=0, access_type="offline", prompt="consent")

    config = flow.client_config
    print("\n========== COPY THESE INTO .env AND GITHUB SECRETS ==========")
    print(f"BLOGGER_CLIENT_ID={config['client_id']}")
    print(f"BLOGGER_CLIENT_SECRET={config['client_secret']}")
    print(f"BLOGGER_REFRESH_TOKEN={creds.refresh_token}")
    print("=============================================================")
    if not creds.refresh_token:
        print(
            "\nWARNING: no refresh token returned. Revoke the app's access at "
            "https://myaccount.google.com/permissions and run this script again."
        )


if __name__ == "__main__":
    main()
