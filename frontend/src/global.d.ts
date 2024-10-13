declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.json' {
  const content: string;
  export default content;
}

// Custom types

interface LLMResponseType {
  is_phishing: boolean;
  phishing_score: number;
  brand_impersonated: string;
  brief_reason: string;
  observations: LLMObservationType[];
}

interface LLMObservationType {
  description: string;
  severity: number;
}