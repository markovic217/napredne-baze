import { Navigate } from "react-router-dom";
import LoginComponent from "../components/LoginComponent";
import RegisterComponent from "../components/RegisterComponent";
import Root from "../components/Root";

const PublicRoutes = () => {
  return [
    {
      path: "/",
      element: <Root />,
      children: [
        { path: "/login", element: <LoginComponent /> },
        { path: "/register", element: <RegisterComponent /> },
        { path: "*", element: <Navigate to="/login" /> }
      ],
    },
  ];
};

export default PublicRoutes;
