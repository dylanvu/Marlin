import { createRoot } from "react-dom/client";

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

// Scrape email data

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

  chrome.runtime.sendMessage({
    profilePicture,
    emailContent,
  });

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getStarted") {
    scrapeEmailData();
    sendResponse({ status: "Email data scraped" });
  }
});

// run scrapeEmailData() whenever URL changes

let lastUrl = window.location.href;

function detectUrlChange() {
  const currentUrl = window.location.href;
  if (currentUrl === lastUrl) {
    return;
  }
  lastUrl = currentUrl;
  console.log(`URL changed. New URL: ${currentUrl}`);
  scrapeEmailData();
}

setInterval(detectUrlChange, 1000);