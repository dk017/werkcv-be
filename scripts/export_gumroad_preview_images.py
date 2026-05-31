from pathlib import Path

import fitz


EXPORTS = [
    {
        "pdf": Path("public/downloads/nederlandse-cv-checklist-2026.pdf"),
        "items": [
            {"page": 0, "output": "public/gumroad-previews/nl/nederlandse-cv-checklist-2026-preview-1-cover.png"},
            {"page": 3, "output": "public/gumroad-previews/nl/nederlandse-cv-checklist-2026-preview-2-ats-structure.png"},
            {"page": 7, "output": "public/gumroad-previews/nl/nederlandse-cv-checklist-2026-preview-3-final-review.png"},
        ],
    },
    {
        "pdf": Path("public/downloads/english-cv-checklist-netherlands-2026.pdf"),
        "items": [
            {"page": 0, "output": "public/gumroad-previews/en/english-cv-checklist-netherlands-2026-preview-1-cover.png"},
            {"page": 3, "output": "public/gumroad-previews/en/english-cv-checklist-netherlands-2026-preview-2-ats-structure.png"},
            {"page": 7, "output": "public/gumroad-previews/en/english-cv-checklist-netherlands-2026-preview-3-final-review.png"},
        ],
    },
]


def export_page(doc: fitz.Document, page_index: int, output_path: Path):
    page = doc.load_page(page_index)
    # 2.5x keeps the files sharp enough for Gumroad previews without becoming heavy.
    pix = page.get_pixmap(matrix=fitz.Matrix(2.5, 2.5), alpha=False)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    pix.save(output_path)


def main():
    for group in EXPORTS:
        pdf_path = group["pdf"]
        if not pdf_path.exists():
            raise FileNotFoundError(f"Missing PDF: {pdf_path}")

        doc = fitz.open(pdf_path)
        try:
            for item in group["items"]:
                output_path = Path(item["output"])
                export_page(doc, item["page"], output_path)
                print(output_path)
        finally:
            doc.close()


if __name__ == "__main__":
    main()
