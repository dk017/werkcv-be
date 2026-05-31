from pathlib import Path

import fitz
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.utils import simpleSplit
from reportlab.pdfgen import canvas


PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN = 16 * mm
CONTENT_WIDTH = PAGE_WIDTH - (2 * MARGIN)

PAPER = colors.HexColor("#FFFEF7")
BEFORE_TINT = colors.HexColor("#FFF1EC")
AFTER_TINT = colors.HexColor("#EEF8FF")
TEXT = colors.HexColor("#111111")
MUTED = colors.HexColor("#5B6573")
YELLOW = colors.HexColor("#FACC15")
ROSE = colors.HexColor("#FB7185")
ROSE_SOFT = colors.HexColor("#FFE4E6")
SKY = colors.HexColor("#38BDF8")
SKY_SOFT = colors.HexColor("#E0F2FE")
STONE = colors.HexColor("#E7E5E4")
SLATE = colors.HexColor("#CBD5E1")
WHITE = colors.white
BLACK = colors.black

OUTPUTS = {
    "before_pdf": Path("public/downloads/agency-sample-bron-cv-hr-adviseur.pdf"),
    "after_pdf": Path("public/downloads/agency-sample-client-ready-cv-hr-adviseur.pdf"),
    "before_preview": Path("public/agency-previews/agency-sample-bron-cv-hr-adviseur-page-1.png"),
    "after_preview": Path("public/agency-previews/agency-sample-client-ready-cv-hr-adviseur-page-1.png"),
}


def draw_background(c: canvas.Canvas, fill_color):
    c.setFillColor(fill_color)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)


def draw_box(c: canvas.Canvas, x, y, width, height, fill_color, stroke_color=BLACK, stroke_width=2):
    c.setLineWidth(stroke_width)
    c.setStrokeColor(stroke_color)
    c.setFillColor(fill_color)
    c.rect(x, y, width, height, fill=1, stroke=1)


def draw_badge(c: canvas.Canvas, text: str, x, y, fill_color, text_color=BLACK):
    width = 52 * mm + max(0, (len(text) - 16)) * 1.7
    height = 9 * mm
    draw_box(c, x, y - height, width, height, fill_color, stroke_width=2)
    c.setFillColor(text_color)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(x + 4 * mm, y - 6.1 * mm, text)


def draw_wrapped(
    c: canvas.Canvas,
    text: str,
    x,
    y,
    max_width,
    font_name,
    font_size,
    leading,
    color=TEXT,
):
    c.setFillColor(color)
    c.setFont(font_name, font_size)
    lines = simpleSplit(text, font_name, font_size, max_width)
    cursor = y
    for line in lines:
        c.drawString(x, cursor, line)
        cursor -= leading
    return cursor


def draw_bullets(
    c: canvas.Canvas,
    items,
    x,
    y,
    max_width,
    font_name="Helvetica",
    font_size=10,
    leading=13,
    color=TEXT,
    bullet_color=None,
):
    bullet_color = bullet_color or color
    cursor = y
    bullet_x = x
    text_x = x + 5 * mm
    text_width = max_width - 5 * mm

    for item in items:
        lines = simpleSplit(item, font_name, font_size, text_width)
        c.setFillColor(bullet_color)
        c.setFont("Helvetica-Bold", font_size)
        c.drawString(bullet_x, cursor, "•")
        c.setFillColor(color)
        c.setFont(font_name, font_size)
        line_cursor = cursor
        for line in lines:
            c.drawString(text_x, line_cursor, line)
            line_cursor -= leading
        cursor = line_cursor - 2

    return cursor


def footer(c: canvas.Canvas, note: str):
    c.setLineWidth(1.5)
    c.setStrokeColor(BLACK)
    c.line(MARGIN, 14 * mm, PAGE_WIDTH - MARGIN, 14 * mm)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8.5)
    c.drawString(MARGIN, 9 * mm, note)
    c.drawRightString(PAGE_WIDTH - MARGIN, 9 * mm, "werkcv.nl/agency")


