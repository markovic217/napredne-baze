import { Box, IconButton, Typography } from "@mui/material";
import React, { FC, useContext, useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { UserContext } from "../../App";
import { postClient } from "../../api/index";

interface LikeButtonProps {
  postId: number;
  initialLikes: number;
}

const LikeButton: FC<LikeButtonProps> = ({ postId, initialLikes }) => {
  const { loggedUser } = useContext(UserContext);
  const [liked, setLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState<number>(initialLikes);
  useEffect(
    () => {
      const fetch = async () => {
        const liked = await postClient.getUserLiked(
          loggedUser.username,
          postId
        );
        if (liked) setLiked(true);
        else setLiked(false);
        const numOfLikes = await postClient.getNumberOfLikes(postId);
        setNumberOfLikes(numOfLikes);
      };
      fetch();
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [postId, loggedUser.id]
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {liked ? (
        <IconButton
          onClick={async () => {
            await postClient.unlikePost(loggedUser.username, postId);
            setLiked(false);
            setNumberOfLikes(prev => prev - 1);
          }}
          // sx={{ marginBottom: "15px" }}
        >
          <FavoriteIcon fontSize="large" color="success" />
        </IconButton>
      ) : (
        <IconButton
            onClick={async () => {
              console.log(postId)
            await postClient.likePost(loggedUser.username, postId);
            setLiked(true);
              setNumberOfLikes(prev => prev + 1);
              console.log('Liked')

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
