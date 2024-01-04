using Microsoft.AspNet.SignalR;

namespace SocialAppServer.Hubs
{
    public class CustomUserIdProvider : IUserIdProvider
    {
        public string GetUserId(IRequest request)
        {
            // your logic to fetch a user identifier goes here.

            // for example:
            var userId = request.User.Identity.Name;
            return userId.ToString();
        }
    }
}
