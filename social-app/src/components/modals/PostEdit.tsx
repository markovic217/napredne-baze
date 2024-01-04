import { FC, useContext, useReducer, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { UserContext } from "../../App";
import { postClient } from "../../api";

interface PostEditProps {
  post:string,
  postId: number
  open: boolean;
  handleClose: (post:string) => void;
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

const PostEdit: FC<PostEditProps> = ({post, postId, open, handleClose }) => {
  const [formState, dispatch] = useReducer(reducer, {
    descriptionCorrect: false,
    descriptionConfirm: false,
  });
  const [description, setDescription] = useState(post);
  const { loggedUser } = useContext(UserContext);

  return (
    <Dialog open={open} fullWidth={true}>
      <DialogContent>
        <DialogTitle>Update post</DialogTitle>
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
      </DialogContent>
      <DialogActions sx={{}} disableSpacing>
        <Button
          disabled={formState.descriptionCorrect ? false : true}
          size="medium"
          color="primary"
          variant="contained"
          sx={{ marginRight: "10px" }}
          onClick={async () => {
            await postClient.updatePost(
              loggedUser.username,
              postId,
              description
            );
            handleClose(description);
          }}
        >
          Edit
        </Button>
        <Button
          size="medium"
          color="warning"
          variant="contained"
          sx={{ marginRight: "10px" }}
          onClick={()=>handleClose(description)}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostEdit;

