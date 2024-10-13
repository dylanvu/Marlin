# Clean the input using BeautifulSoup
"""
Technique Taken from this paper:
https://arxiv.org/pdf/2402.18093

Omitting text/html Content We describe a method for omitting HTML format messages. The primary goal of phishing emails is to direct the viewer to
a phishing site by clicking on hyperlinks. While retaining crucial information
such as the a tag and text containing false information to deceive users, our
system removes unnecessary HTML elements related to style or metadata. The
removal process is as follows: Inspired by existing research on using LLMs to
detect phishing sites, we implemented a simplification of the HTML.
1. Remove comment, style, script tags.
2. Remove all attributes except for the major ones: src, href, alt, title,
name, id, class.
3. Remove tags with no text content.
4. Unwrap certain tags: font, strong, b.
5. Reduce the src attribute of img tags and the href attribute of a tags to 10
characters in the URL path, except for the domain name.
6. If the token limit is exceeded, remove an HTML element from the center of
the HTML until the number of tokens is below the limit.
"""

from typing import Tuple
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import re

# for testing purposes only
from test_data.eml_header import EML_HEADER
from test_data.eml_data import EML_DATA

replacement_placeholder = '<REPLACEMENT_PLACEHOLDER>'


def extract_html(data: str) -> Tuple[str, str]:
    '''
    Extract the html from the eml file. The first return value is the html, the second is the data with the eml file contents, with the html replaced with a placeholder
    '''
    # use regex to extract only the html part of the eml file
    # example HTML: <html>, <html lang="en">, etc
    # keep the html part of the eml file

    html = re.search(r'<html.*?>.*?</html>', data, re.DOTALL).group()

    # replace the chunk of html that was extracted with a placeholder for later replacement, for a cleaner html
    data = data.replace(html, replacement_placeholder)
    return (html, data)

def clean_eml_header(eml_data: str) -> str:
    '''
    cleans sensitive information from the EML header
    '''

    # extract out the email address following "Delievered-To:"

    pattern = r"Delivered-To:\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})"

    # search for the email address
    match = re.search(pattern, eml_data)

    if match:
        # replace the email address with "CENSORED"
        eml_data = eml_data.replace(match.group(1), "CENSORED")

    return eml_data

def clean_eml(eml_data: str) -> str:
    '''
    Clean both the html in accordance to the research paper and remove identifying information in the EML header
    '''

    # extract the html from the eml file
    html, data_with_replacement_placeholder = extract_html(eml_data)

    # clean the EML header data
    data_with_replacement_placeholder = clean_eml_header(data_with_replacement_placeholder)

    # convert the data to a BeautifulSoup object
    soup = BeautifulSoup(html, 'html.parser')
    # remove comments, style, and script tags
    for tag in soup.find_all(['comment', 'style', 'script']):
        tag.decompose()
    # remove all attributes except for the major ones: src, href, alt, title, name, id, class
    for tag in soup.find_all(True):
        for attr in list(tag.attrs):
            if attr not in ['src', 'href', 'alt', 'title', 'name', 'id', 'class']:
                del tag[attr]
    # remove tags with no text content
    for tag in soup.find_all(True):
        if not tag.text.strip():
            tag.decompose()
    # unwrap certain tags: font, strong, b
    for tag in soup.find_all(['font', 'strong', 'b']):
        tag.unwrap()

    # reduce the src attribute of img tags and the href attribute of a tags to 10 characters in the URL path, except for the domain name
    for tag in soup.find_all(['img', 'a']):
        if 'src' in tag.attrs:
            # keep the domain name
            parsed_url = urlparse(tag['src'])
            domain = parsed_url.netloc
            path = parsed_url.path
            # limit the length of the url path to 10 characters
            tag['src'] = domain + path[:10]
        if 'href' in tag.attrs:
            # keep the domain name
            parsed_url = urlparse(tag['href'])
            domain = parsed_url.netloc
            path = parsed_url.path
            # limit the length of the url path to 10 characters
            tag['href'] = domain + path[:10]

    # convert the cleaned html back to a string
    cleaned_html = str(soup)
    # replace the placeholder with the cleaned html
    data = data_with_replacement_placeholder.replace(replacement_placeholder, cleaned_html)
    return data

if __name__ == "__main__":
    data = """
    <html>
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
    </html>
    """
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

    print(clean_eml_header(EML_HEADER))

    # print(data)