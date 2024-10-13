from fastapi import FastAPI
from pydantic import BaseModel

from model import chat
from sanitizer import clean_eml
from test_data.eml_data import EML_DATA


class Email(BaseModel):
    organization: str  # the enterprise id or personal id of the user
    eml: str  # the contents of the eml file to be analyzed


app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/analyze/")
async def analyze_email():
    header_removed = "\n".join(EML_DATA.split("\n\n\n")[1:])
    print(header_removed)
    cleaned_eml = clean_eml(header_removed)
    print(cleaned_eml)
    return chat(cleaned_eml)


# to run this, run "fastapi dev main.py"
# served at http://127.0.0.1:8000
