import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import { reportWebVitals } from "@/lib/web-vitals-reporter";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found.");
}

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, <App />);
} else {
  createRoot(rootElement).render(<App />);
}

reportWebVitals();
