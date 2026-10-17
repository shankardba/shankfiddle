#!/usr/bin/env python3
"""Writes the link-preview (Open Graph / Twitter) block into every public page,
between marker comments, so re-running is idempotent. Title and description
come from each page's own <title> and meta description.

Run from the repo root:  python3 scripts/build-share-meta.py
When shankfiddle.com goes live, change SITE_URL and re-run.
Bump IMAGE_VERSION whenever assets/images/og-image.png changes (iMessage and
others cache previews per image URL)."""
import html
import pathlib
import re

SITE_URL = "https://shankardba.github.io/shankfiddle/"
IMAGE_VERSION = 1
IMAGE_ALT = "shankFiddle: Musician, Philosopher, Artist"
FALLBACK_DESC = "shankFiddle — music, philosophy, and interactive sound tools by Shankar Srinivasan."
SKIP = {"404.html", "aws-launch-plan.html"}

START, END = "<!-- share-meta:start -->", "<!-- share-meta:end -->"
root = pathlib.Path(".")

# Old hand-written homepage block (comment + og:/twitter: lines) that the
# generated block replaces.
OLD_BLOCK = re.compile(
    r"<!-- Share preview \+ search labels\..*?-->\n(?:<meta (?:property=\"og:|name=\"twitter:)[^\n]*\n)+")

def first(pattern, text, default=""):
    m = re.search(pattern, text, re.S)
    return html.unescape(m.group(1).strip()) if m else default

def build(path, text):
    outside = re.sub(re.escape(START) + r".*?" + re.escape(END), "", text, flags=re.S)
    # Pages with no apple-touch-icon of their own make iMessage fall back to the
    # domain-root icon on a GitHub Pages project site, so declare one here.
    icon = [] if "apple-touch-icon" in outside else [
        f'<link rel="apple-touch-icon" href="{SITE_URL}assets/images/apple-touch-icon.png">']
    rel = path.as_posix()
    url = SITE_URL + ("" if rel == "index.html" else rel.removesuffix("index.html"))
    title = first(r"<title>(.*?)</title>", text, "shankFiddle")
    desc = first(r'<meta name="description" content="(.*?)">', text, FALLBACK_DESC)
    esc = lambda s: html.escape(s, quote=True)
    img = f"{SITE_URL}assets/images/og-image.png?v={IMAGE_VERSION}"
    return "\n".join([
        START,
        '<meta property="og:type" content="website">',
        '<meta property="og:site_name" content="shankFiddle">',
        f'<meta property="og:title" content="{esc(title)}">',
        f'<meta property="og:description" content="{esc(desc)}">',
        f'<meta property="og:url" content="{url}">',
        f'<meta property="og:image" content="{img}">',
        '<meta property="og:image:type" content="image/png">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        f'<meta property="og:image:alt" content="{esc(IMAGE_ALT)}">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{esc(title)}">',
        f'<meta name="twitter:description" content="{esc(desc)}">',
        f'<meta name="twitter:image" content="{img}">',
        *icon,
        END,
    ]) + "\n"

pages = [p for p in sorted(root.rglob("*.html"))
         if p.name not in SKIP and p.name != "app.html"
         and not any(part in ("node_modules", ".git") for part in p.parts)]
changed = 0
for p in pages:
    text = p.read_text(encoding="utf-8")
    text = OLD_BLOCK.sub("", text)
    block = build(p, text)
    if START in text:
        new = re.sub(re.escape(START) + r".*?" + re.escape(END) + r"\n", lambda m: block, text, flags=re.S)
    else:
        # Insert right after the meta description (or the <title> if none).
        m = re.search(r'<meta name="description"[^\n]*\n', text) or re.search(r"<title>.*?</title>\n", text)
        if not m:
            print("skipped (no <title>):", p); continue
        new = text[:m.end()] + block + text[m.end():]
    if new != text or new != p.read_text(encoding="utf-8"):
        p.write_text(new, encoding="utf-8"); changed += 1
print(f"{len(pages)} pages processed, {changed} written")
