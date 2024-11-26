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
  const loadingButton = document.getElementById("loading-button");
  if (!loadingButton) return;

  chrome.storage.local.get(["inferenceResult"], (result) => {
    const inferenceResult = result.inferenceResult;
    if (!inferenceResult) return;

    const score = inferenceResult.phishing_score;
    if (score > 7) {
      loadingButton.style.backgroundColor = "red";
      loadingButton.textContent = "Dangerous";
    } else if (score > 3) {
      loadingButton.style.backgroundColor = "yellow";
      loadingButton.textContent = "Risky";
    } else {
      loadingButton.style.backgroundColor = "green";
      loadingButton.textContent = "Safe";
    }
  });
}

function resetLoadingButton() {
  const loadingButton = document.getElementById("loading-button");
  if (loadingButton) {
    loadingButton.style.backgroundColor = "#4285f4";
    loadingButton.textContent = "Loading...";
  }
}

function detectUrlChange() {
  const currentUrl = window.location.href;
  createLoadingButton();

  const gmailInboxPattern =
    /^https:\/\/mail\.google\.com\/mail\/u\/\d+\/#inbox$/;
  const gmailMsgPattern =
    /^https:\/\/mail\.google\.com\/mail\/u\/\d+\/#inbox\//;

  if (gmailInboxPattern.test(currentUrl)) {
    console.log("Detected Gmail Home page");
    chrome.storage.local.clear().then(resetLoadingButton);
  } else if (gmailMsgPattern.test(currentUrl)) {
    console.log("Detected email page");
    const [gmidKey, permMsgId] = inEmailPage();
    if (!gmidKey || !permMsgId) {
      console.log("Could not scrape email data. Retrying...");
      setTimeout(detectUrlChange, 5000);
      return;
    }
    const gmailLink = `https://mail.google.com/mail/u/0/?ik=${gmidKey}&view=om&permmsgid=msg-${permMsgId}`;
    chrome.runtime.sendMessage({ action: "openTab", url: gmailLink });
  }
}

function inEmailPage() {
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
  gmidKey = values[1]?.slice(3, -3);
  console.log("Gmid_key:", gmidKey);

  if (!getSpan) {
    console.log("Could not get span");
    return [null, null];
  }

  const permMsgId = getSpan.slice(7);
  console.log("permmsgid:", permMsgId);

  return [gmidKey, permMsgId];
}

function getRawEML() {
  return (
    (document.querySelector(".raw_message") as HTMLElement)?.innerText || ""
  );
}

type GeminiParams = {
  systemPrompt: string;
  temperature: number;
};

async function runPrompt(prompt: string, params: GeminiParams) {
  try {
    const session = await chrome.aiOriginTrial.languageModel.create(params);
    return session.prompt(prompt);
  } catch (e) {
    console.error("Prompt failed", e);
  }
}

(function init() {
  const gmailEmlPattern =
    /^https:\/\/mail\.google\.com\/mail\/u\/\d+\/\?ik=.*$/;

  if (gmailEmlPattern.test(window.location.href)) {
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

    chrome.runtime.onMessage.addListener((request) => {
      if (request.action === "receivedPrompt") {
        console.log("Received prompt:", request.prompt);
      }
    });
    console.log("Content script loaded successfully.");
  } catch (e) {
    console.error(`Error loading content script: ${e}`);
  }
})();
