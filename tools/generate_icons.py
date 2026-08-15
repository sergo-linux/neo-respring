#!/usr/bin/env python3
"""Render the NeoRespring app icons.

The mark is full-bleed on purpose: the blue-violet gradient covers the entire
square and the glyph sits large and centred on top of it, so the icon never
looks like a small logo parked in a corner of a plain tile.

Geometry lives in a 1000x1000 design space and is shared with
assets/icons/logo.svg, so the raster icons and the in-app SVG mark stay
identical.

Usage:  python3 tools/generate_icons.py
Requires: Pillow
"""

from __future__ import annotations

import math
import os

from PIL import Image, ImageDraw, ImageFilter

OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "icons")

# --- design space -----------------------------------------------------------
D = 1000.0          # design canvas
CX = CY = 500.0     # centre
RING_R = 300.0      # ring radius (centre line of the stroke)
RING_W = 96.0       # ring stroke width
ARC_FROM = 45.0     # degrees, math convention (0 = east, CCW positive)
ARC_TO = 342.0      # sweep goes 45 -> 90 -> 180 -> 270 -> 342 (297 deg)
HEAD_LEN = 118.0    # arrow head, tip distance from the ring end point
HEAD_BACK = 68.0    # arrow head, base sits behind the end point and swallows its cap
HEAD_HALF = 99.0    # arrow head, half width of the base
BOLT_SCALE = 0.92   # bolt size inside the ring

# Blue-violet ("синефиолетовый") ramp, matching --grad-* in the stylesheet.
GRAD_A = (58, 40, 224)     # #3A28E0 deep blue-violet
GRAD_B = (109, 62, 246)    # #6D3EF6 blue-violet
GRAD_C = (155, 82, 249)    # #9B52F9 violet
GLOW = (150, 143, 255)     # #968FFF highlight bloom

SS = 4  # supersampling factor for the glyph layer


def polar(deg: float, r: float) -> tuple[float, float]:
    """Design-space point on a circle: 0deg = east, positive = counter-clockwise."""
    a = math.radians(deg)
    return CX + r * math.cos(a), CY - r * math.sin(a)


def background(size: int) -> Image.Image:
    """Diagonal blue-violet gradient + soft corner bloom + gentle vignette."""
    small = 96
    g = Image.new("RGB", (small, small))
    px = g.load()
    for y in range(small):
        for x in range(small):
            # diagonal ramp, top-left (blue) -> bottom-right (violet)
            t = (x / (small - 1) * 0.55) + (y / (small - 1) * 0.45)
            if t < 0.5:
                k = t / 0.5
                c = [GRAD_A[i] + (GRAD_B[i] - GRAD_A[i]) * k for i in range(3)]
            else:
                k = (t - 0.5) / 0.5
                c = [GRAD_B[i] + (GRAD_C[i] - GRAD_B[i]) * k for i in range(3)]

            # bloom near the top-left third
            dx = (x - small * 0.28) / (small * 0.72)
            dy = (y - small * 0.22) / (small * 0.72)
            bloom = max(0.0, 1.0 - math.hypot(dx, dy)) ** 2 * 0.42
            c = [c[i] + (GLOW[i] - c[i]) * bloom for i in range(3)]

            # vignette toward the bottom-right corner
            vx = (x - small * 0.86) / (small * 0.9)
            vy = (y - small * 0.92) / (small * 0.9)
            vig = max(0.0, 1.0 - math.hypot(vx, vy)) ** 2 * 0.30
            c = [c[i] * (1.0 - vig) for i in range(3)]

            px[x, y] = tuple(max(0, min(255, int(round(v)))) for v in c)
    return g.resize((size, size), Image.LANCZOS)


def glyph_mask(size: int, scale: float, bolt: bool = True) -> Image.Image:
    """Alpha mask of the respring glyph (circular arrow + bolt), anti-aliased."""
    canvas = size * SS
    unit = canvas / D * scale
    off = canvas / 2.0 - (D / 2.0) * unit  # keeps the glyph centred while scaling

    def pt(p: tuple[float, float]) -> tuple[float, float]:
        return off + p[0] * unit, off + p[1] * unit

    mask = Image.new("L", (canvas, canvas), 0)
    d = ImageDraw.Draw(mask)

    # Arc, stamped as overlapping discs so the caps and joins are perfectly round.
    r = RING_W / 2.0 * unit
    steps = int((ARC_TO - ARC_FROM) * 4)
    for i in range(steps + 1):
        deg = ARC_FROM + (ARC_TO - ARC_FROM) * i / steps
        x, y = pt(polar(deg, RING_R))
        d.ellipse((x - r, y - r, x + r, y + r), fill=255)

    # Arrow head, sitting tangentially at the end of the sweep.
    a = math.radians(ARC_TO)
    dirx, diry = -math.sin(a), -math.cos(a)      # travel direction in screen space
    perx, pery = -diry, dirx                     # 90deg rotation
    ex, ey = polar(ARC_TO, RING_R)
    tip = (ex + dirx * HEAD_LEN, ey + diry * HEAD_LEN)
    base = (ex - dirx * HEAD_BACK, ey - diry * HEAD_BACK)
    left = (base[0] + perx * HEAD_HALF, base[1] + pery * HEAD_HALF)
    right = (base[0] - perx * HEAD_HALF, base[1] - pery * HEAD_HALF)
    d.polygon([pt(tip), pt(left), pt(right)], fill=255)

    # Bolt inside the ring: the "neo" spark of a very fast restart.
    if bolt:
        pts = [(543, 366), (428, 524), (494, 524), (457, 634), (572, 468), (502, 468)]
        pts = [(500 + (bx - 500) * BOLT_SCALE, 500 + (by - 500) * BOLT_SCALE) for bx, by in pts]
        d.polygon([pt(p) for p in pts], fill=255)

    return mask.resize((size, size), Image.LANCZOS)


