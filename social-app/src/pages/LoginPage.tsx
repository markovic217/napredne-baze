import React, { FC, useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { userClient } from "../api";
import { UserContext } from "../App";

//import { postAuthProtected, postLoginGuest, postLoginUser } from "../AppAPI";
//import { UserContext } from "../App";

interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { loggedUser, setLoggedUser } = useContext(UserContext);

  useEffect(() => {
    if (loggedUser.isLogged)
      navigate("../home")
  },[])

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleLoginClick = async () => {
    try {
      let user:any = await userClient.getUser(username, password);
      setLoggedUser({
        isLogged: true,
        username: user.properties?.username,
        name: user.properties?.name,
        surname: user.properties?.surname,
      });

      localStorage.setItem("user", JSON.stringify(user));
      navigate("../home");
    } catch (e: any) {
      alert(e.message);
    }

  };

  const handleRegisterClick = () => {
    navigate("../register");
  };

  return (
    <Card
      sx={{
        maxWidth: 600,
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleLoginClick();
      }}
    >
      <CardContent>
        <Typography textAlign="center" variant="h4">
          Login
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={handleUsernameChange}
          margin="normal"
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={handlePasswordChange}
          type="password"
          margin="normal"
        />
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          size="medium"
          color="primary"
          variant="contained"
          onClick={handleLoginClick}
        >
          Login
        </Button>
        <Button
          size="medium"
          color="secondary"
          variant="contained"
          onClick={handleRegisterClick}
        >
          Register
        </Button>
      </CardActions>
    </Card>
  );
};

export default LoginPage;
