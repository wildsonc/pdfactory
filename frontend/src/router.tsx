import { createBrowserRouter } from "react-router-dom";
import Documents from "./pages/Documents";
import HtmlEditor from "./pages/Editor";
import Fonts from "./pages/Fonts";
import Home from "./pages/Home";
import { Login } from "./pages/Login";
import Root from "./pages/Root";
import Settings from "./pages/Settings";
import Templates from "./pages/Templates";
import Users from "./pages/Users";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/documents",
        element: <Documents />,
      },
      {
        path: "/templates",
        element: <Templates />,
      },
      {
        path: "/templates/:pk",
        element: <HtmlEditor />,
      },
      {
        path: "/fonts",
        element: <Fonts />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
]);
