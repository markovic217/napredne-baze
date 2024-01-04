using Microsoft.AspNet.SignalR.Messaging;
using Microsoft.AspNetCore.SignalR;
using static ServiceStack.Diagnostics.Events;

namespace SocialAppServer.Hubs
{
    public class ChatHub : Hub
    {
        public async Task NewMessage(string username, string message)
        {
            await Clients.All.SendAsync("messageReceived", username, message);
            await Clients.All.SendAsync("messageNotification", username);
        }

        public async Task LikedPost(string usernameWhoLiked, string username) =>
            await Clients.All.SendAsync("likedPostNotification", usernameWhoLiked, username);
    }
}
