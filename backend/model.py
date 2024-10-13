import os
import requests
from dotenv import load_dotenv

from template import PARSER, get_prompt


load_dotenv()

API_URL = "https://llm.kindo.ai/v1/chat/completions"
MODEL = "groq/mixtral-8x7b-32768"
HEADERS = {
    "Content-Type": "application/json",
    "api-key": os.getenv("KINDO_API_KEY"),
}


def chat(email_str: str) -> dict:
    payload = {
        "model": MODEL,
        "messages": get_prompt(email_str),
        "temperature": 0,
    }
    response = requests.post(API_URL, headers=HEADERS, json=payload)
    if response.status_code == 200:
        res_json = response.json()
        reply = res_json["choices"][0]["message"]["content"]
        return PARSER.parse(reply)
    else:
        raise Exception(
            f"API request failed with status code {response.status_code}: {response.text}"
        )
