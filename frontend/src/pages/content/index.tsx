import { createRoot } from "react-dom/client";
import { c } from "vite/dist/node/types.d-aGj9QkWt";

// Create a div in the DOM
const div = document.createElement("div");
div.id = "__root";
const shadowRoot = div.attachShadow({ mode: "open" });

document.body.appendChild(div);

const shadowDiv = document.createElement("div");
shadowRoot.appendChild(shadowDiv);
const style = document.createElement("style");
style.textContent = `
  .shadow-container {
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 1.125rem; /* text-lg */
    color: black;
    background-color: #fbbf24; /* amber-400 */
    z-index: 50;
    padding: 0.5rem;
    border-radius: 0.25rem;
  }
`;
shadowRoot.appendChild(style);

const rootContainer = shadowDiv;
if (!rootContainer) throw new Error("Can't find Content root element");
const root = createRoot(rootContainer);
root.render(
  <div className="shadow-container">Content script loaded in Shadow DOM</div>
);

try {
  console.log("Content script loaded successfully.");
} catch (e) {
  console.error("Error in content script:", e);
}

// src/contentScript.js

// Function to scrape email data
function scrapeEmailData() {
  const subjectLineElement = document.querySelector("h2.hP");
  const subjectLine = subjectLineElement
    ? (subjectLineElement as HTMLElement).innerText
    : "No subject line found";

  const profilePictureElement = document.querySelector("img.ajn");
  const profilePicture = profilePictureElement
    ? (profilePictureElement as HTMLImageElement).src
    : "No profile picture found";

  const emailAddressElement = document.querySelector(".go");
  const emailAddress = emailAddressElement
    ? (emailAddressElement as HTMLElement).innerText
    : "No email address found";

  const emailContentElement = document.querySelector(".a3s");
  const emailContent = emailContentElement
    ? (emailContentElement as HTMLElement).innerText
    : "No email content found";

  console.log({
    subjectLine,
    profilePicture,
    emailAddress,
    emailContent,
  });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getStarted") {
    scrapeEmailData();
    sendResponse({ status: "Email data scraped" });
  }
});

// Detect URL changes and re-run scraping
let lastUrl = window.location.href;

function detectUrlChange() {
  const currentUrl = window.location.href;
  if (currentUrl === lastUrl) {
    return;
  }
  lastUrl = currentUrl;
  console.log(`URL changed. New URL: ${currentUrl}`);
  scrapeEmailData();
  setTimeout(getGmailLink, 4000);
}

setInterval(detectUrlChange, 1000);

// Function to fetch and construct the Gmail link
const getGmailLink = () => {
  const currentUrl = window.location.href;

  // Check if the URL starts with "https://mail.google.com/mail/u/(any number)/#inbox/"
  if (window.location.href.includes("https://mail.google.com/mail/u/0/?ik")) {
    const ok = (document.querySelector(".raw_message")! as HTMLElement)
      .innerText;

    console.log(ok);
    setTimeout(() => {}, 50000);
    chrome.runtime.sendMessage({
      action: "closeTab",
      url: window.location.href,
    });
  }
  const gmailUrlPattern =
    /^https:\/\/mail\.google\.com\/mail\/u\/\d+\/#inbox\//;
  if (gmailUrlPattern.test(currentUrl)) {
    // Perform the logic if the URL matches
    const getSpan = document
      .querySelector("h2.hP")
      ?.getAttribute("data-thread-perm-id");
    const gmidKey = document
      .querySelector("link#embedded_data_iframe")
      ?.getAttribute("data-recorded-src");
    const values = gmidKey?.split(",");
    setTimeout(() => {}, 100);
    const desiredValue = values![1]; // This should give you "61af1dbcb3"
    const value_stripped_by_3_on_both_sides = desiredValue.slice(3, -3);
    const gmid_key = value_stripped_by_3_on_both_sides;
    console.log(gmid_key);
    const other_part_of_url = getSpan?.slice(7);
    console.log(other_part_of_url);

    if (gmid_key === undefined || other_part_of_url === undefined) {
      return;
    }
    const gmail_link = `https://mail.google.com/mail/u/0/?ik=${gmid_key}&view=om&permmsgid=msg-${other_part_of_url}`;

    console.log(gmail_link);

    chrome.runtime.sendMessage({ action: "openTab", url: gmail_link }); // Send message to background.js
  }
};

setTimeout(getGmailLink, 2000);
