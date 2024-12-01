import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

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

/* if temperature is provided, topK must also be provided */
type GeminiParams = {
  systemPrompt?: string;
  temperature?: number;
  topK?: number;
};

const context = `You are an expert email security analyst tasked with carefully and objectively evaluating an email's legitimacy.
Your goal is to provide a balanced, evidence-based assessment of a given email (in .eml format) that avoids both false positives and false negatives.
Phishing emails often impersonate legitimate brands and use social engineering techniques to deceive users.
These techniques include, but are not limited to: fake rewards, fake warnings about account problems, and creating a sense of urgency or interest.
Spoofing the sender's address and embedding deceptive HTML links are common tactics.
Analyze the email by following these steps:
1. Identify any impersonation of well-known brands.
2. Examine the email header for spoofing signs, such as the sender name or email address discrepancies. Evaluate the subject line for typical phishing characteristics (e.g., urgency, promise of reward). Note that the To address has been replaced with a dummy address.
3. Analyze the email body for social engineering tactics to induce hyperlink clicks. Inspect URLs to determine if they are misleading or lead to suspicious websites.
4. Provide a comprehensive evaluation of the email, highlighting specific elements that support your conclusion. Include a detailed explanation of any phishing or legitimacy indicators found in the email.
5. Summarize your findings and provide your final verdict on the legitimacy of the email, supported by the evidence you gathered.
Look for both suspicious and legitimate elements. Avoid snap judgments. Focus on objective, transparent analysis that considers the full context of the email.
`;

const observationSchema = z.object({
  description: z
    .string()
    .nullable()
    .describe("Description of the observation, using specific references"),
  severity: z
    .number()
    .describe("Severity of the observation: 1 (Low), 2 (Medium), 3 (High)"),
});

const emailSchema = z.object({
  brand_impersonated: z
    .string()
    .describe("Brand name associated with the email"),
  observations: z
    .array(observationSchema)
    .describe("List of key observations (1-3 observations)"),
  phishing_score: z
    .number()
    .describe("Phishing risk confidence score (1-10 scale)"),
  is_phishing: z.boolean(),
  brief_reason: z
    .string()
    .describe("Concise explanation for the phishing determination"),
});

type LLMObservationType = z.infer<typeof observationSchema>;

type LLMResponseType = z.infer<typeof emailSchema>;

export const emailSchemaParser =
  StructuredOutputParser.fromZodSchema(emailSchema);

export const systemPrompt = `${context}\n${emailSchemaParser.getFormatInstructions()}`;
