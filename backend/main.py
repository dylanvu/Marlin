import json
import base64
import uvicorn
import email
from email.message import Message
from email.parser import HeaderParser
from fastapi import FastAPI
from pydantic import BaseModel
from bs4 import BeautifulSoup

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
    eml = get_test_eml()
    em = email.message_from_string(eml)

    headers = parse_headers(em)
    payload = retrieve_payload(em)
    llm_input = headers + "\n" + payload

    with open("payload.txt", "w") as f:
        f.write(llm_input)

    # cleaned_eml = clean_eml(llm_input)
    return chat(llm_input)


def get_test_eml():
    with open("test_data/ham1.txt", "r") as f:
        return f.read()


def parse_headers(eml_data: Message | str):
    headers = HeaderParser().parsestr(eml_data.as_string())
    headers_to_delete = [
        "X-",
        "DKIM",
        "DMARC",
        "ARC",
        "Delivered-To",
        "Received",
        "To",
    ]
    for header in headers.keys():
        for header_to_delete in headers_to_delete:
            if header_to_delete in header:
                del headers[header]
    return json.dumps(dict(headers.items()), indent=4)


def retrieve_payload(eml_data: Message | str):
    if eml_data.is_multipart():
        payload = ""
        for part in eml_data.get_payload():
            payload += "\n" + retrieve_payload(part)
    else:
        headers = HeaderParser().parsestr(eml_data.as_string())
        encoding = headers.get("Content-Transfer-Encoding")
        payload = eml_data.get_payload()
        if encoding == "base64":
            try:
                payload = base64.b64decode(payload).decode()
            except:
                payload = ""
        if BeautifulSoup(payload, "html.parser").find("html"):
            payload = ""

    return payload


# to run this, run "fastapi dev main.py"
# served at http://127.0.0.1:8000


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
