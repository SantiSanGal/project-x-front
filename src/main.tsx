import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SocketProvider } from "./store/socket/SocketContext";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { createRoot } from "react-dom/client";
import { router } from "./routes";
import React from "react";
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google'

const queryClient = new QueryClient();
const container = document.getElementById("root");
const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <GoogleOAuthProvider clientId={client_id}>
            <RouterProvider router={router} />
            <Toaster />
          </GoogleOAuthProvider>
        </SocketProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}
