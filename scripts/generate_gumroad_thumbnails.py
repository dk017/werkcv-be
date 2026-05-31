from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


SIZE = 1600
BG = "#FFFCF2"
TEXT = "#111111"
MUTED = "#475569"
ACCENT = "#FACC15"
ACCENT_SOFT = "#FFF1A8"
WHITE = "#FFFFFF"
BLACK = "#000000"
SLATE = "#E5E7EB"

ARIAL_BOLD = Path(r"C:\Windows\Fonts\arialbd.ttf")
ARIAL = Path(r"C:\Windows\Fonts\arial.ttf")


def load_font(path: Path, size: int):
    try:
        return ImageFont.truetype(str(path), size=size)
    except OSError:
        return ImageFont.load_default()


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font, max_width: int):
    words = text.split()
    lines = []
    current = []
    for word in words:
        candidate = " ".join(current + [word])
        bbox = draw.textbbox((0, 0), candidate, font=font)
        if bbox[2] - bbox[0] <= max_width or not current:
            current.append(word)
        else:
            lines.append(" ".join(current))
            current = [word]
    if current:
        lines.append(" ".join(current))
    return lines


def draw_wrapped(draw, text, font, fill, x, y, max_width, line_gap=8):
    lines = wrap_text(draw, text, font, max_width)
    cursor_y = y
    for line in lines:
        draw.text((x, cursor_y), line, font=font, fill=fill)
        bbox = draw.textbbox((x, cursor_y), line, font=font)
        cursor_y = bbox[3] + line_gap
    return cursor_y


def rounded_box(draw, xy, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def add_subtle_pattern(draw):
    for x in range(80, SIZE, 160):
        for y in range(120, SIZE, 160):
            draw.ellipse((x, y, x + 6, y + 6), fill="#F3F4F6")


def add_cover(base: Image.Image, cover_path: Path, x: int, y: int, target_width: int, angle: float):
    cover = Image.open(cover_path).convert("RGBA")
    aspect = cover.height / cover.width
    target_height = int(target_width * aspect)
    cover = cover.resize((target_width, target_height), Image.Resampling.LANCZOS)

    framed = Image.new("RGBA", (target_width + 24, target_height + 24), (255, 255, 255, 0))
    inner = Image.new("RGBA", (target_width, target_height), WHITE)
    inner_draw = ImageDraw.Draw(inner)
    inner_draw.rectangle((0, 0, target_width - 1, target_height - 1), fill=WHITE, outline=BLACK, width=4)
    inner.alpha_composite(cover, (0, 0))
    framed.alpha_composite(inner, (12, 12))

    shadow = Image.new("RGBA", framed.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle((18, 18, framed.width - 6, framed.height - 6), radius=22, fill=(0, 0, 0, 70))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))

    shadow = shadow.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
    framed = framed.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)

    base.alpha_composite(shadow, (x + 18, y + 24))
    base.alpha_composite(framed, (x, y))


