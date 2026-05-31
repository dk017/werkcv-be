from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN = 18 * mm
CONTENT_WIDTH = PAGE_WIDTH - (2 * MARGIN)

ACCENT = colors.HexColor("#FACC15")
PAPER = colors.HexColor("#FFFEF0")
TEXT = colors.HexColor("#111111")
MUTED = colors.HexColor("#475569")
GREEN = colors.HexColor("#86EFAC")
BLUE = colors.HexColor("#BFDBFE")
RED = colors.HexColor("#FECACA")

NL_OUTPUT_PATH = Path("public/downloads/nederlandse-cv-checklist-2026.pdf")
EN_OUTPUT_PATH = Path("public/downloads/english-cv-checklist-netherlands-2026.pdf")

styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="CoverKicker",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=12,
        textColor=MUTED,
        alignment=TA_CENTER,
        spaceAfter=10,
    )
)
styles.add(
    ParagraphStyle(
        name="CoverTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=28,
        leading=32,
        alignment=TA_CENTER,
        textColor=TEXT,
        spaceAfter=10,
    )
)
styles.add(
    ParagraphStyle(
        name="CoverSubtitle",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=12,
        leading=17,
        alignment=TA_CENTER,
        textColor=TEXT,
        spaceAfter=14,
    )
)
styles.add(
    ParagraphStyle(
        name="PageTitle",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=TEXT,
        spaceAfter=10,
    )
)
styles.add(
    ParagraphStyle(
        name="BodyCopy",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=11,
        leading=16,
        textColor=TEXT,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="SmallMuted",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=MUTED,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="BulletText",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=14,
        textColor=TEXT,
        alignment=TA_LEFT,
    )
)
styles.add(
    ParagraphStyle(
        name="BoxHeading",
        parent=styles["Heading3"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=12,
        textColor=TEXT,
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="ButtonText",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=13,
        textColor=TEXT,
        alignment=TA_CENTER,
    )
)


def box_label(text: str):
    table = Table([[Paragraph(text, styles["BoxHeading"])]], colWidths=[CONTENT_WIDTH])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), ACCENT),
                ("BOX", (0, 0), (-1, -1), 2, colors.black),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def info_box(text: str, background):
    table = Table([[Paragraph(text, styles["BodyCopy"])]], colWidths=[CONTENT_WIDTH])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), background),
                ("BOX", (0, 0), (-1, -1), 2, colors.black),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    return table


def checklist(items):
    rows = []
    for item in items:
        rows.append(
            [
                Paragraph("[ ]", styles["BulletText"]),
                Paragraph(item, styles["BulletText"]),
            ]
        )

    table = Table(rows, colWidths=[12 * mm, CONTENT_WIDTH - (12 * mm)])
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]
        )
    )
    return table


def small_list(items):
    rows = []
    for item in items:
        rows.append([Paragraph(f"- {item}", styles["BodyCopy"])])
    table = Table(rows, colWidths=[CONTENT_WIDTH])
    table.setStyle(
        TableStyle(
            [
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    return table


def button(text: str, url: str):
    label = f'<link href="{url}" color="black">{text}</link>'
    table = Table([[Paragraph(label, styles["ButtonText"])]], colWidths=[CONTENT_WIDTH])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), ACCENT),
                ("BOX", (0, 0), (-1, -1), 2.5, colors.black),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 11),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 11),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ]
        )
    )
    return table


def make_draw_background(footer_path: str, page_word: str):
    def draw_background(canvas, doc):
        canvas.saveState()
        canvas.setFillColor(PAPER)
        canvas.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)

        canvas.setFillColor(colors.white)
        canvas.setStrokeColor(colors.black)
        canvas.setLineWidth(2)
        canvas.rect(MARGIN, PAGE_HEIGHT - 14 * mm, 44 * mm, 8 * mm, fill=1, stroke=1)
        canvas.setFont("Helvetica-Bold", 11)
        canvas.drawString(MARGIN + 5 * mm, PAGE_HEIGHT - 11 * mm, "WerkCV")

        canvas.setFont("Helvetica", 9)
        canvas.setFillColor(MUTED)
        canvas.drawRightString(PAGE_WIDTH - MARGIN, 10 * mm, f"{footer_path}   |   {page_word} {doc.page}")
        canvas.restoreState()

    return draw_background


