import React, { FC, useContext, useEffect, useState } from "react";
import { Avatar, Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { postClient, userClient } from "../api";
import { UserContext } from "../App";
import PageCard from "./PageCard";
import PostMini from "./PostMini";
import PageAdd from "./PageAdd";

interface ProfileProps {
  isYourProfile: boolean;
}

const Profile: FC<ProfileProps> = ({ isYourProfile }) => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [numberArray, setNumberArray] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [sort, setSort] = useState("Likes");
  const [open, setOpen] = React.useState(false);
  const [_, refetch] = useState<number>(1);
  const [postNum, setPostNum] = useState<number>(0);
  const [followerNum, setFollowerNum] = useState<number>(0);
  const [followsNum, setFollowsNum] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<number>(0);
  const { loggedUser } = useContext(UserContext);
  if (loggedUser.username === username) isYourProfile = true;
  useEffect(() => {
    const fetch = async () => {
      const usernameParam = isYourProfile ? loggedUser.username : username;
      const postsTemp = await postClient.getPostByUser(usernameParam);
      const postNumTemp = await postClient.getPostCount(usernameParam);
      const followerNumTemp = await userClient.getFollowerCount(usernameParam);
      const followsNumTemp = await userClient.getFollowsCount(usernameParam);
      const isFollowingTemp = await userClient.getIsFollowing(
        loggedUser.username,
        usernameParam
      );
      setPosts(postsTemp);
      setPostNum(postNumTemp);
      setFollowerNum(followerNumTemp);
      setFollowsNum(followsNumTemp);
      setIsFollowing(isFollowingTemp);
    };
    fetch();
  }, [sort, open, _]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        style={{ height: "100vh" }}
        marginTop="250px"
      >
        <Box width="100%" marginBottom="40px">
          <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h5" style={{ margin: "10px 0" }}>
              {isYourProfile ? loggedUser.username : username}
            </Typography>
            {isYourProfile ? (
              <>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Add Post
                </Button>
              </>
            ) : (
              <>
                {isFollowing ? (
                  <Button
                    variant="contained"
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      userClient.unfollowUser(loggedUser.username, username);
                      refetch((prev) => prev + 1);
                    }}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      userClient.followUser(loggedUser.username, username);
                      refetch((prev) => prev + 1);
                    }}
                  >
                    Follow
                  </Button>
                )}
                <Button variant="contained">Message</Button>
              </>
            )}
            <Grid
              container
              justifyContent="space-around"
              style={{ marginTop: "20px" }}
            >
              <Grid item>
                <Typography variant="h6">Posts</Typography>
                <Typography variant="subtitle1">{postNum}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">Followers</Typography>
                <Typography variant="subtitle1">{followerNum}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">Following</Typography>
                <Typography variant="subtitle1">{followsNum}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
        <Box width="50vw">
          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.commentId}>
                <PostMini
                  dateCreated={post.properties.date}
                  description={post.properties.text}
                  commentId={post.id}
                  handleDelete={() => {
                    refetch((prev) => prev + 1);
                  }}
                  isYourProfile={isYourProfile}
                  key={post.id}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <PageAdd
        open={open}
        handleClose={() => {
          setOpen(false);
          refetch((prev) => prev + 1);
        }}
      />
    </>
  );
};

export default Profile;
