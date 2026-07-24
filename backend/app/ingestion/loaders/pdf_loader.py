import fitz  # PyMuPDF
import easyocr
from PIL import Image
import io
import numpy as np

# Initialize OCR reader lazily
reader = None


def get_ocr_reader():
    global reader
    if reader is None:
        print("Initializing EasyOCR reader...")
        reader = easyocr.Reader(['en'], gpu=False)
    return reader


def load_pdf(file_path: str) -> str:
    """
    Extract text from a PDF.

    1. Try normal text extraction.
    2. If page has no text, perform OCR.
    """

    document = fitz.open(file_path)
    try:
        extracted_text = ""

        print(f"\nProcessing PDF: {file_path}")
        print(f"Total Pages: {len(document)}\n")

        ocr_reader = None

        for page_num, page in enumerate(document):

            # ---------------------------
            # Try extracting embedded text
            # ---------------------------
            page_text = page.get_text().strip()

            if page_text:
                print(f"[OK] Page {page_num + 1}: Embedded text found")

                extracted_text += (
                    f"\n\n========== PAGE {page_num + 1} ==========\n\n"
                )
                extracted_text += page_text

            else:
                print(f"[WARNING] Page {page_num + 1}: No embedded text, running OCR...")
                if ocr_reader is None:
                    ocr_reader = get_ocr_reader()

                # Convert page to image
                pix = page.get_pixmap(dpi=300)

                image_bytes = pix.tobytes("png")

                image = Image.open(io.BytesIO(image_bytes))

                # Convert PIL Image to NumPy array
                image_np = np.array(image)

                # OCR
                ocr_result = ocr_reader.readtext(image_np, detail=0)

                ocr_text = "\n".join(ocr_result)

                extracted_text += (
                    f"\n\n========== PAGE {page_num + 1} (OCR) ==========\n\n"
                )

                extracted_text += ocr_text
    finally:
        document.close()

    return extracted_text
