import React, { FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { postClient } from "../../api";

interface PostDeleteProps {
  postId: number;
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
}

const PostDelete: FC<PostDeleteProps> = ({
  postId,
  open,
  handleClose,
  handleDelete,
}) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Are you sure you want to delete comment?</DialogTitle>
    <DialogContent>
      <DialogContentText>
        You will completely remove comment and it's content
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={async () => {
          await postClient.deletePost(postId);
          handleClose();
          handleDelete();
        }}
        color="error"
        size="medium"
        variant="contained"
      >
        Delete
      </Button>
      <Button
        onClick={handleClose}
        size="medium"
        variant="contained"
      >
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);

export default PostDelete;
