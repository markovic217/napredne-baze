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
import { ApiException, UserClient } from "../api/ClientAPI";
import axios from "axios";
//import { postAuthProtected, postLoginGuest, postLoginUser } from "../AppAPI";
//import { UserContext } from "../App";

interface LoginComponentProps {}

const LoginComponent: FC<LoginComponentProps> = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { loggedUser, setLoggedUser } = useContext(UserContext);

  
  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleLoginClick = async () => {
    try {
      //console.log(username)
      let user = await userClient.getUser(username, password);
      setLoggedUser({
        isLogged: true,
        username: user.properties?.username,
        name: user.properties?.name,
        surname: user.properties?.surname,
      });
      console.log(user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("../home");
    } catch (e: any) {
      console.log(e.message);
    }

    //console.log(await userClient.getUser(username, password));
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

export default LoginComponent;