def create_thumbnail(config):
    base = Image.new("RGBA", (SIZE, SIZE), BG)
    draw = ImageDraw.Draw(base)

    title_font = load_font(ARIAL_BOLD, config["title_size"])
    subtitle_font = load_font(ARIAL, 42)
    badge_font = load_font(ARIAL_BOLD, 28)
    chip_font = load_font(ARIAL_BOLD, 26)
    brand_font = load_font(ARIAL_BOLD, 34)
    tiny_font = load_font(ARIAL, 24)

    add_subtle_pattern(draw)

    draw.ellipse((1070, 160, 1560, 650), fill=ACCENT_SOFT)
    draw.rounded_rectangle((940, 1010, 1500, 1320), radius=34, fill=SLATE)

    rounded_box(draw, (90, 92, 442, 158), 18, ACCENT, outline=BLACK, width=3)
    draw.text((122, 110), config["badge"], font=badge_font, fill=TEXT)

    draw_wrapped(
        draw=draw,
        text=config["title"],
        font=title_font,
        fill=TEXT,
        x=92,
        y=230,
        max_width=700,
        line_gap=2,
    )

    subtitle_y = draw_wrapped(
        draw=draw,
        text=config["subtitle"],
        font=subtitle_font,
        fill=MUTED,
        x=96,
        y=config["subtitle_y"],
        max_width=650,
        line_gap=8,
    )

    chip_y = subtitle_y + 24
    chip_specs = config["chips"]
    chip_x = 96
    for chip in chip_specs:
        bbox = draw.textbbox((0, 0), chip, font=chip_font)
        width = bbox[2] - bbox[0] + 42
        rounded_box(draw, (chip_x, chip_y, chip_x + width, chip_y + 54), 18, WHITE, outline=BLACK, width=2)
        draw.text((chip_x + 22, chip_y + 12), chip, font=chip_font, fill=TEXT)
        chip_x += width + 16

    note_y = chip_y + 108
    rounded_box(draw, (96, note_y, 688, note_y + 188), 26, WHITE, outline=BLACK, width=3)
    draw.text((126, note_y + 30), config["note_title"], font=chip_font, fill=TEXT)
    draw_wrapped(
        draw=draw,
        text=config["note_body"],
        font=tiny_font,
        fill=MUTED,
        x=126,
        y=note_y + 76,
        max_width=510,
        line_gap=8,
    )

    rounded_box(draw, (96, 1456, 274, 1516), 16, WHITE, outline=BLACK, width=3)
    draw.text((124, 1471), "WerkCV", font=brand_font, fill=TEXT)

    draw.text((96, 1544), config["footer"], font=tiny_font, fill=MUTED)

    add_cover(
        base=base,
        cover_path=config["cover_path"],
        x=config["cover_x"],
        y=config["cover_y"],
        target_width=config["cover_width"],
        angle=config["cover_angle"],
    )

    output_path = config["output_path"]
    output_path.parent.mkdir(parents=True, exist_ok=True)
    base.convert("RGB").save(output_path, quality=95)
    return output_path


def main():
    configs = [
        {
            "badge": "GRATIS PDF CHECKLIST",
            "title": "Nederlandse CV\nChecklist 2026",
            "title_size": 112,
            "subtitle": "Voor vacatures in Nederland",
            "subtitle_y": 554,
            "chips": ["ATS-vriendelijk", "9 pagina's"],
            "note_title": "Praktisch, niet vaag",
            "note_body": "Snelle controles op structuur, relevantie, leesbaarheid en laatste fouten voordat je solliciteert.",
            "footer": "Werk voor Gumroad met de echte PDF-cover als kern.",
            "cover_path": Path("public/gumroad-previews/nl/nederlandse-cv-checklist-2026-preview-1-cover.png"),
            "cover_x": 890,
            "cover_y": 248,
            "cover_width": 540,
            "cover_angle": -7,
            "output_path": Path("public/gumroad-thumbnails/nl/nederlandse-cv-checklist-2026-thumbnail.png"),
        },
        {
            "badge": "FREE PDF CHECKLIST",
            "title": "English CV Checklist\nfor Jobs in the Netherlands",
            "title_size": 92,
            "subtitle": "For expats and international candidates",
            "subtitle_y": 618,
            "chips": ["ATS-friendly", "9 pages"],
            "note_title": "Built for real applications",
            "note_body": "A short practical checklist for structure, vacancy fit, readability, and final pre-send review.",
            "footer": "Designed locally from the real PDF cover export.",
            "cover_path": Path("public/gumroad-previews/en/english-cv-checklist-netherlands-2026-preview-1-cover.png"),
            "cover_x": 900,
            "cover_y": 252,
            "cover_width": 530,
            "cover_angle": -7,
            "output_path": Path("public/gumroad-thumbnails/en/english-cv-checklist-netherlands-2026-thumbnail.png"),
        },
    ]

    for config in configs:
        output_path = create_thumbnail(config)
        print(output_path)


if __name__ == "__main__":
    main()
