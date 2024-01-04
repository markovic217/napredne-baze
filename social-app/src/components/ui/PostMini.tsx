import React, { FC, useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  CardActions,
  Menu,
  MenuItem,
} from "@mui/material";
import LikeButton from "./LikeButton";

import { UserContext } from "../../App";
import { postClient } from "../../api";
import PostDelete from "../modals/PostDelete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostEdit from "../modals/PostEdit";

interface PostMiniProps {
  postId: number;
  description: string;
  dateCreated: string;
  isYourProfile: boolean;
  handleDelete: () => void;
}

const PostMini: FC<PostMiniProps> = ({
  postId,
  description,
  dateCreated,
  isYourProfile,
  handleDelete,
}) => {
  const { loggedUser } = useContext(UserContext);
  const [post, setPost] = useState(description)
  const [openMenu, setOpenMenu] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  useEffect(
    () => {
      const fetch = async () => {
        const numOfLikes = await postClient.getNumberOfLikes(postId);
        setNumberOfLikes(numOfLikes);
      };
      fetch();
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [postId, loggedUser.id, openEdit, description]
  );

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleCloseEdit = (post:string) => {
    setOpenEdit(false);
    setPost(post)
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  const handleOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
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
          <IconButton
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
              setOpenMenu(true)
            }}
          >
            <MoreVertIcon color="disabled" fontSize="medium" />
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
            {post}
          </Typography>
        </CardContent>
        <CardActions>
          <Box>
            {isYourProfile ? (
              <Typography padding="10px">Likes: {numberOfLikes}</Typography>
            ) : (
              <LikeButton initialLikes={0} postId={postId} />
            )}
          </Box>
        </CardActions>
        <CardActions></CardActions>
      </Card>

      <PostDelete
        postId={postId}
        open={openDelete}
        handleClose={handleCloseDelete}
        handleDelete={handleDelete}
      />

      <PostEdit
        post={description}
        postId={postId}
        open={openEdit}
        handleClose={handleCloseEdit}
      />

      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
        <MenuItem onClick={handleOpenEdit}>Edit</MenuItem>

        <MenuItem onClick={handleOpenDelete}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default PostMini;
