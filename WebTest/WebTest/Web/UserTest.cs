using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Playwright;
using Microsoft.VisualStudio.TestPlatform.ObjectModel;
//using ServiceStack;
//using SocialAppServer.Models;

namespace APITest.Web
{
    [Parallelizable(ParallelScope.Self)]
    [TestFixture]
    internal class UserTest : ContextTest
    {
        DateTime timeNow;

        IBrowserContext Context;

        public UserTest()
        {
            timeNow = DateTime.Now;
        }

        [Test]
        [TestCase]
        [Order(1)]
        public async Task TestSetUp()
        {
            Context = await Browser.NewContextAsync(
                new()
                {
                    IgnoreHTTPSErrors = true,
                    ViewportSize = new ViewportSize { Height = 1080, Width = 1920 },
                    RecordVideoSize = new() { Width = 1920, Height = 1080 },
                    RecordVideoDir =
                        $"../../../Videos/User/{timeNow.ToString("yyyy-MM-dd_HH_mm_ss")}",
                }
            );
        }

        [Test]
        [TestCase]
        //[Ignore("User registered")]
        [Order(2)]
        public async Task TestRegister()
        {
            var Page = await Context.NewPageAsync();

            Page.Dialog += (_, dialog) => dialog.AcceptAsync();

            await Page.GotoAsync("http://localhost:3000/login");

            await Page.GetByRole(AriaRole.Button).GetByText("Register").ClickAsync();

            await Page.GetByLabel("Username")
                //.FillAsync($"testUsername{suffix}{timeNow.ToString("MMddyyyy")}");
                .FillAsync($"testUsernameXYZ123");

            await Page.GetByLabel("Name", new() { Exact = true }).FillAsync("testName");

            await Page.GetByLabel("Surname").FillAsync("testSurname");

            await Page.GetByLabel("Password", new() { Exact = true }).FillAsync("Password");

            await Page.GetByLabel("Confirm Password").FillAsync("Password");

            await Page.GetByRole(AriaRole.Button).GetByText("Register").ClickAsync();

            await Page.WaitForURLAsync("**/login");
        }

        [Test]
        [TestCase]
        [Order(3)]
        public async Task TestLogin()
        {
            var Page = await Context.NewPageAsync();

            await Page.GotoAsync("http://localhost:3000/login");

            await Page.GetByLabel("Username")
                //.FillAsync($"testUsername{suffix}{timeNow.ToString("MMddyyyy")}");
                .FillAsync($"testUsernameXYZ123");

            await Page.GetByLabel("Password", new() { Exact = true }).FillAsync("Password");

            await Page.GetByRole(AriaRole.Button).GetByText("Login").ClickAsync();

            await Page.WaitForURLAsync("**/home");
        }

        [Test]
        [TestCase]
        [Order(4)]
        public async Task TestEditUser()
        {
            var Page = await Context.NewPageAsync();

            await Page.GotoAsync("http://localhost:3000/profile");

            await Page.WaitForURLAsync("**/profile");

            await Page.Locator("button").GetByText("Edit User").ClickAsync();

            var modalLocator = Page.Locator("div")
                .Filter(new() { Has = Page.Locator("h2").GetByText("Update user") });

            await modalLocator.GetByLabel("Username").FillAsync("testUsernameXYZ123Edit");

            await modalLocator.GetByLabel("Name", new() { Exact = true }).FillAsync("testNameEdit");

            await modalLocator.GetByLabel("Surname").FillAsync("testSurnameEdit");

            await modalLocator.Locator("button").GetByText("Edit").ClickAsync();

            await Page.WaitForTimeoutAsync(1000);
        }

        [Test]
        [TestCase]
        [Order(5)]
        public async Task TestDeleteUser()
        {
            var Page = await Context.NewPageAsync();

            Page.Dialog += (_, dialog) => dialog.AcceptAsync();

            await Page.GotoAsync("http://localhost:3000/profile");

            await Page.WaitForURLAsync("**/profile");

            await Page.Locator("button").GetByText("Delete User").ClickAsync();

            await Page.WaitForTimeoutAsync(2000);

            await Page.WaitForURLAsync("**/login");

            await Page.Locator("h4").GetByText("Login").ClickAsync();

            await Page.WaitForTimeoutAsync(2000);
        }
    }
}
