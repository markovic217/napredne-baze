import { FC, useContext, useReducer, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { userClient } from "../../api";
import { UserContext } from "../../App";

interface UserEditProps {
  open: boolean;
  handleClose: () => void;
}

export const UserEdit: FC<UserEditProps> = ({ open, handleClose }) => {
  const { loggedUser, setLoggedUser } = useContext(UserContext);
  const [username, setUsername] = useState(loggedUser.username);
  const [name, setName] = useState(loggedUser.name);
  const [surname, setSurname] = useState(loggedUser.surname);

  return (
    <Dialog open={open} fullWidth={true}>
      <DialogContent>
        <DialogTitle>Update user</DialogTitle>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          sx={{ marginBottom: "20px" }}
        />
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          sx={{ marginBottom: "20px" }}
        />
        <TextField
          label="Surname"
          variant="outlined"
          fullWidth
          value={surname}
          onChange={(e) => {
            setSurname(e.target.value);
          }}
          sx={{ marginRight: "20px" }}
        />
      </DialogContent>
      <DialogActions sx={{}} disableSpacing>
        <Button
          size="medium"
          color="primary"
          variant="contained"
          sx={{ marginRight: "10px" }}
          onClick={async () => {
            await userClient.updateUser(
              loggedUser.username,
              username,
              name,
              surname
            );
            setLoggedUser({
              ...loggedUser,
              username: username,
              name: name,
              surname: surname,
            });
            
            let user: any = localStorage.getItem("user") as string;
            user = JSON.parse(user);
            user.properties.username = username
            user.properties.name = name
            user.properties.surname = surname

            localStorage.setItem("user", JSON.stringify(user))

            handleClose();
          }}
        >
          Edit
        </Button>
        <Button
          size="medium"
          color="warning"
          variant="contained"
          sx={{ marginRight: "10px" }}
          onClick={handleClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
