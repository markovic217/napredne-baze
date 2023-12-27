import { Box, IconButton, Typography } from "@mui/material";
import React, { FC, useContext, useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { UserContext } from "../App";
import { postClient } from "../api/index";

interface LikeButtonProps {
  commentId: number;
  initialLikes: number;
}

const LikeButton: FC<LikeButtonProps> = ({ commentId, initialLikes }) => {
  const { loggedUser } = useContext(UserContext);
  const [liked, setLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState<number>(initialLikes);
  useEffect(
    () => {
      const fetch = async () => {
        const liked = await postClient.getUserLiked(
          loggedUser.username,
          commentId
        );
        if (liked) setLiked(true);
        else setLiked(false);
        const numOfLikes = await postClient.getNumberOfLikes(commentId);
        setNumberOfLikes(numOfLikes);
      };
      fetch();
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [commentId, loggedUser.id]
  );

  return (
    <Box
      sx={{
        // position: "absolute",
        // left: "-100px",
        // height: "100%",
        // width: "100px",
        display: "flex",
        // flexDirection: "column",
        // justifyContent: "center",
        alignItems: "center",
      }}
    >
      {liked ? (
        <IconButton
          onClick={async () => {
            await postClient.unlikePost(loggedUser.username, commentId);
            setLiked(false);
            setNumberOfLikes(numberOfLikes - 1);
          }}
          // sx={{ marginBottom: "15px" }}
        >
          <FavoriteIcon fontSize="large" color="success" />
        </IconButton>
      ) : (
        <IconButton
          onClick={async () => {
            await postClient.likePost(loggedUser.username, commentId);
            setLiked(true);
            setNumberOfLikes(numberOfLikes + 1);
          }}
        >
          <FavoriteBorderIcon fontSize="large" color="disabled" />
        </IconButton>
      )}
      <Typography>Likes: {numberOfLikes}</Typography>
    </Box>
  );
};

export default LikeButton;
