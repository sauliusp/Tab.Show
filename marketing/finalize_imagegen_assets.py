"""Compose authentic TabShow appshots into imagegen editorial campaign scenes.

Imagegen supplies only the tactile problem metaphors. The product UI is captured
from the production React tree and is never regenerated or painted over.
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
BACKGROUNDS = ROOT / "marketing" / "source" / "imagegen" / "editorial"
APPSHOTS = ROOT / "marketing" / "source" / "appshots"
SCREENSHOTS = ROOT / "marketing" / "output" / "screenshots"
PROMO = ROOT / "marketing" / "output" / "promo"
WEB = ROOT / "website" / "public" / "images"
FONT = Path("/System/Library/Fonts/Avenir Next.ttc")

INK = "#211D42"
MUTED = "#5F5A72"
ORANGE = "#E76D1F"
PAPER = "#FFFDF7"
RULE = "#D8D1BF"

SCREENSHOTS.mkdir(parents=True, exist_ok=True)
PROMO.mkdir(parents=True, exist_ok=True)
WEB.mkdir(parents=True, exist_ok=True)


CAMPAIGN = (
    {
        "background": "01-overload-background.png",
        "appshot": "01-preview.png",
        "output": "01-preview.png",
        "eyebrow": "LIVE TAB PREVIEW",
        "problem": "TOO MANY TABS. ONE PAGE YOU NEED.",
        "lines": (("See the page", INK), ("before you", INK), ("switch.", ORANGE)),
        "caption": "Point at a tab to preview the real page.\nMove away to snap back or click to switch.",
    },
    {
        "background": "02-search-background.png",
        "appshot": "02-search.png",
        "output": "02-search.png",
        "eyebrow": "INSTANT TAB SEARCH",
        "problem": "STOP SCANNING EVERY OPEN TAB.",
        "lines": (("Type. Find.", INK), ("Preview.", ORANGE)),
        "caption": "Search titles, URLs, and domains across\nyour open tabs before you switch away.",
    },
    {
        "background": "03-keyboard-background.png",
        "appshot": "03-keyboard.png",
        "output": "03-keyboard.png",
        "eyebrow": "KEYBOARD WORKFLOW",
        "problem": "YOUR HANDS ARE ALREADY ON THE KEYS.",
        "lines": (("Find tabs", INK), ("without the", INK), ("mouse.", ORANGE)),
        "caption": "Arrow keys select. Enter opens.\nHover previews. Escape returns.",
    },
    {
        "background": "04-windows-background.png",
        "appshot": "04-windows.png",
        "output": "04-windows.png",
        "eyebrow": "ALL WINDOWS",
        "problem": "TABS SHOULDN'T DISAPPEAR WITH A WINDOW.",
        "lines": (("Every window.", INK), ("One calm", INK), ("tab list.", ORANGE)),
        "caption": "Search and organize tabs across Chrome\nwindows from one focused side panel.",
    },
    {
        "background": "05-sort-background.png",
        "appshot": "05-context.png",
        "output": "05-context.png",
        "eyebrow": "SORT WITH CONTEXT",
        "problem": "WHEN ORDER BREAKS, FOCUS FOLLOWS.",
        "lines": (("Your tabs,", INK), ("sorted your", INK), ("way.", ORANGE)),
        "caption": "Keep current order or sort by recent use,\ndomain, or tab group when context changes.",
    },
)


def font(size: int, weight: str = "regular") -> ImageFont.FreeTypeFont:
    index = {"bold": 0, "demi": 2, "medium": 5, "regular": 7}[weight]
    return ImageFont.truetype(str(FONT), size, index=index)


def cover(source: Image.Image, size: tuple[int, int]) -> Image.Image:
    return ImageOps.fit(source.convert("RGB"), size, Image.Resampling.LANCZOS, centering=(0.5, 0.5))


def rounded_appshot(source: Image.Image, width: int, height: int, radius: int, shadow: int) -> Image.Image:
    ui = source.convert("RGB").resize((width, height), Image.Resampling.LANCZOS)
    mask = Image.new("L", (width, height), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, width - 1, height - 1), radius=radius, fill=255)

    layer = Image.new("RGBA", (width + shadow * 4, height + shadow * 4), (0, 0, 0, 0))
    offset = shadow * 2
    shadow_mask = Image.new("L", layer.size, 0)
    ImageDraw.Draw(shadow_mask).rounded_rectangle(
        (offset, offset + shadow // 2, offset + width - 1, offset + height - 1 + shadow // 2),
        radius=radius,
        fill=118,
    )
    shadow_mask = shadow_mask.filter(ImageFilter.GaussianBlur(shadow))
    shadow_color = Image.new("RGBA", layer.size, (33, 29, 66, 120))
    layer.alpha_composite(Image.composite(shadow_color, Image.new("RGBA", layer.size), shadow_mask))
    layer.paste(ui, (offset, offset), mask)
    border = ImageDraw.Draw(layer)
    border.rounded_rectangle(
        (offset, offset, offset + width - 1, offset + height - 1),
        radius=radius,
        outline=(33, 29, 66, 86),
        width=max(1, width // 320),
    )
    return layer


def draw_tracking(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, face: ImageFont.FreeTypeFont, fill: str, tracking: int) -> None:
    x, y = xy
    for character in text:
        draw.text((x, y), character, font=face, fill=fill)
        x += round(draw.textlength(character, font=face)) + tracking


def compose(item: dict[str, object], size: tuple[int, int], destination: Path) -> None:
    scale = size[0] / 1280
    canvas = cover(Image.open(BACKGROUNDS / str(item["background"])), size).convert("RGBA")

    # A feather-light paper wash protects small copy without hiding the generated scene.
    wash = Image.new("RGBA", size, (255, 253, 247, 0))
    wash_draw = ImageDraw.Draw(wash)
    wash_draw.rounded_rectangle(
        (int(46 * scale), int(42 * scale), int(690 * scale), int(580 * scale)),
        radius=int(28 * scale),
        fill=(255, 253, 247, 210),
    )
    wash = wash.filter(ImageFilter.GaussianBlur(int(22 * scale)))
    canvas.alpha_composite(wash)

    draw = ImageDraw.Draw(canvas)
    left = int(62 * scale)
    top = int(58 * scale)
    rule_width = int(54 * scale)
    rule_y = top + int(13 * scale)
    draw.rounded_rectangle((left, rule_y, left + rule_width, rule_y + max(3, int(4 * scale))), radius=3, fill=ORANGE)
    draw_tracking(draw, (left + int(72 * scale), top), str(item["eyebrow"]), font(int(14 * scale), "demi"), INK, max(1, int(2 * scale)))

    problem_y = top + int(45 * scale)
    draw_tracking(draw, (left, problem_y), str(item["problem"]), font(int(11 * scale), "demi"), MUTED, max(1, int(1.4 * scale)))

    heading_y = top + int(90 * scale)
    heading_face = font(int(61 * scale), "bold")
    line_gap = int(61 * scale)
    for line, color in item["lines"]:
        draw.text((left, heading_y), str(line), font=heading_face, fill=str(color), stroke_width=0)
        heading_y += line_gap

    caption_y = heading_y + int(22 * scale)
    caption_face = font(int(21 * scale), "demi")
    draw.multiline_text((left, caption_y), str(item["caption"]), font=caption_face, fill=INK, spacing=int(8 * scale))

    # Brand signature is quiet and consistent across the sequence.
    icon_size = int(34 * scale)
    brand_y = size[1] - int(74 * scale)
    icon = Image.open(ROOT / "public" / "icon" / "128.png").convert("RGBA").resize((icon_size, icon_size), Image.Resampling.LANCZOS)
    canvas.alpha_composite(icon, (left, brand_y))
    draw.text((left + icon_size + int(12 * scale), brand_y - int(2 * scale)), "TabShow", font=font(int(23 * scale), "bold"), fill=INK)
    draw.text((left + icon_size + int(12 * scale), brand_y + int(25 * scale)), "LIVE TAB PREVIEW FOR CHROME", font=font(int(9 * scale), "demi"), fill=MUTED)

    app_width = int(374 * scale)
    app_height = int(712 * scale)
    app = rounded_appshot(Image.open(APPSHOTS / str(item["appshot"])), app_width, app_height, int(12 * scale), int(12 * scale))
    app_x = size[0] - int(42 * scale) - app_width - int(24 * scale)
    app_y = int(20 * scale) - int(24 * scale)
    canvas.alpha_composite(app, (app_x, app_y))

    canvas.convert("RGB").filter(ImageFilter.UnsharpMask(radius=0.55, percent=108, threshold=3)).save(destination, "PNG", optimize=True)


def compose_small_promo() -> None:
    size = (440, 280)
    canvas = cover(Image.open(BACKGROUNDS / "small-promo-background-v2.png"), size).convert("RGBA")
    draw = ImageDraw.Draw(canvas)
    icon = Image.open(ROOT / "public" / "icon" / "128.png").convert("RGBA").resize((38, 38), Image.Resampling.LANCZOS)
    canvas.alpha_composite(icon, (27, 24))
    draw.text((76, 23), "TabShow", font=font(25, "bold"), fill=PAPER)

    draw.text((27, 99), "Preview the page", font=font(27, "bold"), fill=PAPER)
    draw.text((27, 133), "before you switch.", font=font(27, "bold"), fill="#FF9A3D")

    app_source = Image.open(APPSHOTS / "01-preview.png")
    app_source = app_source.crop((0, 0, app_source.width, 690))
    app = rounded_appshot(app_source, 160, 263, 7, 7)
    canvas.alpha_composite(app, (262, -5))
    canvas.convert("RGB").filter(ImageFilter.UnsharpMask(radius=0.45, percent=115, threshold=2)).save(
        PROMO / "tabshow-small-promo-440x280.png", "PNG", optimize=True
    )


def compose_marquee() -> None:
    size = (1400, 560)
    canvas = cover(Image.open(BACKGROUNDS / "marquee-background.png"), size).convert("RGBA")
    wash = Image.new("RGBA", size, (255, 253, 247, 0))
    ImageDraw.Draw(wash).rounded_rectangle((170, 54, 940, 500), radius=38, fill=(255, 253, 247, 218))
    canvas.alpha_composite(wash.filter(ImageFilter.GaussianBlur(26)))
    draw = ImageDraw.Draw(canvas)

    icon = Image.open(ROOT / "public" / "icon" / "128.png").convert("RGBA").resize((48, 48), Image.Resampling.LANCZOS)
    canvas.alpha_composite(icon, (190, 88))
    draw.text((252, 87), "TabShow", font=font(32, "bold"), fill=INK)
    draw.text((252, 124), "LIVE TAB PREVIEW FOR CHROME", font=font(10, "demi"), fill=MUTED)

    draw.text((190, 180), "See the page", font=font(64, "bold"), fill=INK)
    draw.text((190, 250), "before you switch.", font=font(64, "bold"), fill=ORANGE)
    draw.text((194, 340), "Point at any tab to preview the real page. Move away to snap back.", font=font(22, "demi"), fill=INK)
    draw.rounded_rectangle((194, 407, 465, 455), radius=24, fill=INK)
    draw.text((225, 418), "POINT  ·  PREVIEW  ·  DECIDE", font=font(12, "demi"), fill=PAPER)

    app = rounded_appshot(Image.open(APPSHOTS / "01-preview.png"), 270, 514, 10, 12)
    canvas.alpha_composite(app, (1400 - 270 - 42 - 24, 9 - 24))
    canvas.convert("RGB").filter(ImageFilter.UnsharpMask(radius=0.5, percent=110, threshold=2)).save(
        PROMO / "tabshow-marquee-1400x560.png", "PNG", optimize=True
    )


def compose_social_card() -> None:
    size = (1200, 630)
    canvas = cover(Image.open(BACKGROUNDS / "website-social-background.png"), size).convert("RGBA")
    wash = Image.new("RGBA", size, (255, 253, 247, 0))
    ImageDraw.Draw(wash).rounded_rectangle((265, 45, 900, 585), radius=34, fill=(255, 253, 247, 222))
    canvas.alpha_composite(wash.filter(ImageFilter.GaussianBlur(24)))
    draw = ImageDraw.Draw(canvas)

    icon = Image.open(ROOT / "public" / "icon" / "128.png").convert("RGBA").resize((48, 48), Image.Resampling.LANCZOS)
    canvas.alpha_composite(icon, (310, 76))
    draw.text((372, 75), "TabShow", font=font(33, "bold"), fill=INK)
    draw.text((372, 113), "LIVE TAB PREVIEW FOR CHROME", font=font(10, "demi"), fill=MUTED)
    draw.text((310, 175), "Find the right tab", font=font(54, "bold"), fill=INK)
    draw.text((310, 235), "before you", font=font(54, "bold"), fill=INK)
    draw.text((310, 295), "switch.", font=font(54, "bold"), fill=ORANGE)
    draw.text((314, 385), "Search or point at a tab. Preview the live page.\nSwitch or move away to snap back.", font=font(21, "demi"), fill=INK, spacing=9)

    app = rounded_appshot(Image.open(APPSHOTS / "01-preview.png"), 256, 488, 10, 11)
    canvas.alpha_composite(app, (1200 - 256 - 32 - 22, 49 - 22))
    canvas.convert("RGB").filter(ImageFilter.UnsharpMask(radius=0.5, percent=110, threshold=2)).save(
        WEB / "tabshow-social-card.png", "PNG", optimize=True
    )


for campaign_item in CAMPAIGN:
    compose(campaign_item, (1280, 800), SCREENSHOTS / str(campaign_item["output"]))
    compose(campaign_item, (1584, 990), WEB / f"store-{campaign_item['output']}")

compose_small_promo()
compose_marquee()
compose_social_card()

print("Composited five authentic screenshots, two promo tiles, and website campaign images.")
