using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
//using ServiceStack;
//using SocialAppServer.Models;

namespace APITest.Web
{
    [Parallelizable(ParallelScope.Self)]
    [TestFixture]
    internal class PostTest : ContextTest
    {
        DateTime timeNow;

        IBrowserContext Context;

        public PostTest()
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
                        $"../../../Videos/Post/{timeNow.ToString("yyyy-MM-dd_HH_mm_ss")}",
                }
            );

            await Context.AddInitScriptAsync(
                @"((obj) => {
                  const storageObj = JSON.stringify(obj);
                  localStorage.setItem('user', storageObj);
                })({
                  id: 46,
                  properties: {
                    username: 'testusernamexyz123post',
                    name: 'testname',
                    surname: 'testsurname',
                    password: 'password',
                  },
                });"
            );
        }

        [Test]
        [TestCase]
        [Order(2)]
        public async Task TestAddPost()
        {
            var Page = await Context.NewPageAsync();
            var cookeis = await Context.CookiesAsync();

            await Page.GotoAsync("http://localhost:3000/home");
            await Page.Locator("div")
                .Filter(new() { Has = Page.Locator("a").GetByText("SocialApp") })
                .Locator("div")
                .Locator("button")
                .Locator("svg")
                .ClickAsync();

            await Page.Locator("ul")
                .Locator("li")
                .Filter(new() { HasText = "User: " })
                .ClickAsync();

            await Page.WaitForURLAsync("**/profile");

            await Page.Locator("button").GetByText("Add Post").ClickAsync();

            var modalLocator = Page.Locator("div")
                .Filter(new() { Has = Page.Locator("h2").GetByText("Create Post") });
            await modalLocator.GetByLabel("Post", new() { Exact = true }).FillAsync("TestPostName");

            await modalLocator.Locator("button").GetByText("Post").ClickAsync();
        }

        [Test]
        [TestCase]
        [Order(3)]
        public async Task TestEditPost()
        {
            var Page = await Context.NewPageAsync();

            await Page.GotoAsync("http://localhost:3000/profile");

            await Page.WaitForURLAsync("**/profile");

            await Page.Locator(".MuiBox-root")
                .Filter(new() { HasText = "TestPostName" })
                .Locator("button")
                .Locator("svg")
                .ClickAsync();

            await Page.Locator("ul").Locator("li").Filter(new() { HasText = "Edit" }).ClickAsync();

            var modalLocator = Page.Locator("div")
                .Filter(new() { Has = Page.Locator("h2").GetByText("Update Post") });
            await modalLocator
                .GetByLabel("Post", new() { Exact = true })
                .FillAsync("TestPostNameEdit");

            await modalLocator.Locator("button").GetByText("Edit").ClickAsync();
        }

        [Test]
        [TestCase]
        [Order(4)]
        public async Task TestDeletePost()
        {
            var Page = await Context.NewPageAsync();

            await Page.GotoAsync("http://localhost:3000/profile");

            await Page.WaitForURLAsync("**/profile");

            await Page.Locator(".MuiBox-root")
                .Filter(new() { HasText = "TestPostNameEdit" })
                .Locator("button")
                .Locator("svg")
                .ClickAsync();

            await Page.Locator("ul")
                .Locator("li")
                .Filter(new() { HasText = "Delete" })
                .ClickAsync();

            var modalLocator = Page.Locator("div")
                .Filter(
                    new()
                    {
                        Has = Page.Locator("h2")
                            .GetByText("Are you sure you want to delete comment?")
                    }
                );

            await modalLocator.Locator("button").GetByText("Delete").ClickAsync();

            await Page.WaitForTimeoutAsync(2000);

            await Page.GetByText("testusernamexyz123post").ClickAsync();

            await Page.WaitForTimeoutAsync(2000);
        }
    }
}
