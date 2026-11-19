import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Each route is its own chunk. The admin chunk never imports content.json directly,
// so saving from the admin does not hot-reload the page you're editing in.
const App = lazy(() => import("./App.jsx"));
const ResumePage = lazy(() => import("./resume/ResumePage.jsx"));
const Admin = lazy(() => import("./admin/Admin.jsx"));

const path = window.location.pathname.replace(/\/+$/, "") || "/";
const Page = path === "/admin" ? Admin : path === "/resume" ? ResumePage : App;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<div className="min-h-screen bg-ink" />}>
      <Page />
    </Suspense>
  </StrictMode>,
);
