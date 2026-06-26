import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initViewport } from "./lib/viewport";
import "./index.css";
import App from "./App";

initViewport();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
