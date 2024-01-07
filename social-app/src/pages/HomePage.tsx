import React, { FC, useContext, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { UserContext } from "../App";
import { postClient } from "../api";
import PostCard from "../components/ui/PostCard";

interface HomePage {}

const HomePage: FC<HomePage> = () => {
  const [posts, setPosts] = useState<any[]>([]);

  const [sort] = useState("Likes");
  const [offset, setOffset] = useState(0);
  const { loggedUser } = useContext(UserContext);

  const [morePosts, setMorePosts] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const postsTemp = await postClient.getPostsFromFollowedUsers(
        loggedUser.username,
        offset
      );
      
      if (postsTemp.length <= offset) setMorePosts(false);
      setPosts((prev) => [...prev, ...postsTemp]);
      console.log(postsTemp)
    };
    fetch();
    
  }, [sort, offset, loggedUser]);

  return (
    <Box
      sx={{
        width: {
          xs: 300,
          sm: 550,
          md: 700,
        },
        margin: "auto",
        marginTop: "150px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {posts.map((post) => (
        <PostCard
          dateCreated={post.date}
          description={post.text}
          userAnswered={post.username}
          postId={post.id}
          key={post.id}
        />
      ))
}
      {morePosts && (
        <Button
          onClick={() => {
            setOffset((prev) => prev + 5);
          }}
          color="error"
        >
          Load More
        </Button>
      )}
    </Box>
  );
};

export default HomePage;
