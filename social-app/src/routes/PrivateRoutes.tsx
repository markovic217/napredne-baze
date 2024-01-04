//import { HomePage } from 'pages/Home';

import { Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Root from "./Root";
import Profile from "../pages/Profile";
import InboxPage from "../pages/InboxPage";
import Container from "../components/ui/LayoutContainer";

const PrivateRoutes = () => {
  return [
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "/home",
          element: (
            <Container>
              <HomePage />
            </Container>
          ),
        },
        {
          path: "/profile",
          element: <Profile isYourProfile={true} />,
        },
        {
          path: "/search-profile/:username",
          element: <Profile isYourProfile={false} />,
        },
        {
          path: "/inbox",
          element: <InboxPage />,
        },
        { path: "*", element: <Navigate to="/home" /> },
      ],
    },
  ];
};


export default PrivateRoutes;
