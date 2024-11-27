from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field


class Observation(BaseModel):
    description: str = Field(
        "description of the observation, using references where possible"
    )
    severity: int = Field("severity of the observation, on a scale from 1 to 3")


class Email(BaseModel):
    is_phishing: bool = Field(
        description="a boolean value indicating whether the email is phishing (true) or legitimate (false)"
    )
    phishing_score: int = Field(
        "phishing risk confidence score as an integer on a scale from 0 to 10"
    )
    brand_impersonated: str = Field(
        "brand name associated with the email, if applicable"
    )
    observations: list[Observation] = Field(...)
    brief_reason: str = Field("brief reason for the determination")


CONTEXT = """I want you to act as a spam detector to determine whether a given email (in .eml format) is a phishing email or a legitimate email. 
Your analysis should be thorough and evidence-based. Phishing emails often impersonate legitimate brands and use social engineering techniques to deceive users. 
These techniques include, but are not limited to: fake rewards, fake warnings about account problems, and creating a sense of urgency or interest. 
Spoofing the sender's address and embedding deceptive HTML links are common tactics.
Analyze the email by following these steps:
1. Identify any impersonation of well-known brands.
2. Examine the email header for spoofing signs, such as the sender name or email address discrepancies. Evaluate the subject line for typical phishing characteristics (e.g., urgency, promise of reward). Note that the To address has been replaced with a dummy address.
3. Analyze the email body for social engineering tactics to induce hyperlink clicks. Inspect URLs to determine if they are misleading or lead to suspicious websites.
4. Provide a comprehensive evaluation of the email, highlighting specific elements that support your conclusion. Include a detailed explanation of any phishing or legitimacy indicators found in the email.
5. Summarize your findings and provide your final verdict on the legitimacy of the email, supported by the evidence you gathered.
"""

TEMPLATE = """
Email: {query_str}
Answer: 
"""

PARSER = JsonOutputParser(pydantic_object=Email)


def get_prompt(query_str):
    """"""
    prompt = [
        {
            "role": "system",
            "content": (
                f"{CONTEXT}\n"
                + f"{PARSER.get_format_instructions()}\n"
                + "This is very important to my career."
            ),
        },
    ]
    prompt.append(
        {
            "role": "user",
            "content": TEMPLATE.format(query_str=query_str),
        },
    )
    return prompt
