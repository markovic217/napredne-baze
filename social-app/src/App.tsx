import React, { createContext, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.scss";
import { Router } from "./routes/Router";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext<any>(null);



const App = () => {
  const [loggedUser, setLoggedUser] = useState<any>({
    isLogged: false,
    username: "",
  });
  useEffect(() => {
    let user = localStorage.getItem("user");
    console.log(user);
    if (user) {
      let userTemp = JSON.parse(user);
      setLoggedUser({
        isLogged: true,
        username: userTemp.properties?.username,
        name: userTemp.properties?.name,
        surname: userTemp.properties?.surname,
      });
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ loggedUser: loggedUser, setLoggedUser: setLoggedUser }}
    >
      
        <Router isLogged={loggedUser.isLogged} />
      
    </UserContext.Provider>
  );
};
export default App;
