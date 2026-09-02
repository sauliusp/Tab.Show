from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "marketing" / "output"
SCREENSHOTS = OUT / "screenshots"
PROMO = OUT / "promo"
SCREENSHOTS.mkdir(parents=True, exist_ok=True)
PROMO.mkdir(parents=True, exist_ok=True)

CREAM = "#F7F3E9"
PAPER = "#FFFDF7"
INK = "#211D42"
MUTED = "#5F5A72"
ORANGE = "#F36B21"
AMBER = "#FF9A3D"
PALE_AMBER = "#FFE2BD"
RULE = "#D8D1BF"
SOFT = "#EEE8DB"
GREEN = "#20835B"
BLUE = "#356BD8"
WHITE = "#FFFFFF"

REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def font(size: int, bold: bool = False):
    return ImageFont.truetype(BOLD if bold else REGULAR, size)


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def text(draw, xy, value, size, fill=INK, bold=False, anchor=None):
    draw.text(xy, value, font=font(size, bold), fill=fill, anchor=anchor)


def wrapped(draw, xy, value, size, max_width, fill=INK, bold=False, spacing=6):
    words = value.split()
    lines, current = [], ""
    fnt = font(size, bold)
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=fnt)[2] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    y = xy[1]
    for line in lines:
        draw.text((xy[0], y), line, font=fnt, fill=fill)
        y += size + spacing
    return y


