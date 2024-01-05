namespace APITest.Server
{
    [TestFixture]
    internal class UserErrorTest
    {
        int suffix;
        HttpClient client;

        [OneTimeSetUp]
        public void SetUp()
        {
            Trace.Listeners.Add(new ConsoleTraceListener());
            Random rnd = new Random();
            suffix = rnd.Next();
            client = new HttpClient() { BaseAddress = new Uri("https://localhost:7049/api/User/") };

            string postData =
                $"username=errorTestUsername{suffix}&name=testName&surname=testSurname&password=password";

            using HttpResponseMessage response = client
                .PostAsync($"CreateUser?{postData}", null)
                .Result;
            if (!response.IsSuccessStatusCode)
                Assert.Fail();
        }

        [Test, Order(1)]
        [TestCase(Description = "PostUser Test")]
        public void TestPost()
        {
            string postData =
                $"username=errorTestUsername{suffix}&name=testName&surname=testSurname&password=password";

            using HttpResponseMessage response = client
                .PostAsync($"CreateUser?{postData}", null)
                .Result;

            string message = ResponseContent.GetResponseMessage(response);

            if (response.StatusCode != HttpStatusCode.Conflict)
            Assert.Fail($"Code: {response.StatusCode} - {message}");
  
        }

        [Test, Order(2)]
        [TestCase(Description = "GetUser Test")]
        public void TestGet()
        {
            using HttpResponseMessage response = client
                .GetAsync($"GetUser?username=notFoundUsername{suffix}&password=password")
                .Result;


            string message = ResponseContent.GetResponseMessage(response);

            if (response.StatusCode != HttpStatusCode.NotFound)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
            else
            {
                Assert.That(message, Is.EqualTo("User has not been found"));
            }
            
        }

        [Test, Order(3)]
        [TestCase(Description = "UpdateUser Test")]
        public void TestUpdate()
        {
            string patchData =
                $"username=notFoundUsername{suffix}&newUsername=notFoundUsername{suffix}&name=newTestName&surname=newTestSurname";

            using HttpResponseMessage response = client
                .PatchAsync($"UpdateUser?{patchData}", null)
                .Result;

            string message = ResponseContent.GetResponseMessage(response);

            if (response.StatusCode != HttpStatusCode.NotFound)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
            else
            {
                Assert.That(message, Is.EqualTo("User has not been found"));
            }
        }

        [Test, Order(4)]
        [TestCase(Description = "DeleteUser Test")]
        public void TestDelete()
        {
            using HttpResponseMessage response = client
                .DeleteAsync($"DeleteUser?username=notFoundUsername{suffix}")
                .Result;
            
            string message = ResponseContent.GetResponseMessage(response);

            if (response.StatusCode != HttpStatusCode.NotFound)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
            else
            {
                Assert.That(message, Is.EqualTo("User has not been found"));
            }
        }

        [OneTimeTearDown]
        public void TearDown()
        {
            using HttpResponseMessage response = client
                .DeleteAsync($"DeleteUser?username=errorTestUsername{suffix}")
                .Result;

            string message = ResponseContent.GetResponseMessage(response);

            if (response.StatusCode != HttpStatusCode.NotFound)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
            else
            {
                Assert.That(message, Is.EqualTo("User has been deleted successfully"));
            }

        }
    }
}
