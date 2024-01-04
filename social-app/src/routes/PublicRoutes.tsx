import { Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Register from "../pages/Register";
import Root from "./Root";
import Container from "../components/ui/LayoutContainer";

const PublicRoutes = () => {
  return [
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "/login",
          element: (
            <Container>
              <LoginPage />
            </Container>
          ),
        },
        {
          path: "/register",
          element: (
            <Container>
              <Register />
            </Container>
          ),
        },
        { path: "*", element: <Navigate to="/login" /> },
      ],
    },
  ];
};

export default PublicRoutes;
