import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./ui/theme/index.css";
import { App } from "./app/App";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/COPApp/">
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>,
);
