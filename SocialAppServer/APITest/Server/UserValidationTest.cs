using APITest;

namespace APITest.Server
{
    [TestFixture]
    internal class UserValidationTest
    {
        HttpClient client;

        [OneTimeSetUp]
        public void SetUp()
        {
            Trace.Listeners.Add(new ConsoleTraceListener());
            Random rnd = new Random();
            client = new HttpClient() { BaseAddress = new Uri("https://localhost:7049/api/User/") };
        }

        [Test, Order(1)]
        [TestCase(Description = "PostUser Test")]
        public void TestPost()
        {
            Trace.WriteLine("PostUser Test:");
            using HttpResponseMessage response = client.PostAsync($"CreateUser", null).Result;
            
            string message = ResponseContent.GetResponseMessage(response);
           
            ResponseContent.ShowResponseContent(response);

            if (response.StatusCode != HttpStatusCode.BadRequest)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
        }

        [Test, Order(2)]
        [TestCase(Description = "GetUser Test")]
        public void TestGet()
        {
            Trace.WriteLine("GetUser Test:");
            using HttpResponseMessage response = client.GetAsync($"GetUser").Result;

            string message = ResponseContent.GetResponseMessage(response);

            ResponseContent.ShowResponseContent(response);

            if (response.StatusCode != HttpStatusCode.BadRequest)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
        }

        [Test, Order(3)]
        [TestCase(Description = "UpdateUser Test")]
        public void TestUpdate()
        {
            Trace.WriteLine("UpdateUser Test:");
            using HttpResponseMessage response = client.PatchAsync($"UpdateUser", null).Result;

            string message = ResponseContent.GetResponseMessage(response);

            ResponseContent.ShowResponseContent(response);

            if (response.StatusCode != HttpStatusCode.BadRequest)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
        }

        [Test, Order(4)]
        [TestCase(Description = "DeleteUser Test")]
        public void TestDelete()
        {
            Trace.WriteLine("DeleteUser Test:");
            using HttpResponseMessage response = client.DeleteAsync($"DeleteUser").Result;

            string message = ResponseContent.GetResponseMessage(response);

            ResponseContent.ShowResponseContent(response);

            if (response.StatusCode != HttpStatusCode.BadRequest)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
        }

        [OneTimeTearDown]
        public void TearDown() { }
    }
}
