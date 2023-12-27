import {
  Box,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import React, { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./../App";

import MenuIcon from "@mui/icons-material/Menu";
import { userClient } from "../api";

interface NavigationComponentProps {}
const NavigationComponent: FC<NavigationComponentProps> = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorText, setAnchorText] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const handleSearchChange = async (event: any) => {
    setSearch(event.target.value);
    setAnchorText(event.target.value ? event.currentTarget : null);
    console.log(event.target.value);
    try {
      const searchResultTemp = await userClient.searchUsers(
        event.target.value.toString()
      );
      setSearchResult(searchResultTemp);
      console.log(searchResultTemp);
    } catch (e) {
      console.log(e);
    }
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseText = (username: string) => {
    navigate(`../search-profile/${username}`);
    setAnchorText(null);
  };

  useEffect(() => {
    return () => {};
  }, []);
  const { loggedUser, setLoggedUser } = useContext(UserContext);
  return (
    <>
      <Box
        onClick={() => {
          setAnchorText(null);
        }}
        sx={{
          position: "fixed",
          width: "100vw",
          top: "0",
          zIndex: "2",
          backgroundColor: "white",
          borderBottom: "whitesmoke 1px solid",
        }}
      >
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px",
          }}
        >
          <Link
            variant="h5"
            underline="none"
            onClick={() => {
              navigate("/home");
            }}
          >
            SocialApp
          </Link>
          {loggedUser.isLogged && (<Box>
            <TextField
              label="Search"
              variant="outlined"
              value={search}
              onChange={handleSearchChange}
              margin="normal"
            />
            <Paper
              sx={{
                display: Boolean(anchorText) ? "block" : "none",
                position: "absolute",
                zIndex: 5,
                overflowY: "scroll",
                whiteSpace: "nowrap",
                maxHeight: "300px",
              }}
            >
              {searchResult?.map((user, index) => {
                return (
                  <MenuItem
                    onClick={() => {
                      handleCloseText(user.properties.username);
                    }}
                    sx={{ width: "100%" }}
                  >
                    {user.properties.username}
                  </MenuItem>
                );
              })}
            </Paper>
          </Box>)}
          <Box sx={{ display: "flex", position: "relative" }}>
            <Link
              variant="h6"
              underline="none"
              marginRight="20px"
              alignSelf={"center"}
              onClick={() => {
                navigate("/home");
              }}
            >
              Home
            </Link>
            {loggedUser?.isLogged ? (
              <IconButton
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <MenuIcon fontSize="medium"></MenuIcon>
              </IconButton>
            ) : (
              <Link
                variant="h6"
                underline="none"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </Link>
            )}
          </Box>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                navigate("/profile");
              }}
            >
              User: {loggedUser?.username}
            </MenuItem>

            <MenuItem
              onClick={() => {
                setLoggedUser({ isLogged: false });
                localStorage.removeItem("user");
                handleClose();
                navigate("../login");
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Container>
      </Box>
      <Box
        onClick={() => {
          setAnchorText(null);
        }}
        display={Boolean(anchorText) ? "block" : "none"}
        position="absolute"
        width="100vw"
        height="100vh"
      ></Box>
    </>
  );
};

export default NavigationComponent;