def create_before_pdf(output_path: Path):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(output_path), pagesize=A4)
    c.setTitle("Agency sample bron-CV HR-adviseur")
    c.setAuthor("WerkCV")
    c.setSubject("Fictief bron-CV sample voor WerkCV Agency")

    draw_background(c, PAPER)
    draw_badge(c, "BRON-CV SAMPLE", MARGIN, PAGE_HEIGHT - 14 * mm, ROSE_SOFT, ROSE)

    outer_x = MARGIN
    outer_y = 24 * mm
    outer_w = PAGE_WIDTH - (2 * MARGIN)
    outer_h = PAGE_HEIGHT - (outer_y + 21 * mm)
    draw_box(c, outer_x, outer_y, outer_w, outer_h, BEFORE_TINT, stroke_width=2.5)

    inner_x = outer_x + 7 * mm
    inner_y = outer_y + 7 * mm
    inner_w = outer_w - 14 * mm
    inner_h = outer_h - 14 * mm
    draw_box(c, inner_x, inner_y, inner_w, inner_h, WHITE, stroke_color=colors.HexColor("#B91C1C"), stroke_width=1.5)

    top_y = inner_y + inner_h - 12 * mm
    c.setFillColor(colors.HexColor("#7C2D12"))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(inner_x + 4 * mm, top_y, "CURRICULUM VITAE")

    c.setFillColor(TEXT)
    c.setFont("Times-Bold", 26)
    c.drawString(inner_x + 4 * mm, top_y - 11 * mm, "Sanne Vermeer")

    c.setFillColor(MUTED)
    c.setFont("Times-Italic", 12)
    c.drawString(inner_x + 4 * mm, top_y - 18 * mm, "HR adviseur / recruitment / verzuim / onboarding")

    c.setLineWidth(1)
    c.setDash(2, 2)
    c.setStrokeColor(colors.HexColor("#A8A29E"))
    c.line(inner_x + 4 * mm, top_y - 22 * mm, inner_x + inner_w - 4 * mm, top_y - 22 * mm)
    c.setDash()

    contact_y = top_y - 29 * mm
    contact_text = (
        "Croeselaan 112, 3521 CB Utrecht | 06 27 91 48 33 | "
        "sanne.vermeer.hr@gmail.com | linkedin.com/in/sannevermeerhr"
    )
    contact_cursor = draw_wrapped(
        c,
        contact_text,
        inner_x + 4 * mm,
        contact_y,
        inner_w - 8 * mm,
        "Helvetica",
        9.5,
        12,
        MUTED,
    )
    draw_wrapped(
        c,
        "Geboren 12-08-1992 | Nationaliteit: Nederlands | Rijbewijs B | Beschikbaar in overleg",
        inner_x + 4 * mm,
        contact_cursor - 2,
        inner_w - 8 * mm,
        "Helvetica",
        9.5,
        12,
        MUTED,
    )

    section_y = contact_cursor - 20
    draw_box(c, inner_x + 4 * mm, section_y - 6 * mm, inner_w - 8 * mm, 8 * mm, STONE, stroke_color=STONE, stroke_width=0)
    c.setFillColor(colors.HexColor("#44403C"))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(inner_x + 6 * mm, section_y - 4 * mm, "PROFIEL")

    paragraph_y = section_y - 13 * mm
    profile_text = (
        "Enthousiaste en gedreven HR-professional met brede ervaring op het gebied van instroom, "
        "doorstroom, uitstroom, recruitment, onboarding, verzuim en ondersteuning van leidinggevenden. "
        "Werk graag samen, denk in oplossingen en vind het belangrijk dat medewerkers zich gezien voelen. "
        "Zoek een rol waarin ik zowel operationeel als adviserend kan bijdragen."
    )
    cursor = draw_wrapped(
        c,
        profile_text,
        inner_x + 4 * mm,
        paragraph_y,
        inner_w - 8 * mm,
        "Helvetica",
        10.2,
        13,
        colors.HexColor("#3F3F46"),
    )

    section_y = cursor - 6
    draw_box(c, inner_x + 4 * mm, section_y - 6 * mm, inner_w - 8 * mm, 8 * mm, STONE, stroke_color=STONE, stroke_width=0)
    c.setFillColor(colors.HexColor("#44403C"))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(inner_x + 6 * mm, section_y - 4 * mm, "WERKERVARING")

    cursor = section_y - 13 * mm
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(inner_x + 4 * mm, cursor, "HR Adviseur, logistieke dienstverlener, Utrecht")
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Oblique", 9.5)
    c.drawString(inner_x + 4 * mm, cursor - 12, "04/2022 - heden")
    cursor = draw_wrapped(
        c,
        "Verantwoordelijk voor diverse HR werkzaamheden, waaronder verzuim, recruitment, onboarding, "
        "gesprekken met leidinggevenden en algemene HR ondersteuning voor meerdere teams. "
        "Ook betrokken bij rapportages, arbeidsvoorwaardelijke vragen en dossieropbouw.",
        inner_x + 4 * mm,
        cursor - 28,
        inner_w - 8 * mm,
        "Helvetica",
        10,
        12.5,
        colors.HexColor("#3F3F46"),
    )

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(inner_x + 4 * mm, cursor - 6, "HR Medewerker, zorgorganisatie, Amersfoort")
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Oblique", 9.5)
    c.drawString(inner_x + 4 * mm, cursor - 18, "Jan 2019 t/m mrt 2022")
    cursor = draw_wrapped(
        c,
        "Breed takenpakket in personeelsadministratie, recruitmentondersteuning, contractbeheer, "
        "AFAS-mutaties en ondersteuning van de HR-adviseurs binnen het team. Eerste aanspreekpunt "
        "voor vragen van medewerkers en managers.",
        inner_x + 4 * mm,
        cursor - 34,
        inner_w - 8 * mm,
        "Helvetica",
        10,
        12.5,
        colors.HexColor("#3F3F46"),
    )

    lower_top = cursor - 10
    col_gap = 7 * mm
    col_w = (inner_w - 8 * mm - col_gap) / 2
    left_x = inner_x + 4 * mm
    right_x = left_x + col_w + col_gap

    draw_box(c, left_x, lower_top - 6 * mm, col_w, 8 * mm, STONE, stroke_color=STONE, stroke_width=0)
    draw_box(c, right_x, lower_top - 6 * mm, col_w, 8 * mm, STONE, stroke_color=STONE, stroke_width=0)
    c.setFillColor(colors.HexColor("#44403C"))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(left_x + 2 * mm, lower_top - 4 * mm, "OPLEIDING")
    c.drawString(right_x + 2 * mm, lower_top - 4 * mm, "VAARDIGHEDEN EN SYSTEMEN")

    left_cursor = draw_wrapped(
        c,
        "HBO Human Resource Management\nHogeschool Utrecht\n2014 - 2018",
        left_x,
        lower_top - 13 * mm,
        col_w,
        "Helvetica",
        10,
        12.5,
        colors.HexColor("#3F3F46"),
    )
    left_cursor = draw_wrapped(
        c,
        "Cursus verzuimgesprekken, basis arbeidsrecht, onboarding workshop",
        left_x,
        left_cursor - 6,
        col_w,
        "Helvetica",
        10,
        12.5,
        colors.HexColor("#3F3F46"),
    )

    right_cursor = draw_wrapped(
        c,
        "AFAS, recruitment, onboarding, Word, Excel, PowerPoint, communicatie, samenwerken, verzuim, contractbeheer, gesprekvoering",
        right_x,
        lower_top - 13 * mm,
        col_w,
        "Helvetica",
        10,
        12.5,
        colors.HexColor("#3F3F46"),
    )

    lowest = min(left_cursor, right_cursor)
    extra_y = max(lowest - 8, inner_y + 28 * mm)
    draw_box(c, inner_x + 4 * mm, extra_y - 6 * mm, inner_w - 8 * mm, 8 * mm, STONE, stroke_color=STONE, stroke_width=0)
    c.setFillColor(colors.HexColor("#44403C"))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(inner_x + 6 * mm, extra_y - 4 * mm, "OVERIG")
    note_cursor = draw_wrapped(
        c,
        "BHV certificaat | Basis arbeidsrecht | Outlook / Teams / Excel gevorderd | OR-ondersteuning",
        inner_x + 4 * mm,
        extra_y - 13 * mm,
        inner_w - 8 * mm,
        "Helvetica",
        10,
        12.5,
        colors.HexColor("#3F3F46"),
    )
    draw_wrapped(
        c,
        "Fictief profiel voor agency pilot sample. Zelfde kandidaat als de client-ready versie, maar nog niet opgeschoond voor voorstel.",
        inner_x + 4 * mm,
        note_cursor - 8,
        inner_w - 8 * mm,
        "Helvetica-Oblique",
        8.5,
        10.5,
        MUTED,
    )

    footer(c, "Fictief bron-CV sample voor bureaugesprekken")
    c.showPage()
    c.save()