def build_story_nl():
    story = []

    story.append(Spacer(1, 35 * mm))
    story.append(Paragraph("Gratis PDF voor werkzoekenden in Nederland", styles["CoverKicker"]))
    story.append(Paragraph("Nederlandse CV Checklist 2026", styles["CoverTitle"]))
    story.append(
        Paragraph(
            "Controleer in 10 minuten of jouw CV klaar is voor Nederlandse vacatures, ATS-systemen en recruiter scans.",
            styles["CoverSubtitle"],
        )
    )
    story.append(info_box("Praktische checklist van WerkCV voor werkzoekenden in Nederland", ACCENT))
    story.append(Spacer(1, 10 * mm))
    story.append(
        small_list(
            [
                "Gebruik dit document naast je huidige CV.",
                "Werk elk onderdeel af voordat je solliciteert.",
                "Gebruik de laatste pagina als directe route naar een nette layout.",
            ]
        )
    )
    story.append(Spacer(1, 14 * mm))
    story.append(button("Bekijk WerkCV templates", "https://werkcv.nl/templates?utm_source=gumroad&utm_medium=pdf&utm_campaign=nederlandse_cv_checklist_2026&utm_content=cover_cta"))
    story.append(Spacer(1, 10 * mm))
    story.append(Paragraph("Rustige templates, ATS-veilige basis en een eerlijke eenmalige prijs per CV.", styles["SmallMuted"]))
    story.append(PageBreak())

    pages = [
        {
            "title": "Zo gebruik je deze checklist",
            "intro": "Open je huidige CV naast deze checklist en werk de pagina's in volgorde af. Het doel is niet om meer tekst toe te voegen, maar om sneller te zien wat weg moet, wat scherper moet en wat nog ontbreekt.",
            "box_text": "Deze checklist vervangt geen inhoudelijk maatwerk per vacature. Gebruik hem om fouten, rommel en ATS-risico's eruit te halen.",
            "box_color": BLUE,
            "items": [
                "Open je huidige CV naast deze checklist.",
                "Loop elk onderdeel in volgorde door.",
                "Markeer wat al goed staat.",
                "Noteer direct wat je vandaag nog moet aanpassen.",
                "Stuur je CV pas weg nadat de laatste pagina is afgevinkt.",
            ],
            "tip": "Werk op een kopie van je CV die je voor deze vacature gebruikt. Dan kun je direct schrappen en aanscherpen zonder twijfel.",
        },
        {
            "title": "1. Eerste indruk in 15 seconden",
            "intro": "Recruiters lezen eerst op snelheid. De bovenkant van je CV moet in een paar seconden duidelijk maken wie je bent, op welk niveau je solliciteert en hoe iemand contact met je opneemt.",
            "box_text": "Als de bovenkant rommelig is, verlies je aandacht voordat je inhoud telt.",
            "box_color": ACCENT,
            "items": [
                "Staat bovenaan direct wie je bent en op welk functieniveau je solliciteert?",
                "Zijn naam, telefoonnummer, professioneel e-mailadres en woonplaats duidelijk zichtbaar?",
                "Oogt de pagina rustig en leesbaar?",
                "Is de bovenkant niet verspild aan overbodige tekst?",
                "Staat de meest relevante informatie direct in beeld?",
            ],
            "tip": "Schrap lange intro's. Een korte profielsamenvatting met duidelijke richting werkt beter dan een algemeen verhaal.",
        },
        {
            "title": "2. Structuur en ATS-veiligheid",
            "intro": "Voor brede sollicitatie-intentie wint een schone, standaard structuur bijna altijd van creatieve opmaak. Zeker als je niet weet welk systeem of welke recruiter jouw CV als eerste bekijkt.",
            "box_text": "ATS-veilig betekent vooral: logisch opgebouwd, eenvoudig te lezen en zonder layout-elementen die parsing verstoren.",
            "box_color": GREEN,
            "items": [
                "Gebruik je standaardkoppen zoals Werkervaring, Opleiding en Vaardigheden?",
                "Staat je meest recente ervaring bovenaan?",
                "Gebruik je een eenvoudig lettertype en consistente datums?",
                "Vermijd je tabellen, tekstvakken, overbodige iconen en drukke grafische elementen?",
                "Is het bestand geexporteerd als nette PDF?",
            ],
            "tip": "Een creatief CV kan in sommige sectoren werken, maar een veilige basisstructuur blijft de sterkste standaard.",
        },
        {
            "title": "3. Past dit CV echt bij de vacature?",
            "intro": "Een goed CV is geen volledige levensgeschiedenis. Het is een selectie voor deze baan. Relevantie is meestal belangrijker dan volledigheid.",
            "box_text": "Gebruik de vacaturetekst als filter: wat hoort op pagina 1, wat kan korter en wat hoort helemaal niet meer op dit CV?",
            "box_color": BLUE,
            "items": [
                "Sluit je CV-titel of profiel aan op de functie?",
                "Komen belangrijke woorden uit de vacature terug in je CV?",
                "Laat je werkervaring vooral relevante taken en resultaten zien?",
                "Heb je irrelevante of verouderde details geschrapt?",
                "Is dit CV duidelijk aangepast voor deze werkgever of branche?",
            ],
            "tip": "Kopieer geen vacaturetekst blind. Gebruik dezelfde taal alleen waar die echt bij jouw ervaring past.",
        },
        {
            "title": "4. Bewijs en impact",
            "intro": "Sterke CV's blijven niet hangen in zachte claims. Ze laten zien wat je deed, wat dat opleverde en waarom dat geloofwaardig is.",
            "box_text": "Vage woorden zoals hardwerkend, gemotiveerd of sociaal overtuigen pas als je ze ondersteunt met concreet werk of resultaat.",
            "box_color": RED,
            "items": [
                "Beschrijf je niet alleen taken, maar ook resultaten?",
                "Gebruik je actieve werkwoorden?",
                "Noem je aantallen, percentages, volumes, klanten of verbeteringen waar mogelijk?",
                "Vermijd je vaag taalgebruik zonder bewijs?",
                "Klopt alles feitelijk en is het verdedigbaar in een gesprek?",
            ],
            "tip": "Zwak: verantwoordelijk voor klantenservice. Sterk: hielp dagelijks 40+ klanten en verbeterde responstijd in piekuren.",
        },
        {
            "title": "5. Fouten die je vandaag nog kunt verwijderen",
            "intro": "Veel CV's vallen niet af omdat de kandidaat zwak is, maar omdat de uitvoering onnodige twijfel oproept. Dat is laaghangend fruit.",
            "box_text": "Verwijder alles wat afleidt, verouderd oogt of je professioneler laat lijken dan de inhoud kan dragen.",
            "box_color": ACCENT,
            "items": [
                "Lange alinea's in plaats van korte scanbare punten.",
                "Onduidelijke functietitels.",
                "Rare lettertypes of onrustige kleurkeuzes.",
                "Verouderd e-mailadres.",
                "Spelfouten of wisselende datumnotatie.",
                "Een foto die niet professioneel oogt.",
                "Een generiek profiel dat niets zegt over deze functie.",
            ],
            "tip": "Een foto is geen harde eis voor elke sollicitatie. Als je er een gebruikt, moet die professioneel en rustig ogen.",
        },
        {
            "title": "Laatste controle voor je op verzenden klikt",
            "intro": "Gebruik deze laatste pagina als snelle pre-send check. Als je hier nog gaten vindt, is je CV nog niet klaar om weg te sturen.",
            "box_text": "Controleer ook hoe je PDF eruitziet op mobiel. Veel eerste scans gebeuren niet alleen op desktop.",
            "box_color": GREEN,
            "items": [
                "Vacature-specifiek.",
                "ATS-veilig opgebouwd.",
                "Foutloos gespeld.",
                "PDF getest.",
                "Mobiel leesbaar.",
                "Juiste bestandsnaam.",
                "Profiel en titel scherp.",
                "Recente ervaring bovenaan.",
                "Contactgegevens kloppen.",
                "Een keer hardop nagelezen.",
            ],
            "tip": "Aanbevolen bestandsnaam: CV_Voornaam_Achternaam_Functietitel.pdf",
        },
    ]

    for page in pages:
        story.append(Paragraph(page["title"], styles["PageTitle"]))
        story.append(Paragraph(page["intro"], styles["BodyCopy"]))
        story.append(info_box(page["box_text"], page["box_color"]))
        story.append(Spacer(1, 5 * mm))
        story.append(checklist(page["items"]))
        story.append(Spacer(1, 5 * mm))
        story.append(Paragraph(page["tip"], styles["SmallMuted"]))
        story.append(PageBreak())

    story.append(Paragraph("Wil je sneller door naar een nette, ATS-vriendelijke layout?", styles["PageTitle"]))
    story.append(
        Paragraph(
            "Gebruik deze checklist als kwaliteitsfilter. Als de inhoud eenmaal klopt, is de volgende stap een layout kiezen die rustig, professioneel en goed scanbaar blijft.",
            styles["BodyCopy"],
        )
    )
    story.append(info_box("WerkCV laat je eerst templates vergelijken en pas daarna beslissen. Dat past beter bij deze checklist dan direct naar een verkooppagina sturen.", BLUE))
    story.append(Spacer(1, 5 * mm))
    story.append(button("Vergelijk WerkCV templates", "https://werkcv.nl/templates?utm_source=gumroad&utm_medium=pdf&utm_campaign=nederlandse_cv_checklist_2026&utm_content=final_cta"))
    story.append(Spacer(1, 4 * mm))
    story.append(
        Paragraph(
            'Liever eerst de prijs checken? <link href="https://werkcv.nl/prijzen?utm_source=gumroad&utm_medium=pdf&utm_campaign=nederlandse_cv_checklist_2026&utm_content=pricing_cta" color="black">Bekijk hoe eenmalig betalen bij WerkCV werkt.</link>',
            styles["BodyCopy"],
        )
    )
    story.append(Spacer(1, 10 * mm))
    story.append(box_label("Wat je op WerkCV hierna moet doen"))
    story.append(Spacer(1, 3 * mm))
    story.append(
        checklist(
            [
                "Vergelijk de templates op rust, leesbaarheid en vacature-fit.",
                "Kies de layout die past bij jouw branche en rol.",
                "Werk de inhoud uit deze checklist daarna direct door in je CV.",
                "Download pas wanneer je versie echt klaar is.",
            ]
        )
    )
    story.append(Spacer(1, 7 * mm))
    story.append(Paragraph("Eerst gratis vergelijken, daarna pas beslissen.", styles["CoverSubtitle"]))
    return story


