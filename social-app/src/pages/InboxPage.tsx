import React, { FC, useContext, useEffect, useState } from "react";
import * as signalR from "@aspnet/signalr";

import {
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  TextField,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { userClient } from "../api";
import { UserContext } from "../App";

interface InboxPageProps {}

const users = ["username4", "username2", "username3"]; // Replace with your user data

const InboxPage: FC<InboxPageProps> = () => {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [connection, setConnection] = useState<signalR.HubConnection>();
  const { loggedUser } = useContext(UserContext);
  const getCurrentTime = () => {
    const nowDate = new Date();
    const nowTime = nowDate.toLocaleTimeString()
    return `${nowTime.slice(0,5)} ${nowTime.slice(8,11)}`;
    };

  // Example usage
  const currentTime = getCurrentTime();
  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    // Fetch messages for the selected user from your API or other data source
    // Update the 'messages' state accordingly
  };

  const handleSendMessage = (e: any) => {
    if (newMessage != "") {
      setMessages(prev => [...prev, { username: loggedUser.username, message:newMessage }]);
      setNewMessage("");
      //userClient.publishMessage(newMessage, loggedUser.username, selectedUser)
      //userClient.publishMessage(newMessage, "username1", "username2");

      connection
        ?.invoke("newMessage", loggedUser.username, newMessage)
        .then(() => console.log("Poslata Poruka"));
      
        
    }
  };

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7049/hub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();
    setConnection(connection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then((mess: any) => {
          connection.on(
            "messageReceived",
            (username: string, message: string) => {
              if(username !== loggedUser.username)
                setMessages(prev => [...prev, { username: username, message:message }]);
            }
          );

          connection.on(
            "messageNotification",
            (username: string) => {
              alert(`Korisnik ${username} je postlao poruku`)
            }
          );
        })
        .catch((err: any) => console.log(err));
    }
  }, [connection]);

  return (
    <Container
      sx={{
        display: "flex",
        marginTop: "100px",
        height: "85vh",
        overflow: "hidden",
      }}
    >
      <Grid container>
        {/* User List */}
        <Box sx={{ width: "20%" }}>
          <List>
            {users.map((user) => (
              <ListItem key={user} button onClick={() => handleUserClick(user)}>
                {user}
              </ListItem>
            ))}
          </List>
        </Box>
        {/* Message Container */}
        <Box
          sx={{
            width: "80%",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Chat with {selectedUser}
          </Typography>
          <Paper
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "column",
              flexGrow: 1,
              overflowY: "auto",
              padding: "12px",
            }}
          >
            {/* Render messages for the selected user */}
            {messages?.map((message: any, index) => (
              <Box
                display="flex"
                width={"100%"}
                sx={
                  message.username === loggedUser.username
                    ? { justifyContent: "flex-end" }
                    : { justifyContent: "flex-start" }
                }
                key={index}
              >
                <Paper
                  sx={{
                    width: "max-content",
                    padding: "8px 20px",
                    marginBottom: "10px"
                  }}
                >
                  <Typography variant="body1" color={"blue"} marginBottom="8px">
                    {message.username}
                  </Typography>
                  <Typography variant="body1" marginBottom={"24px"}>
                    {message.message}
                  </Typography>
                  <Typography variant="body2" textAlign={"right"}>
                    {currentTime}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Paper>
          <Box
            sx={{
              padding: "10px",
              borderTop: `1px solid darkgray`,
              display: "flex",
            }}
          >
            <TextField
              placeholder="Type a message..."
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage}
            />
            <Button
              size="large"
              color="primary"
              variant="contained"
              sx={{ marginLeft: "10px" }}
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Grid>
    </Container>
  );
};
export default InboxPage;
