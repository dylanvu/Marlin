import Browser from "webextension-polyfill";

Browser.devtools.panels
  .create("Dev Tools", "fish-256.png", "src/pages/devtools/index.html")
  .catch(console.error);
