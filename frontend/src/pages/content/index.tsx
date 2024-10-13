import { createRoot } from "react-dom/client";

// function createNotification() {

//   // create a div, and make it the root
//   const div = document.createElement("div");
//   div.id = "__root";

//   // attach a shadow div (sub-div) named shadowRoot to out root div
//   const shadowRoot = div.attachShadow({ mode: "open" });

//   // add our root div to the body
//   document.body.appendChild(div);

//   // create a sub-div of the shadow root div
//   const shadowDiv = document.createElement("div");
//   shadowRoot.appendChild(shadowDiv);
  
//   // apply a style sheet to the shadow root div
//   // const style = document.createElement("style");
//   // style.textContent = ``;
//   // shadowRoot.appendChild(style);

//   return shadowDiv;

// }

// function addNotification() {
//   const rootContainer = document.querySelector('#__root');
//   if (!rootContainer) throw new Error("Can't find Content root element");
//   const root = createRoot(rootContainer);
//   root.render(
//     <div className="shadow-container">Content script loaded in Shadow DOM</div>
//   );
// }

function notif() {

  const div = document.createElement("div");
  div.id = "__root";
  // const shadowRoot = div.attachShadow({ mode: "open" });

  document.body.appendChild(div);

  // const shadowDiv = document.createElement("div");
  // shadowRoot.appendChild(shadowDiv);
  
  const style = document.createElement("style");
  style.textContent = `
    .container {
      position: absolute;
      bottom: 0;
      left: 0;
      font-size: 1.125rem; // text-lg
      color: black;
      background-color: #fbbf24; // amber-400
      z-index: 9999;
      padding: 0.5rem;
      border-radius: 0.25rem;
    }
  `;

  // shadowRoot.appendChild(style);
  document.head.appendChild(style);

  if (!div) throw new Error("Can't find Content root element");
  const root = createRoot(div);
  root.render(
    <div className="container">Content script loaded in Shadow DOM</div>
  );

}

function init() {
  try {
    notif();
    // createNotification();
    // addNotification();
    console.log("Content script loaded successfully.");
  } catch (e) {
    console.error(`Error in content script: ${e}`);
  }
}

init();

/* *********************************** DO NOT EDIT ANYTHING BELOW THIS *********************************** */

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

const inEMLPage = () => {
  // Check if the URL starts with "https://mail.google.com/mail/u/(any number)/#inbox/"
  const ok = (document.querySelector(".raw_message")! as HTMLElement).innerText;
  return ok;
};
// Detect URL changes and re-run scraping

function detectUrlChange() {
  const currentUrl = window.location.href;
  // check if we are in the email page
  const gmailUrlPattern =
    /^https:\/\/mail\.google\.com\/mail\/u\/\d+\/#inbox\//;
  if (gmailUrlPattern.test(currentUrl)) {
    // if we are in the email page, we will repeatedly attempt to scrape the necessary email id keys and inbox keys
    const [gmid_key, other_part_of_url] = inEmailPage();
    if (!gmid_key || !other_part_of_url) {
      console.log("Could not scrape email data. Retrying...");
      setTimeout(detectUrlChange, 200);
      return;
    }
    // when we have both keys, we will construct the gmail link and open it
    const gmail_link = `https://mail.google.com/mail/u/0/?ik=${gmid_key}&view=om&permmsgid=msg-${other_part_of_url}`;

    if (isLoading) {
      chrome.runtime.sendMessage({ action: "openTab", url: gmail_link }); // Send message to background.js
    }
    // check if we are in the speical original email page
  } else if (currentUrl.includes("https://mail.google.com/mail/u/0/?ik")) {
    // if we are:
    // Then we will scrape it
    console.log("HELP");
    const text = inEMLPage();
    console.log(text);
    // then we will close it
    chrome.runtime.sendMessage({
      action: "closeTab",
      url: window.location.href,
    });
  }
}

const observer = new MutationObserver(detectUrlChange);
observer.observe(document.body, { childList: true, subtree: false });
const inEmailPage = () => {
  const getSpan = document
    .querySelector("h2.hP")
    ?.getAttribute("data-thread-perm-id");

  const gmidKey = document
    .querySelector("link#embedded_data_iframe")
    ?.getAttribute("data-recorded-src");
  if (!gmidKey) {
    console.log("Could not get gmid key");
    return [null, null];
  }
  const values = gmidKey.split(",");
  const desiredValue = values[1]; // This should give you "61af1dbcb3"
  const value_stripped_by_3_on_both_sides = desiredValue.slice(3, -3);
  const gmid_key = value_stripped_by_3_on_both_sides;
  console.log(gmid_key);
  if (!getSpan) {
    console.log("Could not get span");
    return [null, null];
  }
  const other_part_of_url = getSpan.slice(7);

  console.log(other_part_of_url);

  return [gmid_key, other_part_of_url];
};