def render(size: int, glyph_scale: float = 1.0, bolt: bool = True) -> Image.Image:
    """Full-bleed icon: gradient edge to edge, glyph in white with a soft shadow."""
    img = background(size).convert("RGBA")
    mask = glyph_mask(size, glyph_scale, bolt)

    shadow = mask.filter(ImageFilter.GaussianBlur(max(1.0, size * 0.018)))
    shadow = shadow.point(lambda v: int(v * 0.34))
    shadow_layer = Image.new("RGBA", (size, size), (26, 8, 66, 255))
    shadow_layer.putalpha(shadow)
    off = max(1, int(round(size * 0.014)))
    img.alpha_composite(shadow_layer, (0, off))

    white = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    white.putalpha(mask)
    img.alpha_composite(white)
    return img


def find_font(bold: bool = True) -> str | None:
    """Best-effort lookup for a sans font; the social card degrades to glyph-only."""
    env = os.environ.get("NEORESPRING_FONT_BOLD" if bold else "NEORESPRING_FONT")
    candidates = [env] if env else []
    names = (
        ["Outfit-Bold.ttf", "DejaVuSans-Bold.ttf", "Arial Bold.ttf", "Helvetica-Bold.ttf"]
        if bold
        else ["Outfit-Regular.ttf", "DejaVuSans.ttf", "Arial.ttf", "Helvetica.ttf"]
    )
    roots = [
        "/usr/share/fonts/truetype/dejavu",
        "/usr/share/fonts/truetype",
        "/usr/share/fonts",
        "/Library/Fonts",
        "/System/Library/Fonts",
    ]
    for root in roots:
        for n in names:
            candidates.append(os.path.join(root, n))
    for c in candidates:
        if c and os.path.exists(c):
            return c
    return None


def social_card(w: int = 1200, h: int = 630) -> Image.Image:
    """Open Graph card: full-bleed gradient, the mark on the left, wordmark beside it."""
    card = background(max(w, h)).convert("RGBA").resize((w, h), Image.LANCZOS)

    icon = 380
    m = glyph_mask(icon, 1.0)
    shadow = Image.new("RGBA", (icon, icon), (24, 6, 62, 255))
    shadow.putalpha(m.filter(ImageFilter.GaussianBlur(9)).point(lambda v: int(v * 0.35)))
    glyph = Image.new("RGBA", (icon, icon), (255, 255, 255, 255))
    glyph.putalpha(m)
    left, top = 96, (h - icon) // 2
    card.alpha_composite(shadow, (left, top + 8))
    card.alpha_composite(glyph, (left, top))

    font_path = find_font(True)
    font_path_r = find_font(False) or font_path
    if font_path:
        from PIL import ImageFont

        d = ImageDraw.Draw(card)
        tx = left + icon + 72
        avail = w - tx - 96

        def fit(text: str, path: str, start: int) -> "ImageFont.FreeTypeFont":
            size = start
            while size > 12:
                f = ImageFont.truetype(path, size)
                if d.textlength(text, font=f) <= avail:
                    return f
                size -= 2
            return ImageFont.truetype(path, 12)

        title = fit("NeoRespring", font_path, 104)
        sub = fit("Web Respring in one tap", font_path_r, 40)
        d.text((tx, h // 2 - 88), "NeoRespring", font=title, fill=(255, 255, 255, 255))
        d.text((tx + 3, h // 2 + 34), "Web Respring in one tap", font=sub, fill=(255, 255, 255, 214))
    return card


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)

    jobs = [
        ("icon-192.png", 192, 1.04, True),
        ("icon-512.png", 512, 1.04, True),
        ("icon-maskable-192.png", 192, 0.74, True),   # glyph inside the 80% safe zone
        ("icon-maskable-512.png", 512, 0.74, True),
        ("apple-touch-icon.png", 180, 1.04, True),
        ("favicon-32.png", 32, 1.10, True),
        ("favicon-16.png", 16, 1.16, False),          # bolt turns to mush this small
    ]
    for name, size, scale, bolt in jobs:
        img = render(size, scale, bolt)
        img.save(os.path.join(OUT_DIR, name), optimize=True)
        print("wrote", name, f"{size}x{size}")

    ico = render(64, 1.08)
    ico.save(os.path.join(OUT_DIR, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])
    print("wrote favicon.ico")

    social_card().convert("RGB").save(os.path.join(OUT_DIR, "og-image.png"), optimize=True, quality=92)
    print("wrote og-image.png 1200x630")


if __name__ == "__main__":
    main()
