# SabTools Blogger Automation

Automatically **drafts** one blog post a day for the SabTools blog and saves it
to Blogger for human review. **Nothing is ever auto-published** — you review and
publish every draft yourself.

```
GitHub Actions (daily cron)
        │
        ▼
  src/pipeline.py ── picks the next topic from config/topics.json
        │
        ▼
  src/generate.py ── Claude writes the post (styled, body-only HTML)
        │
        ▼
  src/publish.py  ── Blogger API v3 creates it as a DRAFT
        │
        ▼
  src/notify.py   ── emails you a link to review and publish
```

---

## What it does

- Generates **one draft per day** from a pre-approved topic queue.
- Follows the **1-in-4 rule**: every 4th topic is a SabTools / comparison post;
  the other three are general-interest content.
- Writes **honest comparisons** — never rigged, never disparaging competitors.
- Outputs **attractive, body-only HTML** that pastes straight into Blogger,
  plus JSON-LD (Article + FAQ) structured data.
- Stops generating if **5+ unreviewed drafts** are already waiting (safety guard).
- You stay in control: review, fact-check, set the permalink + search
  description, add an image, then click Publish.

---

## One-time setup

### 1. This project runs from the existing `sabtools` repository

No separate repo is needed. The `blogger-automation/` folder lives inside your
`sabtools` repo, and the GitHub Actions workflow is already at the repo root:
`.github/workflows/blogger-daily-draft.yml`. It runs alongside your existing
`auto-blog.yml` workflow and does not touch it.

Commit and push the new files to your `sabtools` repo:

```bash
cd "/Volumes/KUSH/claude/sabtools"
git add "blogger-automation" ".github/workflows/blogger-daily-draft.yml"
git commit -m "Add blogger-automation pipeline"
git push
```

### 2. Get a Claude API key

Sign up at <https://console.anthropic.com>, create an API key. This is
`ANTHROPIC_API_KEY`.

### 3. Enable the Blogger API and create OAuth credentials

1. Go to <https://console.cloud.google.com> and create a project.
2. Enable the **Blogger API v3** for that project.
3. Configure the OAuth consent screen (External; add your own Google account as
   a test user).
4. Create an **OAuth client ID** of type **Desktop app**.
5. Download its JSON and save it as `client_secret.json` in this project root.

### 4. Get a Blogger refresh token

```bash
pip install -r requirements.txt
python scripts/get_blogger_token.py
```

A browser opens — sign in with the Google account that owns the blog. The script
prints `BLOGGER_CLIENT_ID`, `BLOGGER_CLIENT_SECRET` and `BLOGGER_REFRESH_TOKEN`.

### 5. Find your Blog ID

In Blogger, open **Settings** — or look at the dashboard URL
(`blogger.com/blog/posts/<BLOG_ID>`). This is `BLOG_ID`.

### 6. (Optional) Email notifications

Email is optional. If you'd rather just check Blogger for new drafts yourself,
skip this entirely — the pipeline works fine without it. To enable email alerts
later, add `SMTP_USER`, `SMTP_PASSWORD` (a Gmail App Password) and `NOTIFY_TO`
as secrets, and notifications turn on automatically.

### 7. Create your `.env`

```bash
cp .env.example .env
```

Fill in every value. Test locally:

```bash
python -m src.pipeline
```

If it works, one draft appears in Blogger and you get an email.

---

## Running it daily on GitHub Actions

1. Push the files to the `sabtools` repo (see step 1 above).
2. In the **`sabtools`** repo on GitHub: **Settings → Secrets and variables →
   Actions → New repository secret**. Add each secret below.

   **Required:**

   | Secret | Value |
   |---|---|
   | `ANTHROPIC_API_KEY` | your Claude API key — *may already exist; reuse it* |
   | `BLOG_ID` | your Blogger blog ID |
   | `BLOGGER_CLIENT_ID` | from setup step 4 |
   | `BLOGGER_CLIENT_SECRET` | from setup step 4 |
   | `BLOGGER_REFRESH_TOKEN` | from the token script |

   **Optional** (skip these — the code uses sensible defaults):

   | Secret | Notes |
   |---|---|
   | `CLAUDE_MODEL` | defaults to `claude-opus-4-7` |
   | `MAX_PENDING_DRAFTS` | defaults to `5` |
   | `SMTP_USER` / `SMTP_PASSWORD` / `NOTIFY_TO` | only if you want email alerts |
   | `SMTP_HOST` / `SMTP_PORT` | only with email; default to Gmail |

