from fastapi import FastAPI
from pydantic import BaseModel
from sanitizer import clean_eml, extract_html

from model import chat


class Email(BaseModel):
    organization: str  # the enterprise id or personal id of the user
    eml: str  # the contents of the eml file to be analyzed


app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/analyze/")
async def analyze_email(email: Email):
    # extract the html from the eml file
    # clean the email
    cleaned_eml = clean_eml(email.eml)
    print(cleaned_eml)
    # TOOD: call the model to analyze the email
    return {
        "score": 9,
        "is_phishing": True,
        "brand_impersonated": "Google",
        "rationale": "The email is phishing because it is impersonating Google",
    }


# to run this, run "fastapi dev main.py"
# served at http://127.0.0.1:8000
