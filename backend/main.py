from fastapi import FastAPI
from pydantic import BaseModel

class Email(BaseModel):
    organization: str # the enterprise id or personal id of the user
    message: str # the contents of the email to be analyzed


app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/analyze/")
async def analyze_email(email: Email):
    print(email)
    # TOOD: call the model to analyze the email
    return {
            "score": 9,
            "is_phishing": True,
            "brand_impersonated": "Google",
            "rationale": "The email is phishing because it is impersonating Google"
        }

# to run this, run "fastapi dev main.py"