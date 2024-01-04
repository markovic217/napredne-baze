import styled from '@emotion/styled';
import { Box } from '@mui/material';
import React, { FC } from 'react';


const LayoutContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100vw",
  height: "100vh",
}));

export default LayoutContainer;
