import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import { useEffect } from "react";

export const Router = ({ }) => {
  let user = localStorage.getItem("user");
  let privateRoutes = [{}];
  
  //if (user) {
    privateRoutes = PrivateRoutes();
  //}
  const router = createBrowserRouter([...privateRoutes, ...PublicRoutes()]);

  

  return <RouterProvider router={router} />;
};
