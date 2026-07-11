import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { AppErrorBoundary } from "./components/layout/AppErrorBoundary";
import "./styles/tailwind.css";
import "./styles/theme.css";
import "./styles/base.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <RouterProvider router={router} />
    </AppErrorBoundary>
  </React.StrictMode>
);

if (typeof window !== "undefined" && typeof window.__appBootOk === "function") {
  window.__appBootOk();
}
