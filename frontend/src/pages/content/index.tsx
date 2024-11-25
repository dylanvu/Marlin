function createLoadingButton() {
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
    button.addEventListener("mouseover", updateLoadingButton);
    targetDiv.appendChild(button);
    console.log("Loading button added");
  }
}

function updateLoadingButton() {
  const loadingButton = document.getElementById("loading-button")!;
  chrome.storage.local.get(["inferenceResult"], (result) => {
    if (result.key !== "inferenceResult") {
      return;
    }
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
}

function resetLoadingButton() {
  const loadingButton = document.getElementById("loading-button");
  if (loadingButton) {
    loadingButton.style.setProperty("background-color", "#4285f4");
    loadingButton.textContent = "Loading...";
  }
}

// Detect URL changes and re-run scraping
function detectUrlChange() {
  const currentUrl = window.location.href;
  createLoadingButton();
  // check if we are in the email page
  const gmailInboxPattern =
    /^https:\/\/mail\.google\.com\/mail\/u\/\d+\/#inbox$/;
  const gmailMsgPattern =
    /^https:\/\/mail\.google\.com\/mail\/u\/\d+\/#inbox\//;

  if (gmailInboxPattern.test(currentUrl)) {
    console.log("Detected Gmail Home page");
    chrome.storage.local.clear().then(() => {
      resetLoadingButton();
    });
  } else if (gmailMsgPattern.test(currentUrl)) {
    console.log("Detected email page");
    // repeatedly attempt to scrape the necessary email id keys and inbox keys
    const [gmidKey, permMsgId] = inEmailPage();
    if (!gmidKey || !permMsgId) {
      console.log("Could not scrape email data. Retrying...");
      setTimeout(detectUrlChange, 5000);
      return;
    }
    // when we have both keys, we will construct the gmail link and open it
    const gmail_link = `https://mail.google.com/mail/u/0/?ik=${gmidKey}&view=om&permmsgid=msg-${permMsgId}`;
    chrome.runtime.sendMessage({ action: "openTab", url: gmail_link }); // Send message to background.js
  }
}

const inEmailPage = () => {
  const getSpan = document
    .querySelector("h2.hP")
    ?.getAttribute("data-thread-perm-id");

  let gmidKey = document
    .querySelector("link#embedded_data_iframe")
    ?.getAttribute("data-recorded-src");

  if (!gmidKey) {
    console.log("Could not get gmid key");
    return [null, null];
  }

  const values = gmidKey.split(",");
  const desiredValue = values[1]; // This should give you "61af1dbcb3"
  const value_stripped_by_3_on_both_sides = desiredValue.slice(3, -3);
  gmidKey = value_stripped_by_3_on_both_sides;
  console.log("Gmid_key:", gmidKey);

  if (!getSpan) {
    console.log("Could not get span");
    return [null, null];
  }

  const permMsgId = getSpan.slice(7);
  console.log("permmsgid:", permMsgId);

  return [gmidKey, permMsgId];
};

const getRawEML = () => {
  const ok = (document.querySelector(".raw_message")! as HTMLElement).innerText;
  return ok;
};

// immediately invoked function expression (IIFE): https://developer.mozilla.org/en-US/docs/Glossary/IIFE
(function init() {
  const gmailEmlPattern =
    /^https:\/\/mail\.google\.com\/mail\/u\/\d+\/\?ik=.*$/;

  if (gmailEmlPattern.test(window.location.href)) {
    console.log("in EML page");
    // scrape the EML data
    const text = getRawEML();
    chrome.runtime.sendMessage({
      action: "closeTab",
      url: window.location.href,
    });
    chrome.runtime.sendMessage({ action: "processEML", input: text });
    return;
  }

  try {
    const observer = new MutationObserver(detectUrlChange);
    observer.observe(document.body, { childList: true, subtree: false });
    console.log("Observer created");

    chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
      const action = request.action;
      if (action == "receivedPrompt") {
        console.log("Received prompt");
        // TODO: send prompt to LLM
        updateLoadingButton();
      }
    });
    console.log("Content script loaded successfully.");
  } catch (e) {
    console.error(`Error loading content script: ${e}`);
  }
})();
