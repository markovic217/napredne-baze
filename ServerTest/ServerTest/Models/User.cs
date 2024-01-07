namespace SocialAppServer.Models
{
    public class UserProperties
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
    }

    public class User
    {
        public int Id { get; set; }
        public UserProperties Properties { get; set; }

        public override string ToString()
        {
            return $" Id: {Id}\n Username: {Properties.Username}\n Password: {Properties.Password}\n Surname: {Properties.Surname}\n Name: {Properties.Name}\n";
        }
    }
}
