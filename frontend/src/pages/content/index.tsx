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

// Function to scrape the email data
function scrapeEmailData() {
  // Scrape the profile picture
  const profilePictureElement = document.querySelector("img.ajn");
  const profilePicture = profilePictureElement
    ? (profilePictureElement as HTMLImageElement).src
    : "No profile picture found";

  // Scrape the email content
  const emailContentElement = document.querySelector(".a3s");
  const emailContent = emailContentElement
    ? (emailContentElement as HTMLElement).innerText
    : "No email content found";

  // Log the scraped data
  console.log({
    profilePicture,
    emailContent,
  });

  // Send the data to the background script or React app
  chrome.runtime.sendMessage({
    profilePicture,
    emailContent,
  });
}

// Function to detect URL changes
let lastUrl = window.location.href;

const detectUrlChange = () => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    // Trigger the scraping logic when the URL changes
    console.log("URL changed:", currentUrl);
    observeEmailChanges();
  }
};

// Function to observe email content changes and scrape data
let observer: MutationObserver;
const observeEmailChanges = () => {
  if (observer) {
    observer.disconnect(); // Stop any existing observer
  }

  observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      const profilePictureElement = document.querySelector("img.ajn");
      const emailContentElement = document.querySelector(".a3s");

      if (profilePictureElement && emailContentElement) {
        scrapeEmailData();
        observer.disconnect();
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

setInterval(detectUrlChange, 5000);
observeEmailChanges();