3. The workflow (`.github/workflows/blogger-daily-draft.yml`) runs at
   **07:00 IST** daily. You can also trigger it manually from the **Actions**
   tab → *Blogger Daily Draft* → *Run workflow*.

> **Note:** Each daily run commits the updated `topics.json` to the `sabtools`
> repo. The commit message includes `[skip ci]` so it won't re-trigger
> workflows. If your repo auto-deploys to Vercel, that one-file commit may still
> trigger a harmless rebuild — you can ignore it, or add a Vercel "Ignored Build
> Step" later.

---

## Daily routine (your part — about 5-10 minutes)

The pipeline runs every morning and leaves a new draft in Blogger. Check your
Blogger dashboard whenever you want to publish — no email needed.

1. Open Blogger → **Posts → Drafts** → open the newest draft.
2. At the top is a yellow **REVIEW NOTES** box with the suggested permalink and
   search description.
3. Fact-check every number and claim in the post.
4. Set the **custom permalink** and **search description** in Post Settings
   (copy them from the yellow box).
5. Delete the yellow REVIEW NOTES box, then add a header image.
6. Click **Publish**, then **Request Indexing** in Google Search Console.

Tip: publish at a steady human pace (3-4 posts a week for the first month, then
daily). Drafts can safely pile up — the bot pauses at 5 unreviewed drafts.

---

## Managing topics

`config/topics.json` is the editorial queue. The pipeline picks the first topic
with `"status": "pending"` and sets it to `"drafted"` after a successful run.

Add your own topics any time. Keep the rhythm of **3 general topics, then 1
`sabtools` or `comparison` topic** so the 1-in-4 ratio holds. Valid `type`
values: `general`, `sabtools`, `comparison`.

When all topics are `drafted`, the pipeline simply reports "no pending topics" —
add more and it resumes.

---

## Project layout

```
blogger-automation/
├─ README.md
├─ requirements.txt
├─ .env.example            # copy to .env and fill in
├─ .gitignore
├─ config/
│  ├─ content_engine_prompt.md   # the writing system prompt (edit to tune voice)
│  └─ topics.json                # the editorial calendar
├─ src/
│  ├─ generate.py          # Claude content generation
│  ├─ publish.py           # Blogger API v3 — draft creation
│  ├─ notify.py            # email notification
│  └─ pipeline.py          # orchestrator (run: python -m src.pipeline)
└─ scripts/
   └─ get_blogger_token.py # one-time OAuth helper

The GitHub Actions workflow lives at the sabtools repo root, not inside this
folder:
   .github/workflows/blogger-daily-draft.yml
```

---

## Notes and limits

- **Drafts only.** The Blogger API call always uses `isDraft=True`. The pipeline
  has no code path that publishes. This is deliberate — it keeps you compliant
  with Google's stance on unreviewed mass-produced content.
- **Permalink and search description** cannot be set reliably through the
  Blogger API, so the pipeline puts *suggested* values in the notification email
  for you to paste in during review.
- **Cost.** One Opus post per day is roughly a few tens of US cents. Set
  `CLAUDE_MODEL=claude-sonnet-4-6` to cut that significantly.
- **Editing the voice.** To change tone, rules, or structure, edit
  `config/content_engine_prompt.md` — no code changes needed.
- **Tracking the title in Blogger settings.** The API sets the post title and
  body; you still set labels visibility, permalink and search description in the
  Blogger editor during review.
