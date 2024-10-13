import uvicorn
import chardet
import email
from email.message import Message
from email.parser import HeaderParser
from fastapi import FastAPI
from pydantic import BaseModel

from model import chat
from sanitizer import clean_eml
from test_data.eml_data import *


class Email(BaseModel):
    organization: str  # the enterprise id or personal id of the user
    eml: str  # the contents of the eml file to be analyzed


app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/analyze/")
async def analyze_email():
    print("analyze_email")
    em = email.message_from_string(EML_DATA_2)
    headers = parse_headers(em)
    payload = retrieve_payload(em)
    llm_input = headers + "\n" + payload

    with open("payload.txt", "w") as f:
        f.write(llm_input)

    # header_removed = "\n".join(EML_DATA_2.split("\n\n\n")[1:])
    # # print(header_removed)

    # cleaned_eml = clean_eml(payload)
    # # print(cleaned_eml)
    # return chat(cleaned_eml)


def parse_headers(eml_data: Message | str):
    headers = HeaderParser().parsestr(eml_data.as_string())
    for header in headers.keys():
        if "X-" in header or "DKIM" in header or "DMARC" in header or "ARC" in header:
            del headers[header]
    print(headers.keys())
    return headers.as_string()
    # remove some headers
    # return headers as string using to_string()


def retrieve_payload(eml_data: Message | str):
    if eml_data.is_multipart():
        payload = ""
        for part in eml_data.get_payload():
            payload += "\n" + retrieve_payload(part)
    else:
        payload = eml_data.get_payload(decode=True)
        if not eml_data.get_content_charset():
            charset = chardet.detect(eml_data.as_bytes())["encoding"]
        else:
            charset = eml_data.get_content_charset()
        try:
            payload = str(payload, charset)
        except UnicodeDecodeError:
            payload = ""

    return payload


# to run this, run "fastapi dev main.py"
# served at http://127.0.0.1:8000


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
