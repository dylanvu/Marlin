import axios from "axios";

console.log("background script loaded");

const api_url = "http://127.0.0.1:8000/analyze/";
let isLoading = false;
let lastURL = "";

chrome.runtime.onMessage.addListener((message, _, _a) => {
  console.log("message received in background script:", message);
  if (message.action === "openTab" && !isLoading && message.url !== lastURL) {
    lastURL = message.url;
    isLoading = true;
    chrome.tabs.create({ url: message.url });
  } else if (message.action === "closeTab") {
    const urlToClose = message.url; // URL to match for closing tabs

    chrome.tabs.query({}, (tabs) => {
      // Filter tabs that include the provided URL
      isLoading = false;
      console.log("tabs", tabs);
      const tabsToClose = tabs.filter((tab) => tab.active);
      tabsToClose.forEach((tab) => {
        chrome.tabs.remove(tab.id, () => {
          console.log(`Tab closed: ${tab.url}`);
        });
      });
      if (tabsToClose.length === 0) {
        console.log(`No tabs found with URL including: ${urlToClose}`);
      }
    });
  } else if (message.action === "startInference") {
    const input = message.input;
    axios.post(api_url, { input }).then((response) => {
      console.log(response.data);
    });
  }
});
