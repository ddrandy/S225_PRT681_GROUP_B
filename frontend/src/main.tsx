import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import EventsList from "./pages/EventsList";
import EventDetail from "./pages/EventDetail";
import RootLayout from "./layouts/RootLayout"; // <-- add
import Login from "./pages/Login";
import { AuthProvider } from "./auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,      // <-- Nav now lives inside the router
    children: [
      { index: true, element: <EventsList /> },
      { path: "events/:id", element: <EventDetail /> },
      // add other routes here...
      { path: "login", element: <Login /> },
      // { path: "admin/events", element: <AdminEvents /> },
      // { path: "admin/users", element: <AdminUsers /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* must wrapped Router */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
