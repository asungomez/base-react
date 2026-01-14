import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { Amplify } from "aws-amplify";
import AWSConfig from "./aws-exports";

// Ensure Node-style globals exist for browser bundles (used by aws-amplify).
if (typeof global === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).global = window;
}

Amplify.configure(AWSConfig);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