def brand(draw, x, y, dark=False, scale=1.0):
    icon = Image.open(ROOT / "public" / "icon" / "128.png").convert("RGB")
    side = round(44 * scale)
    icon = icon.resize((side, side), Image.Resampling.LANCZOS)
    draw._image.paste(icon, (x, y))
    text(draw, (x + side + round(12 * scale), y + side // 2), "TabShow", round(22 * scale), WHITE if dark else INK, True, "lm")


def tab_row(draw, box, letter, title_value, domain, state=None, color=BLUE, badges=None):
    x1, y1, x2, y2 = box
    fill = "#FFF4E8" if state == "PREVIEW" else ("#EEEAF8" if state == "CURRENT" else PAPER)
    outline = ORANGE if state == "PREVIEW" else (INK if state == "CURRENT" else RULE)
    rounded(draw, box, 12, fill, outline, 2 if state else 1)
    rounded(draw, (x1 + 14, y1 + 13, x1 + 50, y1 + 49), 9, color)
    text(draw, (x1 + 32, y1 + 31), letter, 15, WHITE, True, "mm")
    text(draw, (x1 + 62, y1 + 14), title_value, 13, INK, True)
    text(draw, (x1 + 62, y1 + 37), domain, 11, MUTED)
    right = x2 - 14
    if state:
        label_fill = PALE_AMBER if state == "PREVIEW" else INK
        label_text = ORANGE if state == "PREVIEW" else WHITE
        w = 72 if state == "PREVIEW" else 70
        rounded(draw, (right - w, y1 + 20, right, y1 + 43), 7, label_fill)
        text(draw, (right - w / 2, y1 + 31), state.title(), 9, label_text, True, "mm")
        right -= w + 8
    if badges:
        for badge in reversed(badges):
            bw = max(24, draw.textbbox((0, 0), badge, font=font(9, True))[2] + 14)
            rounded(draw, (right - bw, y1 + 20, right, y1 + 43), 7, SOFT, RULE)
            text(draw, (right - bw / 2, y1 + 31), badge, 9, MUTED, True, "mm")
            right -= bw + 6


def panel(draw, x, y, w, h, mode="preview"):
    rounded(draw, (x, y, x + w, y + h), 20, PAPER, INK, 2)
    text(draw, (x + 24, y + 24), "Your tabs", 21, INK, True)
    text(draw, (x + w - 24, y + 29), "•••", 15, MUTED, True, "ra")

    toggle_y = y + 62
    rounded(draw, (x + 20, toggle_y, x + w - 20, toggle_y + 48), 10, "#EFEBDD", RULE)
    all_selected = mode in ("search", "windows")
    half = (w - 40) // 2
    selected_x = x + 24 + (half if all_selected else 0)
    rounded(draw, (selected_x, toggle_y + 4, selected_x + half - 4, toggle_y + 44), 8, INK)
    text(draw, (x + 20 + half / 2, toggle_y + 24), "Current window", 12, WHITE if not all_selected else MUTED, True, "mm")
    text(draw, (x + 20 + half + half / 2, toggle_y + 24), "All windows", 12, WHITE if all_selected else MUTED, True, "mm")

    search_y = toggle_y + 64
    query = "design" if mode in ("search", "keyboard") else ""
    rounded(draw, (x + 20, search_y, x + w - 20, search_y + 52), 10, WHITE, RULE, 2)
    draw.ellipse((x + 36, search_y + 16, x + 51, search_y + 31), outline=MUTED, width=2)
    draw.line((x + 48, search_y + 29, x + 56, search_y + 37), fill=MUTED, width=2)
    text(draw, (x + 66, search_y + 26), query or "Search tabs", 14, INK if query else MUTED, False, "lm")

    meta_y = search_y + 70
    sort_label = "Recently used" if mode in ("search", "keyboard") else ("By domain" if mode == "context" else "Current order")
    rounded(draw, (x + 20, meta_y, x + 152, meta_y + 30), 8, "#F2EEE3", RULE)
    text(draw, (x + 34, meta_y + 15), sort_label, 10, INK, True, "lm")
    count = "6 tabs · 2 windows" if all_selected else "24 tabs"
    text(draw, (x + w - 20, meta_y + 15), count, 10, MUTED, False, "rm")

    list_y = meta_y + 48
    if mode == "windows":
        text(draw, (x + 22, list_y), "WINDOW 1 · LIVE PREVIEW", 9, ORANGE, True)
        tab_row(draw, (x + 20, list_y + 18, x + w - 20, list_y + 82), "D", "Design notes", "docs.google.com", "CURRENT", "#356BD8")
        text(draw, (x + 22, list_y + 104), "WINDOW 2 · CLICK TO SWITCH", 9, MUTED, True)
        tab_row(draw, (x + 20, list_y + 122, x + w - 20, list_y + 186), "L", "Launch tasks", "linear.app", None, "#6C53B5")
        tab_row(draw, (x + 20, list_y + 196, x + w - 20, list_y + 260), "F", "Feedback board", "narsheek.featurebase.app", None, GREEN)
    elif mode == "context":
        tab_row(draw, (x + 20, list_y, x + w - 20, list_y + 66), "M", "Inbox: 3 new", "mail.google.com", None, "#D15D45", ["Audio"])
        tab_row(draw, (x + 20, list_y + 76, x + w - 20, list_y + 142), "D", "Design system", "figma.com", "CURRENT", "#B6387B", ["Pinned"])
        tab_row(draw, (x + 20, list_y + 152, x + w - 20, list_y + 218), "R", "Research notes", "docs.google.com", None, "#356BD8", ["Duplicate"])
        tab_row(draw, (x + 20, list_y + 228, x + w - 20, list_y + 294), "A", "Analytics", "analytics.google.com", None, "#E27722", ["Sleeping"])
    else:
        first_state = None if mode in ("search", "keyboard") else "CURRENT"
        tab_row(draw, (x + 20, list_y, x + w - 20, list_y + 68), "M", "Inbox: 3 new", "mail.google.com", first_state, "#D15D45")
        tab_row(draw, (x + 20, list_y + 78, x + w - 20, list_y + 146), "D", "Design notes", "docs.google.com", "PREVIEW", "#356BD8")
        tab_row(draw, (x + 20, list_y + 156, x + w - 20, list_y + 224), "F", "Feature requests", "narsheek.featurebase.app", None, GREEN)
        if h > 470:
            tab_row(draw, (x + 20, list_y + 234, x + w - 20, list_y + 302), "L", "Launch plan", "linear.app", None, "#6C53B5")


def browser_scene(draw, box, mode):
    x1, y1, x2, y2 = box
    rounded(draw, box, 24, "#E8E1D3", INK, 2)
    content_right = x2 - 390
    rounded(draw, (x1 + 18, y1 + 18, content_right - 10, y2 - 18), 16, PAPER, RULE)
    text(draw, (x1 + 42, y1 + 42), "WORKSPACE", 9, MUTED, True)
    if mode == "preview":
        wrapped(draw, (x1 + 42, y1 + 82), "Quarterly product plan", 25, content_right - x1 - 76, INK, True, 2)
        rounded(draw, (x1 + 42, y1 + 132, content_right - 42, y1 + 176), 9, "#EEEAF8")
        rounded(draw, (x1 + 42, y1 + 202, content_right - 142, y1 + 218), 5, RULE)
        rounded(draw, (x1 + 42, y1 + 232, content_right - 82, y1 + 248), 5, RULE)
        rounded(draw, (x1 + 42, y1 + 280, content_right - 42, y2 - 54), 14, "#F2EEE3", RULE)
        text(draw, (x1 + 62, y1 + 306), "Live page preview", 13, ORANGE, True)
        wrapped(draw, (x1 + 62, y1 + 345), "The page itself appears here.", 20, content_right - x1 - 118, INK, True, 3)
        wrapped(draw, (x1 + 62, y1 + 412), "Move the pointer away and TabShow returns to where you started.", 13, content_right - x1 - 118, MUTED, False, 5)
    elif mode == "search":
        wrapped(draw, (x1 + 42, y1 + 82), "Search every open tab", 25, content_right - x1 - 76, INK, True, 2)
        wrapped(draw, (x1 + 42, y1 + 146), "Title, URL, or domain. Across every window.", 13, content_right - x1 - 76, MUTED, False, 4)
        for i, (label, value) in enumerate((("QUERY", "design"), ("RESULTS", "3 tabs"), ("WINDOWS", "2"))):
            bx = x1 + 42 + i * 94
            rounded(draw, (bx, y1 + 214, bx + 82, y1 + 282), 12, "#F2EEE3", RULE)
            text(draw, (bx + 12, y1 + 226), label, 8, MUTED, True)
            text(draw, (bx + 12, y1 + 252), value, 15, INK, True)
    elif mode == "keyboard":
        text(draw, (x1 + 42, y1 + 82), "Stay in flow", 25, INK, True)
        wrapped(draw, (x1 + 42, y1 + 128), "Select and open without leaving the keyboard.", 13, content_right - x1 - 76, MUTED, False, 4)
        keys = [("↑  ↓", "Select"), ("Enter", "Open"), ("Esc", "Return")]
        for i, (key, label) in enumerate(keys):
            bx = x1 + 42 + i * 94
            rounded(draw, (bx, y1 + 210, bx + 82, y1 + 282), 12, INK)
            text(draw, (bx + 41, y1 + 234), key, 15, WHITE, True, "mm")
            text(draw, (bx + 41, y1 + 263), label, 9, PALE_AMBER, True, "mm")
    elif mode == "windows":
        wrapped(draw, (x1 + 42, y1 + 82), "Every window, one list", 25, content_right - x1 - 76, INK, True, 2)
        wrapped(draw, (x1 + 42, y1 + 146), "Hover here. Click to switch elsewhere.", 13, content_right - x1 - 76, MUTED, False, 4)
        rounded(draw, (x1 + 42, y1 + 190, content_right - 42, y1 + 264), 14, "#FFF4E8", ORANGE, 2)
        text(draw, (x1 + 62, y1 + 210), "SAFE BY DESIGN", 9, ORANGE, True)
        wrapped(draw, (x1 + 62, y1 + 236), "Other windows never steal focus on hover.", 17, content_right - x1 - 140, INK, True)
    else:
        text(draw, (x1 + 42, y1 + 82), "See what matters", 25, INK, True)
        wrapped(draw, (x1 + 42, y1 + 128), "Sort tabs and spot useful context at a glance.", 13, content_right - x1 - 76, MUTED, False, 4)
        labels = ["Pinned", "Audio", "Muted", "Sleeping", "Duplicates", "Groups"]
        for i, label in enumerate(labels):
            row, col = divmod(i, 2)
            bx, by = x1 + 42 + col * 145, y1 + 206 + row * 58
            rounded(draw, (bx, by, bx + 132, by + 42), 10, "#F2EEE3", RULE)
            draw.ellipse((bx + 14, by + 14, bx + 28, by + 28), fill=ORANGE if i < 2 else INK)
            text(draw, (bx + 40, by + 22), label, 13, INK, True, "lm")

    panel(draw, x2 - 372, y1 + 18, 354, y2 - y1 - 36, mode)


def screenshot(index, eyebrow, headline, accent, description, mode):
    image = Image.new("RGB", (1280, 800), CREAM)
    draw = ImageDraw.Draw(image)
    draw._image = image
    brand(draw, 54, 42)
    text(draw, (1226, 64), f"0{index} / 05", 11, MUTED, True, "rm")
    text(draw, (54, 126), eyebrow.upper(), 11, MUTED, True)
    next_y = wrapped(draw, (54, 160), headline, 38, 408, INK, True, 2)
    next_y = wrapped(draw, (54, next_y + 4), accent, 38, 408, ORANGE, True, 2)
    wrapped(draw, (54, next_y + 18), description, 17, 408, MUTED, False, 7)
    browser_scene(draw, (500, 112, 1226, 742), mode)
    text(draw, (54, 730), "Private by design", 11, GREEN, True)
    text(draw, (181, 730), "No host permissions", 11, MUTED, True)
    image.save(SCREENSHOTS / f"0{index}-{mode}.png", optimize=True)


def small_tile():
    image = Image.new("RGB", (440, 280), INK)
    draw = ImageDraw.Draw(image)
    draw._image = image
    icon = Image.open(ROOT / "public" / "icon" / "128.png").convert("RGB").resize((82, 82), Image.Resampling.LANCZOS)
    image.paste(icon, (34, 32))
    text(draw, (136, 50), "TabShow", 24, WHITE, True)
    text(draw, (136, 86), "LIVE TAB PREVIEW", 10, PALE_AMBER, True)
    text(draw, (34, 156), "Preview before", 30, WHITE, True)
    text(draw, (34, 194), "you switch.", 30, AMBER, True)
    draw.line((34, 246, 406, 246), fill="#514A72", width=2)
    draw.ellipse((382, 225, 406, 249), fill=ORANGE)
    image.save(PROMO / "tabshow-small-promo-440x280.png", optimize=True)


def marquee():
    image = Image.new("RGB", (1400, 560), CREAM)
    draw = ImageDraw.Draw(image)
    draw._image = image
    draw.rectangle((0, 0, 585, 560), fill=INK)
    brand(draw, 58, 46, True, 1.05)
    text(draw, (58, 158), "Find the right tab.", 48, WHITE, True)
    text(draw, (58, 216), "Without losing", 48, AMBER, True)
    text(draw, (58, 274), "your place.", 48, AMBER, True)
    wrapped(draw, (58, 356), "Search or point. Preview the live page. Switch or snap back.", 18, 440, "#D7D0E7", False, 7)
    rounded(draw, (58, 452, 262, 506), 11, AMBER)
    text(draw, (160, 479), "Add to Chrome: Free", 15, INK, True, "mm")
    browser_scene(draw, (635, 46, 1360, 518), "preview")
    image.save(PROMO / "tabshow-marquee-1400x560.png", optimize=True)


if __name__ == "__main__":
    screenshot(1, "Live preview", "Find the right tab.", "Without losing your place.", "Point at a tab to see the live page. Click to switch, or move away to snap back.", "preview")
    screenshot(2, "Search", "Search every open tab.", "Across every window.", "Find tabs by title, URL, or domain instead of scanning a crushed tab strip.", "search")
    screenshot(3, "Keyboard", "Move at keyboard speed.", "Select. Open. Return.", "Use Arrow keys, Enter, and Escape to stay in flow while you search.", "keyboard")
    screenshot(4, "All windows", "One list for every window.", "No surprise focus changes.", "Current-window tabs preview on hover. Other-window tabs switch only when clicked.", "windows")
    screenshot(5, "Context", "See useful context.", "Sort tabs your way.", "Spot groups, pinned tabs, audio, sleeping tabs, and duplicates at a glance.", "context")
    small_tile()
    marquee()
    print(f"Rendered launch assets to {OUT}")
