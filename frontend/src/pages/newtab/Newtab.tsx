import React from "react";
import logo from "@assets/img/PhisherMen.webp";
import "@pages/newtab/Newtab.css";

export default function Newtab(): JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          PhisherMen has your back when browsing the web!
        </p>
      </header>
    </div>
  );
}
