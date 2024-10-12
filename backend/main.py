from fastapi import FastAPI
from pydantic import BaseModel
from sanitizer import clean_email

class Email(BaseModel):
    organization: str # the enterprise id or personal id of the user
    eml: str # the contents of the eml file to be analyzed


app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/analyze/")
async def analyze_email(email: Email):
    # clean the email
    cleaned_email = clean_email(email.eml)
    print(cleaned_email)
    # TOOD: call the model to analyze the email
    return {
            "score": 9,
            "is_phishing": True,
            "brand_impersonated": "Google",
            "rationale": "The email is phishing because it is impersonating Google"
        }

# to run this, run "fastapi dev main.py"
# served at http://127.0.0.1:8000 