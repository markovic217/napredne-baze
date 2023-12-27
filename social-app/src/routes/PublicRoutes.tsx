import { Navigate } from "react-router-dom";
import LoginPage from "../components/LoginPage";
import RegisterComponent from "../components/RegisterComponent";
import Root from "../components/Root";

const PublicRoutes = () => {
  return [
    {
      path: "/",
      element: <Root />,
      children: [
        { path: "/login", element: <LoginPage /> },
        { path: "/register", element: <RegisterComponent /> },
        { path: "*", element: <Navigate to="/login" /> },
      ],
    },
  ];
};

export default PublicRoutes;
