import  { FC, useContext, useReducer, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { UserContext } from "../App";
import { postClient } from "../api";

interface PageAddProps {
  open: boolean;
  handleClose: () => void;
}

function reducer(state: any, action: any) {
  switch (action.type) {
    case "descriptionTouched": {
      return {
        ...state,
        descriptionTouched: true,
      };
    }
    case "descriptionCorrect": {
      return {
        ...state,
        descriptionCorrect: true,
      };
    }
    case "descriptionIncorrect": {
      return {
        ...state,
        descriptionCorrect: false,
      };
    }
  }
  throw Error("Unknown action: " + action.type);
}

const PageAdd: FC<PageAddProps> = ({ open, handleClose }) => {
  const [formState, dispatch] = useReducer(reducer, {
    descriptionCorrect: false,
    descriptionConfirm: false,
  });
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const { loggedUser } = useContext(UserContext);

  return (
    <Dialog open={open} fullWidth={true}>
      <DialogContent>
        <DialogTitle>Create post</DialogTitle>
        <TextField
          error={
            !formState.descriptionCorrect && formState.descriptionTouched
              ? true
              : false
          }
          helperText={
            !formState.descriptionCorrect && formState.descriptionTouched
              ? "Description mora imati vise od 5 karaktera"
              : ""
          }
          label="Post"
          variant="outlined"
          fullWidth
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (e.target.value.length < 6)
              dispatch({ type: "descriptionIncorrect" });
            else dispatch({ type: "descriptionCorrect" });
            dispatch({ type: "descriptionTouched" });
          }}
          multiline
          maxRows={5}
          sx={{ marginRight: "20px" }}
        />
        <Grid
          container
          rowSpacing={2}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          marginTop="15px"
        >
          {files.map((file, index) => {
            return (
              <Grid item xs={12} sm={6} key={index}>
                <Paper
                  elevation={3}
                  sx={{ padding: "8px", textAlign: "center" }}
                >
                  <Typography variant="body2">{file.name}</Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions sx={{}} disableSpacing>
        <Button
          disabled={formState.descriptionCorrect ? false : true}
          size="medium"
          color="primary"
          variant="contained"
          sx={{ marginRight: "10px" }}
          onClick={async () => {
            let todayDate = new Date();
            await postClient.createPost(
              loggedUser.username,
              description,
              todayDate
            );
            handleClose();
          }}
        >
          Post
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

export default PageAdd;
