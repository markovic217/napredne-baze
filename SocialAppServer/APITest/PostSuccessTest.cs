using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace APITest
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
            Trace.Listeners.Add(new ConsoleTraceListener());
            Random rnd = new Random();
            suffix = rnd.Next();
            date = DateTime.Now.ToString("yyyy-MM-dd");
            client = new HttpClient() { BaseAddress = new Uri("https://localhost:7049/api/User/") };

            string postData =
                $"username=testUsername{suffix}&name=testName&surname=testSurname&password=password";

            using HttpResponseMessage response = client
                .PostAsync($"CreateUser?{postData}", null)
                .Result;

            if (!response.IsSuccessStatusCode)
                Assert.Fail();

            client = new HttpClient() { BaseAddress = new Uri("https://localhost:7049/api/Post/") };
        }

        [Test, Order(1)]
        [TestCase(Description = "CreatePost Test")]
        public void TestPost()
        {
            Trace.WriteLine("TestPost:");

            string postData = $"username=testUsername{suffix}&text=testText&date={date}";

            using HttpResponseMessage response = client
                .PostAsync($"CreatePost?{postData}", null)
                .Result;

            if (!response.IsSuccessStatusCode)
                Assert.Fail();
        }

        [Test, Order(2)]
        [TestCase(Description = "GetPosts Test")]
        public void TestGet()
        {
            Trace.WriteLine("TestGet:");

            using HttpResponseMessage response = client
                .GetAsync($"GetPosts?username=testUsername{suffix}")
                .Result;

            var post = ResponseContent.GetPostObject(response);
            postId = post[0].Id;
            Trace.WriteLine(post[0].ToString());

            if (!response.IsSuccessStatusCode)
                Assert.Fail();
        }

        [Test, Order(3)]
        [TestCase(Description = "UpdatePost Test")]
        public void TestUpdate()
        {
            Trace.WriteLine("TestUpdate:");

            string patchData = $"username=testUsername{suffix}&postId={postId}&newText=newTestText";

            using HttpResponseMessage response = client
                .PatchAsync($"UpdatePost?{patchData}", null)
                .Result;

            if (!response.IsSuccessStatusCode)
                Assert.Fail();
        }

        [Test, Order(4)]
        [TestCase(Description = "DeletePost Test")]
        public void TestDelete()
        {
            Trace.WriteLine("TestDelete:");

            using HttpResponseMessage response = client
                .DeleteAsync($"DeletePost?id={postId}")
                .Result;

            if (!response.IsSuccessStatusCode)
                Assert.Fail();
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
