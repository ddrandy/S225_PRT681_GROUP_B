import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import RootLayout from "./layouts/RootLayout";
import { Home } from "./pages/Home";
import { EventsList } from "./pages/EventsList";
import { EventDetail } from "./pages/EventDetail";
import { Login } from "./pages/Login";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import { ProposeEvent } from "./pages/ProposeEvent";
import { AuthProvider } from "./auth";
import { ErrorBoundary } from "./ErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "events", element: <EventsList /> },
      { path: "events/:id", element: <EventDetail /> },
      { path: "login", element: <Login /> },
      { path: "admin", element: <AdminDashboard /> },
      { path: "me", element: <UserDashboard /> },
      { path: "propose", element: <ProposeEvent /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
