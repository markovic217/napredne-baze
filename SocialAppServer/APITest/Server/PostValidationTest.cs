using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace APITest.Server
{
    [TestFixture]
    internal class PostValidationTest
    {
        int suffix;
        int postId;
        HttpClient client;
        string date;

        [OneTimeSetUp]
        public void SetUp()
        {
            Trace.Listeners.Add(new ConsoleTraceListener());
            Random rnd = new Random();
            suffix = rnd.Next();
            date = DateTime.Now.ToString("yyyy-MM-dd");

            client = new HttpClient() { BaseAddress = new Uri("https://localhost:7049/api/Post/") };
        }

        [Test, Order(1)]
        [TestCase(Description = "CreatePost Test")]
        public void TestPost()
        {
            using HttpResponseMessage response = client.PostAsync($"CreatePost?", null).Result;

            string message = ResponseContent.GetResponseMessage(response);

            ResponseContent.ShowResponseContent(response);

            if (response.StatusCode != HttpStatusCode.BadRequest)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
        }

        [Test, Order(2)]
        [TestCase(Description = "GetPosts Test")]
        public void TestGet()
        {
            using HttpResponseMessage response = client.GetAsync($"GetPosts").Result;

            string message = ResponseContent.GetResponseMessage(response);

            ResponseContent.ShowResponseContent(response);

            if (response.StatusCode != HttpStatusCode.BadRequest)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
        }

        [Test, Order(3)]
        [TestCase(Description = "UpdatePost Test")]
        public void TestUpdate()
        {
            using HttpResponseMessage response = client.PatchAsync($"UpdatePost?", null).Result;

            string message = ResponseContent.GetResponseMessage(response);

            ResponseContent.ShowResponseContent(response);

            if (response.StatusCode != HttpStatusCode.BadRequest)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
        }

        [Test, Order(4)]
        [TestCase(Description = "DeletePost Test")]
        public void TestDelete()
        {
            using HttpResponseMessage response = client.DeleteAsync($"DeletePost?").Result;

            string message = ResponseContent.GetResponseMessage(response);

            if (response.StatusCode != HttpStatusCode.BadRequest)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
        }

        [OneTimeTearDown]
        public void TearDown() { }
    }
}
