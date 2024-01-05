using Microsoft.AspNetCore.Mvc;
using SocialAppServer.Models;

namespace APITest.Server
{
    [TestFixture]
    internal class UserSuccessTest
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

            string message = ResponseContent.GetResponseMessage(response);

            if (!response.IsSuccessStatusCode)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
            else
            {
                Assert.That(message, Is.EqualTo("Sign up successful"));
            }
        }

        [Test, Order(2)]
        [TestCase(Description = "GetUser Test")]
        public void TestGet()
        {
            using HttpResponseMessage response = client
                .GetAsync($"GetUser?username=testUsername{suffix}&password=password")
                .Result;

           

            if (!response.IsSuccessStatusCode)
                Assert.Fail($"Code: {response.StatusCode}");
            else
            {
                var user = ResponseContent.GetResponseObject<User>(response);


                Assert.Multiple(() =>
                {
                    Assert.That(user.Properties.Username, Is.EqualTo($"testUsername{suffix}"));

                    Assert.That(user.Properties.Name, Is.EqualTo($"testName"));

                    Assert.That(user.Properties.Surname, Is.EqualTo($"testSurname"));
                    
                    Assert.That(user.Properties.Password, Is.EqualTo($"password"));
                });
            }
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

            string message = ResponseContent.GetResponseMessage(response);

            if (!response.IsSuccessStatusCode)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
            else
            {
                Assert.That(message, Is.EqualTo("User data has been updated"));
            }
        }

        [Test, Order(4)]
        [TestCase(Description = "DeleteUser Test")]
        public void TestDelete()
        {
            using HttpResponseMessage response = client
                .DeleteAsync($"DeleteUser?username=newTestUsername{suffix}")
                .Result;
            string message = ResponseContent.GetResponseMessage(response);

            if (!response.IsSuccessStatusCode)
                Assert.Fail($"Code: {response.StatusCode} - {message}");
            else
            {
                Assert.That(message, Is.EqualTo("User has been deleted successfully"));
            }
        }

        [OneTimeTearDown]
        public void TearDown() { }
    }
}
