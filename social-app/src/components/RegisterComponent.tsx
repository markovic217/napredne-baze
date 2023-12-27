import React, { FC, useReducer, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

import { userClient } from "../api";

interface RegisterComponentProps {}

function reducer(state: any, action: any) {
  switch (action.type) {
    case "usernameTouched": {
      return {
        ...state,
        usernameTouched: true,
      };
    }
    case "usernameCorrect": {
      return {
        ...state,
        usernameCorrect: true,
      };
    }
    case "usernameIncorrect": {
      return {
        ...state,
        usernameCorrect: false,
      };
    }
    case "usernameBlur": {
      return {
        ...state,
        usernameFocus: false,
      };
    }
    case "usernameFocus": {
      return {
        ...state,
        usernameFocus: true,
      };
    }
    case "passwordTouched": {
      return {
        ...state,
        passwordTouched: true,
      };
    }
    case "passwordConfirm": {
      return {
        ...state,
        passwordConfirm: true,
      };
    }
    case "passwordConfirmFalse": {
      return {
        ...state,
        passwordConfirm: false,
      };
    }
    case "passwordCorrect": {
      return {
        ...state,
        passwordCorrect: true,
      };
    }
    case "passwordIncorrect": {
      return {
        ...state,
        passwordCorrect: false,
      };
    }
    case "confirmPasswordTouched": {
      return {
        ...state,
        confirmPasswordTouched: true,
      };
    }
  }
  throw Error("Unknown action: " + action.type);
}

const RegisterComponent: FC<RegisterComponentProps> = () => {
  const [formState, dispatch] = useReducer(reducer, {
    usernameTouched: false,
    usernameCorrect: false,
    usernameFocus: false,
    passwordCorrect: false,
    passwordFocus: false,
    passwordConfirm: false,
    passwordTouched: false,
    confirmPasswordTouched: false,
  });
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
    dispatch({ type: "usernameTouched" });
    if (event.target.value.length < 6 || event.target.value.length > 15)
      dispatch({ type: "usernameIncorrect" });
    else dispatch({ type: "usernameCorrect" });
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
    dispatch({ type: "passwordTouched" });
    if (event.target.value.length < 6) dispatch({ type: "passwordIncorrect" });
    else dispatch({ type: "passwordCorrect" });
  };

  const handleConfirmPasswordChange = (event: any) => {
    setConfirmPassword(event.target.value);
    dispatch({ type: "confirmPasswordTouched" });
    if (password === event.target.value) dispatch({ type: "passwordConfirm" });
    else dispatch({ type: "passwordConfirmFalse" });
  };

  const handleRegisterClick = async () => {
    try {
      let message = await userClient.createUser(username, name, surname, password);
      console.log(message)
      navigate("../login");
    }
    catch (e: any) {
      console.log(e)
    }
};

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
        }}
        onKeyDown={(e) => {
          //if (e.key === "Enter") handleRegisterClick(TipKorisnika.Korisnik);
        }}
      >
        <CardContent>
          <Typography textAlign="center" variant="h4">
            Register
          </Typography>
          <TextField
            error={
              !formState.usernameCorrect &&
              formState.usernameTouched &&
              !formState.usernameFocus
                ? true
                : false
            }
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={handleUsernameChange}
            onBlur={() => {
              dispatch({ type: "usernameBlur" });
            }}
            onFocus={() => {
              dispatch({ type: "usernameFocus" });
            }}
            helperText={
              !formState.usernameCorrect &&
              formState.usernameTouched &&
              !formState.usernameFocus
                ? "Username mora imati izmedju 6 i 15 karaktera"
                : ""
            }
            margin="normal"
          />
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            margin="normal"
          />
          <TextField
            label="Surname"
            variant="outlined"
            fullWidth
            value={surname}
            onChange={(e) => {
              setSurname(e.target.value);
            }}
            margin="normal"
          />
          <TextField
            error={
              !formState.passwordCorrect && formState.passwordTouched
                ? true
                : false
            }
            helperText={
              !formState.passwordCorrect && formState.passwordTouched
                ? "Lozinka mora imati vise od 6 karaktera"
                : ""
            }
            label="Password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={handlePasswordChange}
            type="password"
            margin="normal"
          />
          <TextField
            error={
              !formState.passwordConfirm &&
              formState.passwordTouched &&
              formState.confirmPasswordTouched
                ? true
                : false
            }
            helperText={
              !formState.passwordConfirm &&
              formState.passwordTouched &&
              formState.confirmPasswordTouched
                ? "Lozinke se moraju poklapati"
                : ""
            }
            label="Confirm password"
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            type="password"
            margin="normal"
          />
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            disabled={
              formState.usernameCorrect &&
              formState.passwordCorrect &&
              formState.passwordConfirm
                ? false
                : true
            }
            size="medium"
            color="secondary"
            variant="contained"
            onClick={() => {
              handleRegisterClick();
            }}
          >
            Register
          </Button>
          <Button
            size="medium"
            color="primary"
            variant="contained"
            onClick={() => {
              navigate("../login");
            }}
          >
            Back
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default RegisterComponent;