def build_story_en():
    story = []

    story.append(Spacer(1, 35 * mm))
    story.append(Paragraph("Free PDF for expats and international candidates", styles["CoverKicker"]))
    story.append(Paragraph("English CV Checklist for Jobs in the Netherlands", styles["CoverTitle"]))
    story.append(
        Paragraph(
            "Check in 10 minutes whether your CV is ready for Dutch employers, ATS screening, and fast recruiter scans.",
            styles["CoverSubtitle"],
        )
    )
    story.append(
        info_box(
            "Practical checklist from WerkCV for international candidates applying in the Netherlands",
            ACCENT,
        )
    )
    story.append(Spacer(1, 10 * mm))
    story.append(
        small_list(
            [
                "Use this document next to your current CV.",
                "Work through each page before you apply.",
                "Use the last page to move into an English-friendly CV template.",
            ]
        )
    )
    story.append(Spacer(1, 14 * mm))
    story.append(
        button(
            "View English CV templates",
            "https://werkcv.nl/en/templates?utm_source=gumroad&utm_medium=pdf&utm_campaign=english_cv_checklist_netherlands_2026&utm_content=cover_cta",
        )
    )
    story.append(Spacer(1, 10 * mm))
    story.append(
        Paragraph(
            "ATS-friendly templates, Dutch-market A4 structure, and a cleaner path from draft to application.",
            styles["SmallMuted"],
        )
    )
    story.append(PageBreak())

    pages = [
        {
            "title": "How to use this checklist",
            "intro": "Open your current CV next to this checklist and work through the pages in order. The goal is not to add more text. The goal is to spot what needs to be removed, tightened, or tailored before you send the file.",
            "box_text": "This checklist does not replace vacancy-specific tailoring. Use it to remove clutter, weak structure, and common ATS risks.",
            "box_color": BLUE,
            "items": [
                "Open your current CV next to this checklist.",
                "Work through each section in order.",
                "Mark what is already strong.",
                "Write down what still needs to change today.",
                "Do not send the CV until the last page is checked off.",
            ],
            "tip": "Work on a copy of your CV for the specific role you are targeting. That makes it easier to cut and rewrite without second-guessing.",
        },
        {
            "title": "1. First impression in 15 seconds",
            "intro": "Recruiters scan quickly. The top of your CV should immediately show who you are, what level you are applying at, and how to contact you.",
            "box_text": "If the top section feels vague or crowded, you lose attention before your experience gets a fair read.",
            "box_color": ACCENT,
            "items": [
                "Does the top section clearly show who you are and what role level you are targeting?",
                "Are your name, phone number, professional email address, and city easy to find?",
                "Does the page feel calm and readable?",
                "Is the top of the page free from filler text?",
                "Is the most relevant information visible without effort?",
            ],
            "tip": "A short, vacancy-aligned profile usually works better than a broad personal statement.",
        },
        {
            "title": "2. Structure and ATS safety",
            "intro": "For jobs in the Netherlands, a clean and standard structure is usually stronger than decorative layout. That matters even more when you do not know whether an ATS or a recruiter sees the file first.",
            "box_text": "ATS-safe usually means simple section labels, clear chronology, consistent dates, and no layout features that break parsing.",
            "box_color": GREEN,
            "items": [
                "Do you use standard headings such as Work Experience, Education, and Skills?",
                "Is your most recent experience listed first?",
                "Do you use a simple font and consistent date formatting?",
                "Do you avoid tables, text boxes, heavy icons, and decorative graphics?",
                "Is the file exported as a clean PDF in an A4-friendly layout?",
            ],
            "tip": "A creative CV can work in some fields, but a stable structure is the safer default for broad application intent.",
        },
        {
            "title": "3. Does this CV really match the vacancy?",
            "intro": "A strong CV is not your full life story. It is a selection built for this role, this employer, and this hiring context.",
            "box_text": "Use the vacancy text as a filter: what belongs on page one, what can be shortened, and what should disappear from this version?",
            "box_color": BLUE,
            "items": [
                "Does your CV title or profile match the role you are applying for?",
                "Do the important words from the vacancy appear naturally in your CV?",
                "Does your experience section highlight relevant tasks and results?",
                "Have you removed outdated or irrelevant detail?",
                "Is this version clearly adapted to this employer or sector?",
            ],
            "tip": "Do not copy a job description into your CV. Match the language only where it honestly reflects your experience.",
        },
        {
            "title": "4. Proof and impact",
            "intro": "Good CVs do not stop at soft claims. They show what you did, what changed, and why the claim is credible.",
            "box_text": "Words like motivated, hard-working, or strong communicator only help when the experience section proves them.",
            "box_color": RED,
            "items": [
                "Do you describe results, not only duties?",
                "Do you use active verbs?",
                "Do you include numbers, volumes, percentages, clients, or improvements where possible?",
                "Do you avoid vague wording without evidence?",
                "Is every claim factually defensible in an interview?",
            ],
            "tip": "Weak: responsible for customer support. Stronger: supported 40+ customers per day and improved response times during peak hours.",
        },
        {
            "title": "5. Common mistakes you can remove today",
            "intro": "Many CVs fail because the execution creates unnecessary doubt. Fixing that is usually faster than rewriting everything from scratch.",
            "box_text": "Remove anything that feels outdated, inflated, hard to scan, or clearly copied from another market without adapting it.",
            "box_color": ACCENT,
            "items": [
                "Dense paragraphs instead of short, skimmable points.",
                "Unclear job titles.",
                "Distracting fonts or over-designed color use.",
                "An unprofessional email address.",
                "Spelling errors or inconsistent dates.",
                "A photo that does not look professional.",
                "A generic summary that says nothing about this role.",
            ],
            "tip": "A photo is not a hard requirement for every application. If you use one, it should look calm and professional.",
        },
        {
            "title": "Final review before you click send",
            "intro": "Use this page as a final pre-send filter. If there are still gaps here, the CV is not ready yet.",
            "box_text": "Also check how the PDF looks on mobile. Some first reviews happen on a phone before anyone opens it on desktop.",
            "box_color": GREEN,
            "items": [
                "Tailored to the vacancy.",
                "ATS-safe structure.",
                "Spelling checked.",
                "PDF tested.",
                "Mobile-readable.",
                "Clear filename.",
                "Sharp profile and title.",
                "Most recent experience first.",
                "Contact details correct.",
                "Read out loud once.",
            ],
            "tip": "Recommended filename: CV_Firstname_Lastname_Role.pdf",
        },
    ]

    for page in pages:
        story.append(Paragraph(page["title"], styles["PageTitle"]))
        story.append(Paragraph(page["intro"], styles["BodyCopy"]))
        story.append(info_box(page["box_text"], page["box_color"]))
        story.append(Spacer(1, 5 * mm))
        story.append(checklist(page["items"]))
        story.append(Spacer(1, 5 * mm))
        story.append(Paragraph(page["tip"], styles["SmallMuted"]))
        story.append(PageBreak())

    story.append(Paragraph("Need a cleaner English CV layout next?", styles["PageTitle"]))
    story.append(
        Paragraph(
            "Use this checklist as your quality filter. Once the content is sharp, the next step is choosing a layout that stays readable, professional, and suitable for applications in the Netherlands.",
            styles["BodyCopy"],
        )
    )
    story.append(
        info_box(
            "For this English version, the main next step is the English templates page. The secondary route is format guidance, not a Dutch pricing page.",
            BLUE,
        )
    )
    story.append(Spacer(1, 5 * mm))
    story.append(
        button(
            "View English CV templates",
            "https://werkcv.nl/en/templates?utm_source=gumroad&utm_medium=pdf&utm_campaign=english_cv_checklist_netherlands_2026&utm_content=final_cta",
        )
    )
    story.append(Spacer(1, 4 * mm))
    story.append(
        Paragraph(
            'Need more guidance first? <link href="https://werkcv.nl/en/netherlands-cv-format?utm_source=gumroad&utm_medium=pdf&utm_campaign=english_cv_checklist_netherlands_2026&utm_content=format_cta" color="black">Read the Netherlands CV format guide.</link>',
            styles["BodyCopy"],
        )
    )
    story.append(Spacer(1, 10 * mm))
    story.append(box_label("What to do next on WerkCV"))
    story.append(Spacer(1, 3 * mm))
    story.append(
        checklist(
            [
                "Compare the English-friendly templates for readability and job fit.",
                "Choose the layout that fits your sector and level.",
                "Carry the checklist edits directly into your CV draft.",
                "Export only when the version is genuinely ready to send.",
            ]
        )
    )
    story.append(Spacer(1, 7 * mm))
    story.append(Paragraph("Compare first, decide later.", styles["CoverSubtitle"]))
    return story


def build_pdf(output_path: Path, title: str, subject: str, footer_path: str, page_word: str, story_builder):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=20 * mm,
        bottomMargin=18 * mm,
        title=title,
        author="WerkCV",
        subject=subject,
    )
    background = make_draw_background(footer_path, page_word)
    doc.build(story_builder(), onFirstPage=background, onLaterPages=background)

def main():
    build_pdf(
        output_path=NL_OUTPUT_PATH,
        title="Nederlandse CV Checklist 2026",
        subject="Gratis CV checklist voor Nederlandse vacatures",
        footer_path="werkcv.nl/templates",
        page_word="pagina",
        story_builder=build_story_nl,
    )
    print(NL_OUTPUT_PATH)
    build_pdf(
        output_path=EN_OUTPUT_PATH,
        title="English CV Checklist for Jobs in the Netherlands",
        subject="Free CV checklist for jobs in the Netherlands",
        footer_path="werkcv.nl/en/templates",
        page_word="page",
        story_builder=build_story_en,
    )
    print(EN_OUTPUT_PATH)


if __name__ == "__main__":
    main()
