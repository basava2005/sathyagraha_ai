import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// ADD THIS LINE 👇
console.log("VITE API URL =>", import.meta.env.VITE_API_BASE_URL);

createRoot(document.getElementById("root")!).render(<App />);
