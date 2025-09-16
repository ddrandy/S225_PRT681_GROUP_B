import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import EventsList from "./pages/EventsList";
import EventDetail from "./pages/EventDetail";
import RootLayout from "./layouts/RootLayout"; // <-- add

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,      // <-- Nav now lives inside the router
    children: [
      { index: true, element: <EventsList /> },
      { path: "events/:id", element: <EventDetail /> },
      // add other routes here...
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
