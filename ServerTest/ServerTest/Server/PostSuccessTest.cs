using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SocialAppServer.Models;

namespace APITest.Server
{
    [TestFixture]
    internal class PostSuccessTest
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
            date = DateTime.Now.ToString("yyyy-M-d");
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
            string postData = $"username=testUsername{suffix}&text=testText&date={date}";

            using HttpResponseMessage response = client
                .PostAsync($"CreatePost?{postData}", null)
                .Result;

            string message = ResponseContent.GetResponseMessage(response);

            if (!response.IsSuccessStatusCode)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
            else
            {
                Assert.That(message, Is.EqualTo("Post has been created successfully!"));
            }
        }

        [Test, Order(2)]
        [TestCase(Description = "GetPosts Test")]
        public void TestGet()
        {
            using HttpResponseMessage response = client
                .GetAsync($"GetPosts?username=testUsername{suffix}")
                .Result;

            var post = ResponseContent.GetResponseObject<Post[]>(response);
            postId = post[0].Id;

            string message = ResponseContent.GetResponseMessage(response);

            if (!response.IsSuccessStatusCode)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
            else
            {
                Assert.Multiple(() =>
                {
                    Assert.That(post[0].Properties.Text, Is.EqualTo($"testText"));

                    Assert.That(post[0].Properties.Date, Is.EqualTo($"{date}"));
                });
            }
        }

        [Test, Order(3)]
        [TestCase(Description = "UpdatePost Test")]
        public void TestUpdate()
        {
            string patchData = $"username=testUsername{suffix}&postId={postId}&newText=newTestText";

            using HttpResponseMessage response = client
                .PatchAsync($"UpdatePost?{patchData}", null)
                .Result;

            string message = ResponseContent.GetResponseMessage(response);

            if (!response.IsSuccessStatusCode)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
            else
            {
                Assert.That(message, Is.EqualTo("Post data has been updated"));
            }
        }

        [Test, Order(4)]
        [TestCase(Description = "DeletePost Test")]
        public void TestDelete()
        {
            using HttpResponseMessage response = client
                .DeleteAsync($"DeletePost?id={postId}")
                .Result;

            string message = ResponseContent.GetResponseMessage(response);

            if (!response.IsSuccessStatusCode)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
            else
            {
                Assert.That(message, Is.EqualTo("Post has been deleted!"));
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
