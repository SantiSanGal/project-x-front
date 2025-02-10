import { SocketProvider } from "./store/socket/SocketContext";
import { RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { router } from "./routes";
import React from "react";
import "./index.css";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </React.StrictMode>
  );
}
