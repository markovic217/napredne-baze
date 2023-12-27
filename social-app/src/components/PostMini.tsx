import React, { FC, useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  CardActions,
} from "@mui/material";
import LikeCommentComponent from "./LikeCommentComponent";
import ClearIcon from "@mui/icons-material/Clear";
import { UserContext } from "../App";
import { postClient } from "../api";

interface PostMiniProps {
  commentId: number;
  description: string;
  dateCreated: string;
  isYourProfile: boolean;
  handleDelete: () => void;
}

const PostMini: FC<PostMiniProps> = ({
  commentId,
  description,
  dateCreated,
  isYourProfile,
  handleDelete,
}) => {
  const { loggedUser } = useContext(UserContext);
  const [open, setOpen] = React.useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState<number>(0);
  const [, refetch] = useState<number>(1);
  useEffect(
    () => {
      const fetch = async () => {
        const numOfLikes = await postClient.getNumberOfLikes(commentId);
        setNumberOfLikes(numOfLikes);
      };
      fetch();
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [commentId, loggedUser.id]
  );
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box marginBottom="20px" position={"relative"} width={"100%"}>
      {isYourProfile ? (
        <Box
          sx={{
            position: "absolute",
            right: "0px",
            top: "0px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton onClick={handleClickOpen}>
            <ClearIcon color="disabled" fontSize="medium" />
          </IconButton>
        </Box>
      ) : (
        <></>
      )}

      <Card>
        <CardContent>
          <Typography variant="subtitle2" marginBottom={"20px"}>
            {dateCreated}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {description}
          </Typography>
        </CardContent>
        <CardActions>
          <Box>
            {isYourProfile ? (
              <Typography padding="10px">Likes: {numberOfLikes}</Typography>
            ) : (
              <LikeCommentComponent initialLikes={0} commentId={commentId} />
            )}
          </Box>
        </CardActions>
        <CardActions></CardActions>
      </Card>

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
              await postClient.deletePost(commentId);
              refetch(0);
              handleClose();
              handleDelete();
            }}
            color="error"
          >
            Delete
          </Button>
          <Button onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostMini;
