import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import { Login } from "@/pages/Login";
import { About } from "@/pages/About";

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
    path: "about",
    element: <About />,
  },
]);
