from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


REPO_ROOT = Path(__file__).resolve().parents[2]
ASSET_DIR = REPO_ROOT / "wordpress-plugin" / "werkcv-salaris-tools" / "assets"
YELLOW = "#F5CF4D"
TEAL = "#0C7A78"
BLACK = "#101010"
CREAM = "#FFF8E8"
WHITE = "#FFFFFF"


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
  candidates = [
    Path("C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf"),
    Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
  ]

  for candidate in candidates:
    if candidate.exists():
      return ImageFont.truetype(str(candidate), size)

  return ImageFont.load_default()


def draw_calculator(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int, scale: float) -> None:
  radius = int(24 * scale)
  draw.rounded_rectangle((x, y, x + w, y + h), radius=radius, fill=TEAL, outline=BLACK, width=max(2, int(4 * scale)))

  pad = int(22 * scale)
  screen_h = int(h * 0.28)
  screen_box = (x + pad, y + pad, x + w - pad, y + pad + screen_h)
  draw.rounded_rectangle(screen_box, radius=int(14 * scale), fill=CREAM)

  euro_font = load_font(int(44 * scale), bold=True)
  euro_box = draw.textbbox((0, 0), "€", font=euro_font)
  euro_x = screen_box[0] + (screen_box[2] - screen_box[0] - (euro_box[2] - euro_box[0])) / 2
  euro_y = screen_box[1] + (screen_box[3] - screen_box[1] - (euro_box[3] - euro_box[1])) / 2 - (4 * scale)
  draw.text((euro_x, euro_y), "€", font=euro_font, fill=BLACK)

  badge_r = int(28 * scale)
  badge_x = x + w - pad - badge_r * 2
  badge_y = y + pad - int(8 * scale)
  draw.rounded_rectangle((badge_x, badge_y, badge_x + badge_r * 2, badge_y + badge_r * 1.35), radius=int(18 * scale), fill=YELLOW)
  badge_font = load_font(int(20 * scale), bold=True)
  draw.text((badge_x + int(10 * scale), badge_y + int(6 * scale)), "NL", font=badge_font, fill=BLACK)

  grid_top = y + pad + screen_h + int(26 * scale)
  btn_gap = int(14 * scale)
  btn_w = int((w - pad * 2 - btn_gap * 2) / 3)
  btn_h = int((h - (grid_top - y) - pad - btn_gap * 3) / 4)

  for row in range(4):
    for col in range(3):
      bx = x + pad + col * (btn_w + btn_gap)
      by = grid_top + row * (btn_h + btn_gap)
      fill = CREAM if (row + col) % 2 == 0 else WHITE
      draw.rounded_rectangle((bx, by, bx + btn_w, by + btn_h), radius=int(12 * scale), fill=fill)


def save_icon(size: int, filename: str) -> None:
  image = Image.new("RGB", (size, size), YELLOW)
  draw = ImageDraw.Draw(image)

  margin = int(size * 0.12)
  draw.rounded_rectangle((margin, margin, size - margin, size - margin), radius=int(size * 0.14), fill=CREAM)
  draw_calculator(draw, margin + int(size * 0.07), margin + int(size * 0.06), size - margin * 2 - int(size * 0.14), size - margin * 2 - int(size * 0.12), size / 256)

  image.save(ASSET_DIR / filename)


def draw_pill(draw: ImageDraw.ImageDraw, x: int, y: int, text: str, scale: float) -> int:
  font = load_font(int(18 * scale), bold=True)
  box = draw.textbbox((0, 0), text, font=font)
  width = int((box[2] - box[0]) + 36 * scale)
  height = int(34 * scale)
  draw.rounded_rectangle((x, y, x + width, y + height), radius=int(18 * scale), fill=CREAM)
  draw.text((x + int(18 * scale), y + int(7 * scale)), text, font=font, fill=BLACK)
  return width


def save_banner(size: tuple[int, int], filename: str) -> None:
  width, height = size
  image = Image.new("RGB", size, CREAM)
  draw = ImageDraw.Draw(image)

  draw.rectangle((0, 0, width * 0.63, height), fill=YELLOW)
  draw.polygon(
    [
      (width * 0.52, 0),
      (width, 0),
      (width, height),
      (width * 0.68, height),
    ],
    fill=TEAL,
  )

  scale = width / 772
  title_font = load_font(int(34 * scale), bold=True)
  subtitle_font = load_font(int(16 * scale))
  small_font = load_font(int(15 * scale), bold=True)

  left_x = int(44 * scale)
  top_y = int(38 * scale)
  draw.text((left_x, top_y), "WerkCV Salaris Tools", font=small_font, fill=BLACK)

  title = "Nederlandse salaris-tools\nvoor WordPress"
  draw.multiline_text((left_x, top_y + int(26 * scale)), title, font=title_font, fill=BLACK, spacing=int(4 * scale))

  subtitle = "Netto-bruto, vakantiegeld en minimumloon\nvia hosted embeds van WerkCV.nl"
  draw.multiline_text((left_x, top_y + int(122 * scale)), subtitle, font=subtitle_font, fill=BLACK, spacing=int(6 * scale))

  pill_y = top_y + int(190 * scale)
  current_x = left_x
  for label in ["Netto-bruto", "Vakantiegeld", "Minimumloon"]:
    current_x += draw_pill(draw, current_x, pill_y, label, scale) + int(10 * scale)

  calc_w = int(220 * scale)
  calc_h = int(170 * scale)
  calc_x = width - calc_w - int(54 * scale)
  calc_y = int(40 * scale)
  draw_calculator(draw, calc_x, calc_y, calc_w, calc_h, scale)

  image.save(ASSET_DIR / filename)


def main() -> None:
  ASSET_DIR.mkdir(parents=True, exist_ok=True)
  save_icon(128, "icon-128x128.png")
  save_icon(256, "icon-256x256.png")
  save_banner((772, 250), "banner-772x250.png")
  save_banner((1544, 500), "banner-1544x500.png")
  print(f"Saved assets to {ASSET_DIR}")


if __name__ == "__main__":
  main()
