import React from "react";

export default function Popup(): JSX.Element {
  const onclick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getStarted" });
      }
    });
  };

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
      <header className="flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold">PhisherMen</h1>
        <p className="mt-3">PhisherMen has your back when browsing the web!</p>
        <button
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-800"
          onClick={onclick}
        >
          Manual Get Started
        </button>
      </header>
    </div>
  );
}
