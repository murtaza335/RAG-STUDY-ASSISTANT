import re
from pathlib import Path
from PyPDF2 import PdfReader

class BookIngestor:
    def __init__(self, file_path: str):
        self.file_path = Path(file_path)
        if not self.file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

    def extract_text(self) -> str:
        reader = PdfReader(self.file_path)
        raw_text = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                raw_text.append(text)
        return "\n".join(raw_text)

    def clean_text(self, text: str) -> str:
        # Remove multiple newlines
        text = re.sub(r'\n{2,}', '\n', text)
        # Remove page numbers (common pattern: standalone digits)
        text = re.sub(r'^\s*\d+\s*$', '', text, flags=re.MULTILINE)
        # Remove weird spaces
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    def process_book(self) -> str:
        raw = self.extract_text()
        clean = self.clean_text(raw)
        return clean
