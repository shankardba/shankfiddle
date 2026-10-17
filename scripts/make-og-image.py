#!/usr/bin/env python3
"""Regenerates assets/images/og-image.png (1200x630 link-preview card).
Pillow + macOS system fonts, 4x supersampled. Run: python3 scripts/make-og-image.py"""
from PIL import Image, ImageDraw, ImageFont

S = 4
W, H = 1200 * S, 630 * S
BG, BG2 = (11, 5, 8), (29, 15, 26)
GOLD, GOLD_L, MUTED = (240, 168, 60), (255, 210, 122), (199, 171, 184)

img = Image.new("RGB", (W, H), BG)
px = img.load()
for y in range(H):                      # soft vertical gradient
    t = y / H
    row = tuple(int(BG[i] + (BG2[i] - BG[i]) * t) for i in range(3))
    for x in range(W):
        px[x, y] = row

logo = Image.open("assets/images/logo.png").convert("RGBA")
size = 340 * S
logo = logo.resize((size, size), Image.Resampling.LANCZOS)
img.paste(logo, (100 * S, (H - size) // 2), logo)

def font(path, idx, px_size):
    return ImageFont.truetype(path, px_size * S, index=idx)

d = ImageDraw.Draw(img)
title = font("/System/Library/Fonts/Supplemental/Didot.ttc", 2, 94)      # bold Didot
sub = font("/System/Library/Fonts/Avenir Next.ttc", 7, 34)                 # medium weight
x0 = 500 * S
d.text((x0, 228 * S), "shankFiddle", font=title, fill=GOLD_L)
d.rectangle((x0, 352 * S, x0 + 90 * S, 356 * S), fill=GOLD)
d.text((x0, 382 * S), "Musician · Philosopher · Artist", font=sub, fill=MUTED)

img.resize((1200, 630), Image.Resampling.LANCZOS).save("assets/images/og-image.png", optimize=True)
print("wrote assets/images/og-image.png")
