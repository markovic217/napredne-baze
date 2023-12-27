//import { HomePage } from 'pages/Home';

import { Navigate } from "react-router-dom";
import HomePage from "../components/HomePage";
import Root from "../components/Root";
import Profile from "../components/Profile";

const PrivateRoutes = () => {
  return [
    {
      path: "/",
      element: <Root />,
      children: [
        { path: "/home", element: <HomePage /> },
        { path: "/profile", element: <Profile isYourProfile={true} /> },
        {
          path: "/search-profile/:username",
          element: <Profile isYourProfile={false} />,
        },
        { path: "*", element: <Navigate to="/home" /> },
      ],
    },
  ];
};
// <ContainerCard title="asd">
//   <table style={{ width: '100%' }}>
//     <TableHeader metrics={['impres', 'impres', 'impres']}></TableHeader>
//     <TableRow imgSrc="" tableText="Lets talk form" metricValues={[1, 2, 3]}></TableRow>
//     <TableRow imgSrc="" tableText="Lets talk form" metricValues={[1, 2, 3]}></TableRow>
//     <TableRow imgSrc="" tableText="Lets talk form" metricValues={[1, 2, 3]}></TableRow>
//   </table>
// </ContainerCard>

export default PrivateRoutes;
