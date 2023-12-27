import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";

import LoginComponent from "../components/LoginComponent";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";

interface Props {
  isLogged: boolean;
}
export const Router = ({ isLogged }: Props) => {
  
  var privateRoutes = [{}];
  if (isLogged) {
    privateRoutes = PrivateRoutes();
    
  }
  const router = createBrowserRouter([...privateRoutes, ...PublicRoutes()]);

  return <RouterProvider router={router} />;
};
