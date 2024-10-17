import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import VotingPage from "./App.jsx";
import AdminPage from "./pages/Admin.jsx";
import VoteSuccess from "./pages/VoteSuccess.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <VotingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin_res",
    element: <AdminPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/vote_success",
    element: <VoteSuccess />,
    errorElement: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    <SpeedInsights />
    <Analytics />
  </StrictMode>
);
