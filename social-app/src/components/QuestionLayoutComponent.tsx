import React, { FC, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionCardComponent from "./QuestionCardComponent";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Link,
  NativeSelect,
  TextField,
  Typography,
} from "@mui/material";
import { UserContext } from "../App";
import { postClient } from "../api";
import PageCard from "./PageCard";

interface QuestionsComponentProps {}

const QuestionsComponent: FC<QuestionsComponentProps> = () => {
  const navigate = useNavigate();
  const [numberArray, setNumberArray] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const { kurs, kursId } = useParams();
  const [sort, setSort] = useState("Likes");
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

      console.log(postsTemp);
    };
    fetch();
  }, [sort, offset]);

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
        <PageCard
          dateCreated={post.date}
          description={post.text}
          userAnswered={post.username}
          commentId={post.id}
          userId={0}
          handleDelete={() => {}}
          key={post.id}
        />
      ))}
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

export default QuestionsComponent;
