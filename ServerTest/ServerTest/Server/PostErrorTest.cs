using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace APITest.Server
{
    [TestFixture]
    internal class PostErrorTest
    {
        int suffix;

        int postId;
        HttpClient client;
        string date;

        [OneTimeSetUp]
        public void SetUp()
        {
            //Trace.Listeners.Add(new ConsoleTraceListener());
            Random rnd = new Random();
            suffix = rnd.Next();
            date = DateTime.Now.ToString("yyyy-MM-dd");
            client = new HttpClient() { BaseAddress = new Uri("https://localhost:7049/api/User/") };

            string postData =
                $"username=testUsername{suffix}&name=testName&surname=testSurname&password=password";

            using HttpResponseMessage response = client
                .PostAsync($"CreateUser?{postData}", null)
                .Result;

            string message = ResponseContent.GetResponseMessage(response);

            if (!response.IsSuccessStatusCode)
                Assert.Fail($"Code: {response.StatusCode} - {message}");

            client = new HttpClient() { BaseAddress = new Uri("https://localhost:7049/api/Post/") };
        }

        [Test, Order(1)]
        [TestCase(Description = "CreatePost Test")]
        public void TestPost()
        {
            string postData = $"username=errorTestUsername{suffix}&text=testText&date={date}";

            using HttpResponseMessage response = client
                .PostAsync($"CreatePost?{postData}", null)
                .Result;

            string message = ResponseContent.GetResponseMessage(response);

            if (response.StatusCode != HttpStatusCode.NotFound)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
            else
            {
                Assert.That(message, Is.EqualTo("User has not been found"));
            }
        }

        [Test, Order(2)]
        [TestCase(Description = "GetPosts Test")]
        public void TestGet()
        {
            using HttpResponseMessage response = client
                .GetAsync($"GetPosts?username=errorTestUsername{suffix}")
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
        [TestCase(Description = "UpdatePost Test")]
        public void TestUpdate()
        {
            string patchData = $"username=errorTestUsername{suffix}&newText=newTestText";

            using HttpResponseMessage response = client
                .PatchAsync($"UpdatePost?{patchData}", null)
                .Result;

            string message = ResponseContent.GetResponseMessage(response);

            if (response.StatusCode != HttpStatusCode.NotFound)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
            else
            {
                Assert.That(
                    message,
                    Is.AnyOf(new[] { "User has not been found", "Post has not been found" })
                );
            }
        }

        [Test, Order(4)]
        [TestCase(Description = "DeletePost Test")]
        public void TestDelete()
        {
            using HttpResponseMessage response = client.DeleteAsync($"DeletePost?id={-1}").Result;

            string message = ResponseContent.GetResponseMessage(response);

            if (response.StatusCode != HttpStatusCode.NotFound)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
            else
            {
                Assert.That(message, Is.EqualTo("Post has not been found"));
            }
        }

        [OneTimeTearDown]
        public void TearDown()
        {
            client = new HttpClient() { BaseAddress = new Uri("https://localhost:7049/api/User/") };

            using HttpResponseMessage response = client
                .DeleteAsync($"DeleteUser?username=testUsername{suffix}")
                .Result;

            if (!response.IsSuccessStatusCode)
                Assert.Fail();
        }
    }
}
