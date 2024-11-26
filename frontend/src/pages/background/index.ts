/* To view console log messages in this file, inspect the extension's popup */

import axios from "axios";

const API_URL = "http://127.0.0.1:8000/prompt/";
let isLoading = false;
let lastURL = "";

chrome.runtime.onMessage.addListener((message, _sender, _response) => {
  console.log("Background action:", message.action);
  switch (message.action) {
    case "openTab":
      handleOpenTab(message.url);
      break;
    case "closeTab":
      handleCloseTab(message.url);
      break;
    case "processEML":
      handleProcessEML(message.input);
      break;
    default:
      console.log("Unknown action:", message.action);
  }
});

function handleOpenTab(url: string) {
  if (!isLoading && url !== lastURL) {
    lastURL = url;
    isLoading = true;
    chrome.tabs.create({ url });
  }
}

function handleCloseTab(urlToClose: string) {
  isLoading = false;
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.url === urlToClose) {
        chrome.tabs.remove(tab.id!);
        return;
      }
    }
    console.error(`No tabs found with URL including: ${urlToClose}`);
  });
}

function handleProcessEML(input: string) {
  axios
    .post(API_URL, { eml: input })
    .then((response) => {
      const prompt = response.data;
      console.log("Prompt:", prompt);
      sendMessageToTab({ action: "receivedPrompt", prompt: prompt });
    })
    .catch((error) => {
      console.error("Error in processing prompt:", error);
    });
}

function sendMessageToTab(message: object) {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    for (const tab of tabs) {
      if (tab && tab.id) {
        chrome.tabs.sendMessage(tab.id, message);
      }
    }
  });
}

console.log("Background script loaded");
