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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const action = request.action;
  if (action == "receiveInference") {
    console.log("Received inference result");
    loadingButton();
  }
});

function resetButton() {
  const loadingButton = document.getElementById("loading-button");
  if (loadingButton) {
    loadingButton.style.setProperty("background-color", "#4285f4");
    loadingButton.textContent = "Loading...";
  }
}

function loadingButton() {
  // check if we already have the loading-button id element
  const loadingButton = document.getElementById("loading-button")!;
  if (loadingButton) {
    chrome.storage.local.get(["inferenceResult"], (result) => {
      const inferenceResult = result.inferenceResult;
      const score = inferenceResult.phishing_score;
      if (score > 7) {
        loadingButton.style.setProperty("background-color", "red");
        loadingButton.textContent = "Dangerous";
      } else if (score > 3) {
        loadingButton.style.setProperty("background-color", "yellow");
        loadingButton.textContent = "Risky";
      } else {
        loadingButton.style.setProperty("background-color", "green");
        loadingButton.textContent = "Safe";
      }
    });
    return;
  }

  const targetDiv = document.querySelector(".aeF");
  if (targetDiv) {
    const button = document.createElement("button");
    button.textContent = "Loading...";
    button.id = "loading-button";
    button.style.cssText = `
      position: absolute;
      bottom: 10px;
      left: 10px;
      padding: 5px 10px;
      background-color: #4285f4;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;
    targetDiv.appendChild(button);
    button.addEventListener("click", loadingButton);
  }
}

console.log("Loading button added");

function notif() {}

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

const inEMLPage = () => {
  // Check if the URL starts with "https://mail.google.com/mail/u/(any number)/#inbox/"
  const ok = (document.querySelector(".raw_message")! as HTMLElement).innerText;
  return ok;
};

// Detect URL changes and re-run scraping
function detectUrlChange() {
  console.log("in detectUrlChange");
  const currentUrl = window.location.href;
  console.log("currentUrl:", currentUrl);
  loadingButton();
  // check if we are in the email page
  const gmailHomePattern =
    /^https:\/\/mail\.google\.com\/mail\/u\/\d+\/#inbox$/;
  const gmailUrlPattern =
    /^https:\/\/mail\.google\.com\/mail\/u\/\d+\/#inbox\//;
  if (gmailHomePattern.test(currentUrl)) {
    console.log("Detected Gmail Home page");
    chrome.storage.local.clear().then(() => {
      resetButton();
    });
  } else if (gmailUrlPattern.test(currentUrl)) {
    console.log("Detected email page");
    // if we are in the email page, we will repeatedly attempt to scrape the necessary email id keys and inbox keys
    const [gmid_key, other_part_of_url] = inEmailPage();
    if (!gmid_key || !other_part_of_url) {
      console.log("Could not scrape email data. Retrying...");
      setTimeout(detectUrlChange, 5000);
      return;
    }
    // when we have both keys, we will construct the gmail link and open it
    const gmail_link = `https://mail.google.com/mail/u/0/?ik=${gmid_key}&view=om&permmsgid=msg-${other_part_of_url}`;
    chrome.runtime.sendMessage({ action: "openTab", url: gmail_link }); // Send message to background.js
    // check if we are in the speical original email page
  } else if (currentUrl.startsWith("https://mail.google.com/mail/u/0/?ik")) {
    // if we are:
    // Then we will scrape it
    const text = inEMLPage();
    chrome.runtime.sendMessage({ action: "startInference", input: text });
    // then we will close it
    chrome.runtime.sendMessage({
      action: "closeTab",
      url: window.location.href,
    });
  }
}

const observer = new MutationObserver(detectUrlChange);
observer.observe(document.body, { childList: true, subtree: false });
console.log("Observer created");

if (window.location.href.startsWith("https://mail.google.com/mail/u/0/?ik=")) {
  detectUrlChange();
}

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
