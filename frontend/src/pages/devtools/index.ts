import Browser from 'webextension-polyfill';

Browser
  .devtools
  .panels
  .create('Dev Tools', 'fish-256.png', 'src/pages/panel/index.html')
  .catch(console.error);
