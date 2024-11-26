/* To view console log messages in this file, inspect the extension's popup */

import axios from "axios";
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

import { LLMResponseType } from "@src/global";

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
    .then(async (response) => {
      const prompt: Prompt[] = response.data;
      console.log("Prompt:", prompt);

      const [systemPrompt, userPrompt] = prompt;
      const params: GeminiParams = {
        systemPrompt: systemPrompt.content,
        // temperature: 0,
        // topK: 1,
      };

      let result: LLMResponseType = null;
      console.log("Prompting LLM with:", params);

      try {
        result = await runPrompt(userPrompt.content, params);
      } catch (e) {
        console.error("Error in processing LLM locally:", e);
      }

      if (!result) {
        result = {
          is_phishing: false,
          phishing_score: 0,
          brand_impersonated: "",
          brief_reason: "",
          observations: [],
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

// if temperature is provided, topK must also be provided
type GeminiParams = {
  systemPrompt: string;
  temperature?: number;
  topK?: number;
};

type Prompt = {
  role: string;
  content: string;
};

const observationSchema = z.object({
  description: z
    .string()
    .describe(
      "description of the observation, using references where possible"
    ),
  severity: z
    .number()
    .describe("severity of the observation, on a scale from 1 to 3"),
});

const emailSchema = z.object({
  is_phishing: z
    .boolean()
    .describe(
      "a boolean value indicating whether the email is phishing (true) or legitimate (false)"
    ),
  phishing_score: z
    .number()
    .describe(
      "phishing risk confidence score as an integer on a scale from 0 to 10"
    ),
  brand_impersonated: z
    .string()
    .describe("brand name associated with the email, if applicable"),
  observations: z.array(observationSchema),
  brief_reason: z.string().describe("brief reason for the determination"),
});

async function runPrompt(prompt: string, params: GeminiParams) {
  try {
    const parser = StructuredOutputParser.fromZodSchema(emailSchema);
    const session = await chrome.aiOriginTrial.languageModel.create(params);
    const res = await session.prompt(prompt);
    const res_json = await parser.parse(res);
    return res_json;
  } catch (e) {
    console.error("Prompt failed", e);
  }
}

console.log("Background script loaded");
