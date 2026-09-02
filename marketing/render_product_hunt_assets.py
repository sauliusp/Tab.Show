"""Render Product Hunt assets from authentic TabShow 2.0 appshots.

Imagegen supplies only the thumbnail's editorial tab background and the
existing campaign scenery. Product UI, icon, typography, and copy are composed
deterministically so the launch never presents invented interface pixels.
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "marketing" / "output" / "product-hunt"
GALLERY = OUTPUT / "gallery"
APPSHOTS = ROOT / "marketing" / "source" / "appshots"
CAMPAIGN = ROOT / "marketing" / "output" / "screenshots"
EDITORIAL = ROOT / "marketing" / "source" / "imagegen" / "editorial"
PH_EDITORIAL = ROOT / "marketing" / "source" / "imagegen" / "product-hunt"
ICON = ROOT / "public" / "icon" / "128.png"
FONT = Path("/System/Library/Fonts/Avenir Next.ttc")

CREAM = "#F7F3E9"
PAPER = "#FFFDF7"
INK = "#211D42"
MUTED = "#5F5A72"
ORANGE = "#E76D1F"
RULE = "#D8D1BF"

OUTPUT.mkdir(parents=True, exist_ok=True)
GALLERY.mkdir(parents=True, exist_ok=True)


def font(size: int, weight: str = "regular") -> ImageFont.FreeTypeFont:
    index = {"bold": 0, "demi": 2, "medium": 5, "regular": 7}[weight]
    return ImageFont.truetype(str(FONT), size, index=index)


def fit(source: Image.Image, size: tuple[int, int], centering: tuple[float, float] = (0.5, 0.5)) -> Image.Image:
    return ImageOps.fit(source.convert("RGB"), size, Image.Resampling.LANCZOS, centering=centering)


def rounded_appshot(source: Image.Image, width: int, height: int, radius: int = 12) -> Image.Image:
    ui = source.convert("RGB").resize((width, height), Image.Resampling.LANCZOS)
    mask = Image.new("L", (width, height), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, width - 1, height - 1), radius=radius, fill=255)

    pad = 38
    layer = Image.new("RGBA", (width + pad * 2, height + pad * 2), (0, 0, 0, 0))
    shadow_mask = Image.new("L", layer.size, 0)
    ImageDraw.Draw(shadow_mask).rounded_rectangle(
        (pad, pad + 5, pad + width - 1, pad + height + 4),
        radius=radius,
        fill=132,
    )
    shadow_mask = shadow_mask.filter(ImageFilter.GaussianBlur(14))
    shadow = Image.new("RGBA", layer.size, (33, 29, 66, 118))
    layer.alpha_composite(Image.composite(shadow, Image.new("RGBA", layer.size), shadow_mask))
    layer.paste(ui, (pad, pad), mask)
    ImageDraw.Draw(layer).rounded_rectangle(
        (pad, pad, pad + width - 1, pad + height - 1),
        radius=radius,
        outline=(33, 29, 66, 90),
        width=2,
    )
    return layer


def render_thumbnail() -> None:
    size = (240, 240)
    background = fit(Image.open(PH_EDITORIAL / "thumbnail-background.png"), size)
    canvas = background.convert("RGBA")

    halo = Image.new("RGBA", size, (0, 0, 0, 0))
    halo_draw = ImageDraw.Draw(halo)
    halo_draw.rounded_rectangle((38, 38, 202, 202), radius=38, fill=(255, 253, 247, 238))
    canvas.alpha_composite(halo.filter(ImageFilter.GaussianBlur(9)))

    icon = Image.open(ICON).convert("RGBA").resize((136, 136), Image.Resampling.LANCZOS)
    shadow = Image.new("RGBA", size, (0, 0, 0, 0))
    shadow_mask = Image.new("L", size, 0)
    ImageDraw.Draw(shadow_mask).rounded_rectangle((57, 62, 193, 198), radius=28, fill=122)
    shadow_mask = shadow_mask.filter(ImageFilter.GaussianBlur(12))
    shadow.alpha_composite(Image.composite(Image.new("RGBA", size, (33, 29, 66, 116)), Image.new("RGBA", size), shadow_mask))
    canvas.alpha_composite(shadow)
    canvas.alpha_composite(icon, (52, 52))

    ImageDraw.Draw(canvas).rounded_rectangle((1, 1, 238, 238), radius=34, outline=(33, 29, 66, 46), width=2)
    canvas.convert("RGB").filter(ImageFilter.UnsharpMask(radius=0.45, percent=120, threshold=2)).save(
        OUTPUT / "tabshow-producthunt-thumbnail-240x240.png", "PNG", optimize=True
    )


def render_cover() -> None:
    size = (1270, 760)
    canvas = fit(Image.open(EDITORIAL / "website-social-background.png"), size, centering=(0.47, 0.5)).convert("RGBA")

    wash = Image.new("RGBA", size, (255, 253, 247, 0))
    ImageDraw.Draw(wash).rounded_rectangle((210, 50, 905, 705), radius=42, fill=(255, 253, 247, 224))
    canvas.alpha_composite(wash.filter(ImageFilter.GaussianBlur(28)))
    draw = ImageDraw.Draw(canvas)

    icon = Image.open(ICON).convert("RGBA").resize((52, 52), Image.Resampling.LANCZOS)
    canvas.alpha_composite(icon, (245, 91))
    draw.text((313, 91), "TabShow", font=font(36, "bold"), fill=INK)
    draw.text((314, 133), "LIVE TAB PREVIEW FOR CHROME", font=font(11, "demi"), fill=MUTED)

    draw.text((245, 206), "Find the right tab", font=font(62, "bold"), fill=INK)
    draw.text((245, 278), "before you switch.", font=font(62, "bold"), fill=ORANGE)
    draw.multiline_text(
        (250, 381),
        "Search or point at an open tab.\nPreview the live page. Switch or snap back.",
        font=font(22, "demi"),
        fill=INK,
        spacing=10,
    )

    draw.rounded_rectangle((249, 505, 611, 559), radius=27, fill=INK)
    draw.text((286, 521), "SEARCH  ·  PREVIEW  ·  DECIDE", font=font(13, "demi"), fill=PAPER)
    draw.text((250, 609), "FREE", font=font(12, "demi"), fill=INK)
    draw.ellipse((305, 616, 311, 622), fill=ORANGE)
    draw.text((328, 609), "NO ACCOUNT", font=font(12, "demi"), fill=INK)
    draw.ellipse((441, 616, 447, 622), fill=ORANGE)
    draw.text((464, 609), "NO HOST PERMISSIONS", font=font(12, "demi"), fill=INK)

    app = rounded_appshot(Image.open(APPSHOTS / "01-preview.png"), 333, 634, 12)
    canvas.alpha_composite(app, (1270 - 333 - 58 - 38, 25 - 38))
    canvas.convert("RGB").filter(ImageFilter.UnsharpMask(radius=0.5, percent=115, threshold=2)).save(
        GALLERY / "01-cover.png", "PNG", optimize=True
    )


def render_campaign_frames() -> None:
    frames = (
        ("01-preview.png", "02-live-preview.png"),
        ("02-search.png", "03-search.png"),
        ("03-keyboard.png", "04-keyboard.png"),
        ("04-windows.png", "05-all-windows.png"),
        ("05-context.png", "06-context-and-sorting.png"),
    )
    for source_name, destination_name in frames:
        source = Image.open(CAMPAIGN / source_name).convert("RGB")
        resized = source.resize((1216, 760), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (1270, 760), CREAM)
        canvas.paste(resized, (27, 0))
        canvas.filter(ImageFilter.UnsharpMask(radius=0.45, percent=110, threshold=2)).save(
            GALLERY / destination_name, "PNG", optimize=True
        )


render_thumbnail()
render_cover()
render_campaign_frames()
print(f"Rendered Product Hunt thumbnail and six gallery images to {OUTPUT}")
