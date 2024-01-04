import React, { createContext, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.scss";
import { Router } from "./routes/Router";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext<any>(null);



const App = () => {
  
  return <Router />;
};
export default App;
