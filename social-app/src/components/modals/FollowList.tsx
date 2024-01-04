import React, { FC, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { userClient } from "../../api";

interface FollowListProps {
  username: string;
  isFollowers: boolean;
  open: boolean;
  handleClose: () => void;
}

const FollowList: FC<FollowListProps> = ({
  username,
  isFollowers,
  open,
  handleClose,
}) => {
  const [follow, setFollow] = useState<any[]>([]);
  useEffect(() => {
    const fetch = async () => {
      let follow;
      if (isFollowers) follow = await userClient.getFollowers(username);
      else follow = await userClient.getFollows(username);
      follow = follow.map((item) => item.properties?.username);
      setFollow(follow);
    };
    fetch();
  }, [open]);
  return (
    <Dialog open={open} fullWidth={true}>
      <DialogContent>
        <DialogTitle>
          {isFollowers ? "User followers" : "User follows"}
        </DialogTitle>
        <List>
          {follow.map((item, index) => (
            <ListItem key={index}>
              <ListItemButton>
                <ListItemText primary={item} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions sx={{}} disableSpacing>
        <Button
          size="medium"
          color="warning"
          variant="contained"
          sx={{ marginRight: "10px" }}
          onClick={handleClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FollowList;