def create_after_pdf(output_path: Path):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(output_path), pagesize=A4)
    c.setTitle("Agency sample client-ready CV HR-adviseur")
    c.setAuthor("WerkCV")
    c.setSubject("Fictief client-ready kandidaatprofiel voor WerkCV Agency")

    draw_background(c, PAPER)
    draw_badge(c, "CLIENT-READY SAMPLE", MARGIN, PAGE_HEIGHT - 14 * mm, YELLOW, BLACK)

    outer_x = MARGIN
    outer_y = 24 * mm
    outer_w = PAGE_WIDTH - (2 * MARGIN)
    outer_h = PAGE_HEIGHT - (outer_y + 21 * mm)
    draw_box(c, outer_x, outer_y, outer_w, outer_h, WHITE, stroke_width=2.5)

    sidebar_w = 55 * mm
    draw_box(c, outer_x, outer_y, sidebar_w, outer_h, AFTER_TINT, stroke_color=BLACK, stroke_width=2.5)

    main_x = outer_x + sidebar_w + 8 * mm
    main_w = outer_w - sidebar_w - 12 * mm
    top_y = outer_y + outer_h - 14 * mm

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(main_x, top_y, "Sanne Vermeer")
    c.setFont("Helvetica-Bold", 11.5)
    c.setFillColor(colors.HexColor("#0369A1"))
    c.drawString(main_x, top_y - 14, "HR-adviseur | instroom, verzuim en leidinggevende advisering")

    c.setLineWidth(3)
    c.setStrokeColor(BLACK)
    c.line(main_x, top_y - 22, main_x + main_w, top_y - 22)

    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(MUTED)
    c.drawString(main_x, top_y - 34, "KANDIDAATPROFIEL VIA BUREAU")
    c.setFont("Helvetica", 9.5)
    c.drawString(main_x, top_y - 46, "Woonplaats: Utrecht")
    c.drawString(main_x + 47 * mm, top_y - 46, "Beschikbaar: 4 weken")
    c.drawString(main_x, top_y - 58, "Contact en volledige persoonsgegevens via bureau")

    profile_top = top_y - 78
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(main_x, profile_top, "PROFIEL")
    profile_text = (
        "HR-adviseur met 6 jaar ervaring in operationele en adviserend gerichte HR-rollen. "
        "Combineert recruitment, verzuimbegeleiding en onboarding met een rustige stijl naar "
        "leidinggevenden en medewerkers."
    )
    cursor = draw_wrapped(
        c,
        profile_text,
        main_x,
        profile_top - 12,
        main_w,
        "Helvetica",
        10.2,
        13,
        colors.HexColor("#334155"),
    )

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(main_x, cursor - 4, "RECENTE ERVARING")
    cursor = draw_wrapped(
        c,
        "HR-adviseur | logistieke dienstverlener | Utrecht | april 2022 - heden",
        main_x,
        cursor - 18,
        main_w,
        "Helvetica-Bold",
        10.5,
        13,
        TEXT,
    )
    cursor = draw_bullets(
        c,
        [
            "Adviseert leidinggevenden over instroom, verzuim en dossieropbouw voor 4 business units.",
            "Verkortte de time-to-hire van 49 naar 31 dagen door strakkere intake en vacaturebriefing.",
            "Herbouwde onboardingflow voor nieuwe medewerkers; tevredenheid in de eerste 90 dagen steeg naar 8,3.",
        ],
        main_x,
        cursor - 2,
        main_w,
        font_name="Helvetica",
        font_size=10,
        leading=13,
        color=colors.HexColor("#334155"),
        bullet_color=colors.HexColor("#0284C7"),
    )

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(main_x, cursor - 2, "EERDERE ERVARING")
    cursor = draw_wrapped(
        c,
        "HR-medewerker | zorgorganisatie | Amersfoort | januari 2019 - maart 2022",
        main_x,
        cursor - 16,
        main_w,
        "Helvetica-Bold",
        10.5,
        13,
        TEXT,
    )
    cursor = draw_bullets(
        c,
        [
            "Verwerkte personeelsmutaties, contractverlengingen en verzuimregistratie in AFAS.",
            "Ondersteunde recruitment voor ongeveer 20 openstaande vacatures per kwartaal.",
            "Eerste aanspreekpunt voor operationele HR-vragen vanuit lijn en medewerkers.",
        ],
        main_x,
        cursor - 2,
        main_w,
        font_name="Helvetica",
        font_size=10,
        leading=13,
        color=colors.HexColor("#334155"),
        bullet_color=colors.HexColor("#0284C7"),
    )

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(main_x, cursor - 2, "WAT JE HIER SNEL ZIET")
    draw_bullets(
        c,
        [
            "Rustige HR-professional met combinatie van operatie en advies.",
            "Ervaring in recruitment, onboarding en verzuimdossiers binnen groeiende teams.",
            "Kan direct voorstelbaar worden gemaakt zonder extra redactie op de bovenkant.",
        ],
        main_x,
        cursor - 18,
        main_w,
        font_name="Helvetica",
        font_size=10,
        leading=13,
        color=colors.HexColor("#334155"),
        bullet_color=colors.HexColor("#0284C7"),
    )

    sidebar_top = outer_y + outer_h - 15 * mm
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(outer_x + 5 * mm, sidebar_top, "KERNVAARDIGHEDEN")

    badge_x = outer_x + 5 * mm
    badge_y = sidebar_top - 8 * mm
    badge_items = [
        "AFAS",
        "Recruitment",
        "Verzuim",
        "Onboarding",
        "Dossieropbouw",
        "Arbeidsrecht basis",
    ]
    for label in badge_items:
        text_width = c.stringWidth(label, "Helvetica-Bold", 8.5)
        width = text_width + 8 * mm
        if badge_x + width > outer_x + sidebar_w - 5 * mm:
            badge_x = outer_x + 5 * mm
            badge_y -= 9 * mm
        draw_box(c, badge_x, badge_y - 7 * mm, width, 7 * mm, WHITE, stroke_width=1.6)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 8.5)
        c.drawString(badge_x + 3 * mm, badge_y - 4.5 * mm, label)
        badge_x += width + 2.5 * mm

    section_start = badge_y - 15 * mm
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(outer_x + 5 * mm, section_start, "OPLEIDING")
    draw_wrapped(
        c,
        "HBO Human Resource Management\nHogeschool Utrecht",
        outer_x + 5 * mm,
        section_start - 10,
        sidebar_w - 10 * mm,
        "Helvetica",
        9.6,
        12,
        colors.HexColor("#334155"),
    )

    section_start -= 32 * mm
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(TEXT)
    c.drawString(outer_x + 5 * mm, section_start, "TALEN")
    draw_bullets(
        c,
        ["Nederlands moedertaal", "Engels professioneel"],
        outer_x + 5 * mm,
        section_start - 12,
        sidebar_w - 10 * mm,
        font_name="Helvetica",
        font_size=9.6,
        leading=12,
        color=colors.HexColor("#334155"),
        bullet_color=colors.HexColor("#0284C7"),
    )

    section_start -= 28 * mm
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(TEXT)
    c.drawString(outer_x + 5 * mm, section_start, "PRAKTISCH")
    draw_bullets(
        c,
        [
            "Beschikbaar in 4 weken",
            "Contact en volledige gegevens via bureau",
            "Fictief profiel voor pilot demo",
        ],
        outer_x + 5 * mm,
        section_start - 12,
        sidebar_w - 10 * mm,
        font_name="Helvetica",
        font_size=9.6,
        leading=12,
        color=colors.HexColor("#334155"),
        bullet_color=colors.HexColor("#0284C7"),
    )

    footer(c, "Fictief client-ready kandidaatprofiel voor WerkCV Agency")
    c.showPage()
    c.save()


def export_preview(pdf_path: Path, output_path: Path):
    doc = fitz.open(pdf_path)
    try:
        page = doc.load_page(0)
        pix = page.get_pixmap(matrix=fitz.Matrix(2.2, 2.2), alpha=False)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        pix.save(output_path)
    finally:
        doc.close()


def main():
    create_before_pdf(OUTPUTS["before_pdf"])
    print(OUTPUTS["before_pdf"])
    create_after_pdf(OUTPUTS["after_pdf"])
    print(OUTPUTS["after_pdf"])
    export_preview(OUTPUTS["before_pdf"], OUTPUTS["before_preview"])
    print(OUTPUTS["before_preview"])
    export_preview(OUTPUTS["after_pdf"], OUTPUTS["after_preview"])
    print(OUTPUTS["after_preview"])


if __name__ == "__main__":
    main()
