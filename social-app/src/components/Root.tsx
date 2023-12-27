import { Outlet, useNavigate } from "react-router-dom";
import NavigationComponent from "./NavigationComponent";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { useContext, useEffect } from "react";
import { UserContext } from "../App";

export default function Root() {
  const Container = styled(Box)(() => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh",
  }));
  const navigate = useNavigate();
  const { loggedUser, setLoggedUser } = useContext(UserContext);
  useEffect(() => {
    if (loggedUser.isLogged) navigate("/home");
    else navigate("/login");
  }, [loggedUser.isLogged]);
  return (
    <>
      {/* all the other elements */}
      <NavigationComponent />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}
