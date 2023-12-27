namespace SocialAppServer.Test
{
    [TestFixture]
    internal class UserSuccessTest
    {
        int suffix;
        HttpClient client;

        [OneTimeSetUp]
        public void Initil()
        {
            Trace.Listeners.Add(new ConsoleTraceListener());
            Random rnd = new Random();
            suffix = rnd.Next();
            client = new HttpClient() { BaseAddress = new Uri("https://localhost:7049/api/User/") };
        }

        [Test, Order(1)]
        [TestCase(Description = "PostUser Test")]
        public void TestPost()
        {
            string postData =
                $"username=testUsername{suffix}&name=testName&surname=testSurname&password=password";

            using HttpResponseMessage response = client
                .PostAsync($"CreateUser?{postData}", null)
                .Result;

            if (!response.IsSuccessStatusCode)
                Assert.Fail();
        }

        [Test, Order(2)]
        [TestCase(Description = "GetUser Test")]
        public void TestGet()
        {
            using HttpResponseMessage response = client
                .GetAsync($"GetUser?username=testUsername{suffix}&password=password")
                .Result;
            if (!response.IsSuccessStatusCode)
                Assert.Fail();
        }

        [Test, Order(3)]
        [TestCase(Description = "UpdateUser Test")]
        public void TestUpdate()
        {
            string patchData =
                $"username=testUsername{suffix}&newUsername=newTestUsername{suffix}&name=newTestName&surname=newTestSurname";

            using HttpResponseMessage response = client
                .PatchAsync($"UpdateUser?{patchData}", null)
                .Result;
            if (!response.IsSuccessStatusCode)
                Assert.Fail();
        }

        [Test, Order(4)]
        [TestCase(Description = "DeleteUser Test")]
        public void TestDelete()
        {
            using HttpResponseMessage response = client
                .DeleteAsync($"DeleteUser?username=newTestUsername{suffix}")
                .Result;
            if (!response.IsSuccessStatusCode)
                Assert.Fail();
        }

        [OneTimeTearDown]
        public void TearDown() { }
    }
}
