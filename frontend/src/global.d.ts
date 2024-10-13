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

type barColor = "green" | "yellow" | "red";

interface BarContent {
  suspiciousPortion: string;
  reason: string;
  action: string;
  color: barColor;
}