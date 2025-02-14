import { createBrowserRouter } from "react-router-dom";
import { About, Login, Register } from "@/pages";
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
]);
