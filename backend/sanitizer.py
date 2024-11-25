"""
Technique Taken from this paper:
https://arxiv.org/pdf/2402.18093

Omitting text/html Content We describe a method for omitting HTML format messages.
The primary goal of phishing emails is to direct the viewer to a phishing site by clicking on hyperlinks.
While retaining crucial information such as the a tag and text containing false information to deceive users,
our system removes unnecessary HTML elements related to style or metadata.
The removal process is as follows: Inspired by existing research on using LLMs to detect phishing sites,
we implemented a simplification of the HTML.
1. Remove comment, style, script tags.
2. Remove all attributes except for the major ones: src, href, alt, title, name, id, class.
3. Remove tags with no text content.
4. Unwrap certain tags: font, strong, b.
5. Reduce the src attribute of img tags and the href attribute of a tags to 10
characters in the URL path, except for the domain name.
6. If the token limit is exceeded, remove an HTML element from the center of
the HTML until the number of tokens is below the limit.
"""

import re
import json
import base64
import email
import scrubadub
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from email.message import Message
from email.parser import HeaderParser


def cleaning_pipeline(eml_text: str):
    em = email.message_from_string(eml_text)
    headers = parse_headers(em)
    payload = retrieve_payload(em)
    cleaned_payload = clean_eml(headers + "\n" + payload)
    return cleaned_payload


def parse_headers(eml_data: Message):
    headers = HeaderParser().parsestr(eml_data.as_string())
    del_header_prefixes = [
        "X-",
        "DKIM",
        "DMARC",
        "ARC",
        "Delivered-To",
        "Received",
        "To",
        "Cc",
        "Bcc",
    ]

    for header in headers.keys():
        for prefix in del_header_prefixes:
            if header.startswith(prefix):
                del headers[header]

    return json.dumps(dict(headers.items()), indent=4)


def retrieve_payload(eml_data: Message):
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

    return payload


def scrub_eml_data(eml_data: str) -> str:
    scrubber = scrubadub.Scrubber()

    # add optional and external detectors
    scrubber.add_detector(scrubadub.detectors.DateOfBirthDetector)

    scrubber.remove_detector(scrubadub.detectors.email.EmailDetector)
    scrubber.remove_detector(scrubadub.detectors.UrlDetector)

    # scrub the eml data
    return scrubber.clean(eml_data)


def scrub_email_addresses(eml_data: str) -> str:
    pattern = r"([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)"
    cleaned = re.sub(pattern, r"{{USER}}@\2", eml_data)
    return cleaned


def clean_eml(eml_data: str) -> str:
    """
    Clean both the html in accordance to the research paper and remove identifying information in the EML data and header
    """

    # go through an initial cleaning of the EML data
    data = scrub_eml_data(eml_data)

    # remove email addresses, but keep the domain name
    data = scrub_email_addresses(data)

    # convert the data to a BeautifulSoup object
    soup = BeautifulSoup(data, "html.parser")
    # remove comments, style, and script tags
    for tag in soup.find_all(["comment", "style", "script"]):
        tag.decompose()
    # remove all attributes except for the major ones: src, href, alt, title, name, id, class
    for tag in soup.find_all(True):
        for attr in list(tag.attrs):
            if attr not in ["src", "href", "alt", "title", "name", "id", "class"]:
                del tag[attr]
    # remove tags with no text content
    for tag in soup.find_all(True):
        if not tag.text.strip():
            tag.decompose()
    # unwrap certain tags: font, strong, b
    for tag in soup.find_all(["font", "strong", "b"]):
        tag.unwrap()

    # reduce the src attribute of img tags and the href attribute of a tags to 10 characters in the URL path, except for the domain name
    for tag in soup.find_all(["img", "a"]):
        if "src" in tag.attrs:
            # keep the domain name
            parsed_url = urlparse(tag["src"])
            domain = parsed_url.netloc
            path = parsed_url.path
            # limit the length of the url path to 10 characters
            tag["src"] = domain + path[:10]
        if "href" in tag.attrs:
            # keep the domain name
            parsed_url = urlparse(tag["href"])
            domain = parsed_url.netloc
            path = parsed_url.path
            # limit the length of the url path to 10 characters
            tag["href"] = domain + path[:10]

    # convert the cleaned html back to a string
    cleaned_html = str(soup)
    return cleaned_html


if __name__ == "__main__":
    data = """<html>
        <head>
            <style>
            .red {
                color: red;
            }
            </style>
        </head>
        <body>
            <p class="red"><strong>This is a paragraph</strong></p>
            <a href="https://www.google.com/reset/testing/jdsaklflkdskdasfklksdjfksdlksdjfklajskldflksjlkjfalkdjf">Google</a>
            <script>
                console.log("Hello World")
            </script>
        </body>
    </html>"""

    # print(clean_eml(data))
    # Expected output:
    # <html>
    # <head>
    # </head>
    # <body>
    # <p>This is a paragraph</p>
    # </body>
    # </html>

    # Test with a real email
    # cleaned_eml = clean_eml(EML_DATA)
    # print(cleaned_eml)

    cleaned_eml = clean_eml(data)
    print(cleaned_eml)
