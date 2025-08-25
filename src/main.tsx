import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SocketProvider } from "./store/socket/SocketContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { createRoot } from "react-dom/client";
import { router } from "./routes";
import React from "react";
import "./index.css";

const queryClient = new QueryClient();
const container = document.getElementById("root");
const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
import { millionApi } from "@/api/million.api";
const saved = localStorage.getItem("user-storage");

if (saved) {
  try {
    const state = JSON.parse(saved).state;
    const token = state?.accessToken;
    if (token) {
      millionApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  } catch { }
}

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={client_id}>
        <QueryClientProvider client={queryClient}>
          <SocketProvider>
            <RouterProvider router={router} />
            <Toaster />
          </SocketProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
}
