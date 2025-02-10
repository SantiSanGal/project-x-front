import { createBrowserRouter } from "react-router-dom";
import { About, Login } from "@/pages";
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
    path: "about",
    element: <About />,
  },
]);
