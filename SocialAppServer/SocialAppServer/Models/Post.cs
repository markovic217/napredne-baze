namespace SocialAppServer.Models
{
    public class PostProperties
    {
        public string Text { get; set; }
        public string Date { get; set; }
    }

    public class Post
    {
        public int Id { get; set; }
        public PostProperties Properties { get; set; }

        public override string ToString()
        {
            return $" Id: {Id}\n Text: {Properties.Text}\n Date: {Properties.Date}\n";
        }
    }

    public class PostWithUser
    {
        public string Text { get; set; }
        public string Date { get; set; }
        public string Username { get; set; }
    }
}
