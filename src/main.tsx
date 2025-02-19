import { SocketProvider } from "./store/socket/SocketContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { createRoot } from "react-dom/client";
import { router } from "./routes";
import React from "react";
import "./index.css";

const queryClient = new QueryClient();

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <RouterProvider router={router} />
          <Toaster />
        </SocketProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}
