import { z } from "zod";

declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module "*.json" {
  const content: string;
  export default content;
}

// Custom types

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

type LLMResponseType = z.infer<typeof emailSchema>;
