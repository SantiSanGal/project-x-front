import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import {
  About,
  Login,
  Redirect,
  Register,
  ErrorPage,
  PoliciesPrivacy,
} from "@/pages";

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
    path: "/redirect/:hash",
    element: <Redirect />,
  },
  {
    path: "/policies",
    element: <PoliciesPrivacy />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
