import React, { FC, useContext, useEffect, useState } from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { postClient, userClient } from "../api";
import { UserContext } from "../App";
import PostMini from "../components/ui/PostMini";
import PostAdd from "../components/modals/PostAdd";
import FollowList from "../components/modals/FollowList";
import { UserEdit } from "../components/modals/UserEdit";

interface ProfileProps {
  isYourProfile: boolean;
}

const Profile: FC<ProfileProps> = ({ isYourProfile }) => {
  const navigate = useNavigate();
  const { loggedUser, setLoggedUser } = useContext(UserContext);
  const { username } = useParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [open, setOpen] = React.useState(false);
  const [followOpen, setFollowOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  const [isFollowers, setIsFollowers] = useState(false);
  const [postNum, setPostNum] = useState<number>(0);
  const [followerNum, setFollowerNum] = useState<number>(0);
  const [followsNum, setFollowsNum] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<number>(0);
  if (loggedUser.username === username) isYourProfile = true;
  useEffect(() => {
    const fetch = async () => {
      const usernameParam = isYourProfile ? loggedUser.username : username;
      const posts = await postClient.getPostByUser(usernameParam);
      const postNum = await postClient.getPostCount(usernameParam);
      const followerNum = await userClient.getFollowerCount(usernameParam);
      const followsNum = await userClient.getFollowsCount(usernameParam);
      const isFollowing = await userClient.getIsFollowing(
        loggedUser.username,
        usernameParam
      );
      setPosts(posts);
      setPostNum(postNum);
      setFollowerNum(followerNum);
      setFollowsNum(followsNum);
      setIsFollowing(isFollowing);
    };
    fetch();
  }, [open, username, postNum]);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        style={{ height: "100vh" }}
        marginTop={"100px"}
      >
        <Box minWidth={"600px"} marginBottom="40px">
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
                <Button
                  sx={{
                    marginLeft: "10px"
                  }}
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    setEditOpen(true);
                  }}
                >
                  Edit User
                </Button>
                <Button
                  sx={{
                    marginLeft: "10px"
                  }}
                  color ="error"
                  variant="contained"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete your profile?") === true) {
                      userClient.deleteUser(loggedUser.username)
                      setLoggedUser({ isLogged: false });
                      localStorage.removeItem("user");;
                      navigate("../login");
                      alert("User deleted!")
                    } 
                  }}
                >
                  Delete User
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
                      setIsFollowing(0);
                      setFollowerNum((prev) => prev - 1);
                    }}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    style={{ marginRight: "10px"}}
                    onClick={() => {
                      userClient.followUser(loggedUser.username, username);

                      setFollowerNum((prev) => prev + 1);
                      setIsFollowing(1);
                    }}
                  >
                    Follow
                  </Button>
                )}
                  <Button variant="contained" onClick={() => {
                    navigate('../inbox')
                }}>Message</Button>
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
              <Grid
                onClick={() => {
                  setIsFollowers(true);
                  setFollowOpen(true);
                }}
                item
                sx={{
                  cursor:"pointer"
                }}
              >
                <Typography variant="h6">Followers</Typography>
                <Typography variant="subtitle1">{followerNum}</Typography>
              </Grid>
              <Grid
                onClick={() => {
                  setIsFollowers(false);
                  setFollowOpen(true);
                }}
                item
                sx={{
                  cursor:"pointer"
                }}  
              >
                <Typography variant="h6">Following</Typography>
                <Typography variant="subtitle1">{followsNum}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
        <Box width="50vw">
          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <PostMini
                  dateCreated={post.properties.date}
                  description={post.properties.text}
                  postId={post.id}
                  handleDelete={() => {
                    setPostNum(prev=> prev-1)
                  }}
                  isYourProfile={isYourProfile}
                  //key={post.postId}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <PostAdd
        open={open}
        handleClose={() => {
          setOpen(false);
          setPostNum((prev) => prev + 1);
        }}
      />
      <FollowList
        username={isYourProfile ? loggedUser.username : username}
        isFollowers={isFollowers}
        open={followOpen}
        handleClose={() => {
          setFollowOpen(false);
        }}
      />
      <UserEdit
        open={editOpen}
        handleClose={() => {
          setEditOpen(false)
        }}
      />
    </>
  );
};

export default Profile;
