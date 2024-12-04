/* To view console log messages in this file, inspect the extension's popup */

import axios from "axios";

import type { GeminiParams, LLMResponseType } from "@src/global.d.ts";
import { systemPrompt, emailSchemaParser } from "@src/global.d.js";

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

function handleProcessEML(eml: string) {
  axios
    .post(API_URL, { eml })
    .then(async (response) => {
      const cleaned_eml: string = response.data;
      console.log("cleaned eml:", cleaned_eml);

      const params: GeminiParams = {
        systemPrompt: systemPrompt,
        temperature: 0,
        topK: 1,
      };
      console.log("Prompting LLM with params:", params);

      let userPrompt = `Email: ${cleaned_eml}\nAnswer: `;
      let result: LLMResponseType | null = null;
      try {
        result = await runPrompt(userPrompt, params);
      } catch (e) {
        console.error("Error in processing LLM locally:", e);
      }

      if (!result) {
        result = {
          is_phishing: false,
          phishing_score: 1,
          brand_impersonated: "Google",
          brief_reason:
            "This is a sample analysis result that appears when the LLM prompt fails.",
          observations: [
            {
              description: "Testing low severity observation.",
              severity: 1,
            },
            {
              description: "Testing medium severity observation.",
              severity: 2,
            },
            {
              description: "Testing high severity observation.",
              severity: 3,
            },
          ],
        };
      }

      console.log("Inference result from background script:", result);

      chrome.storage.local.set({ inferenceResult: result }).then(() => {
        console.log("Saved inference result to local storage");
        const msg = {
          action: "receivedInference",
        };
        sendMessageToTab(msg);
        sendMessageToRuntime(msg);
      });
    })
    .catch((error) => {
      console.error("Error in API call to server:", error);
    });
}

function sendMessageToTab(message: object) {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab && tab.id) {
        chrome.tabs.sendMessage(tab.id, message);
      }
    }
  });
}

function sendMessageToRuntime(message: object) {
  chrome.runtime.sendMessage(message);
}

async function runPrompt(
  prompt: string,
  params: GeminiParams
): Promise<LLMResponseType | null> {
  try {
    const session = await chrome.aiOriginTrial.languageModel.create(params);
    const tokenCount = await session.countPromptTokens(prompt);
    console.log(`Prompt tokens: ${tokenCount}`);

    const res = await session.prompt(prompt);
    const res_json = await emailSchemaParser.parse(res);
    return res_json as LLMResponseType;
  } catch (e) {
    console.error("Prompt failed:", e);
    return null;
  }
}

console.log("Background script loaded");
