import { About, ErrorPage, Login, Redirect, Register } from "@/pages";
import { createBrowserRouter } from "react-router-dom";
import App from "@/App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "about",
    element: <About />,
  },
  {
    path: "redirect",
    element: <Redirect />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
