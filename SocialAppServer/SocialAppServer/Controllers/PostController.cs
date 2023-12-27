using System.ComponentModel.DataAnnotations;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver;
using SocialAppServer.Models;

namespace SocialAppServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IDriver _driver;

        public PostController()
        {
            _driver = Neo4JDriver.driver;
        }

        [HttpGet]
        [Route("GetPosts")]
        public async Task<ActionResult<Post[]>> GetPostByUser(string username)
        {
            var records = new List<object>();
            var session = _driver.AsyncSession();

            IResultCursor results = await session.RunAsync(
                $"MATCH (user:User {{username: '{username}'}}) RETURN user LIMIT 1"
            );

            var resList = await results.ToListAsync();

            if (resList.Count == 0)
                return NotFound("User has not been found");

            results = await session.RunAsync(
                $"MATCH (u:User {{username: '{username}'}})-[rel:POSTED]->(post:Post) RETURN post"
            );
            while (await results.FetchAsync())
            {
                records.Add(results.Current.Values["post"]);
            }

            return Ok(records);
        }

        [HttpGet]
        [Route("GetNumberOfLikes")]
        public async Task<ActionResult<int>> GetNumberOfLikes(int id)
        {
            long numOfLikes = 0;
            var session = _driver.AsyncSession();
            IResultCursor results = await session.RunAsync(
                $"MATCH (u:User)-[rel:LIKED]->(post:Post) WHERE ID(post) = {id} RETURN COUNT(rel) as numOfLikes"
            );
            while (await results.FetchAsync())
            {
                numOfLikes = (long)results.Current.Values["numOfLikes"];
            }
            return Ok(numOfLikes);
        }

        [HttpGet]
        [Route("GetUserLiked")]
        public async Task<ActionResult<int>> GetUserLiked(string username, int id)
        {
            long numOfLikes = 0;
            var session = _driver.AsyncSession();
            IResultCursor results = await session.RunAsync(
                $"MATCH (u:User {{username: '{username}'}})-[rel:LIKED]->(post:Post) WHERE ID(post) = {id} RETURN COUNT(rel) as numOfLikes"
            );
            while (await results.FetchAsync())
            {
                numOfLikes = (long)results.Current.Values["numOfLikes"];
            }
            return Ok(numOfLikes);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<ActionResult<int>> GetPostCount(string username)
        {
            long numOfPosts = 0;
            var session = _driver.AsyncSession();
            IResultCursor results = await session.RunAsync(
                $"MATCH (u:User {{username: '{username}'}})-[rel:POSTED]->(post:Post) RETURN COUNT(post) as numOfPosts"
            );
            while (await results.FetchAsync())
            {
                numOfPosts = (long)results.Current.Values["numOfPosts"];
            }
            return Ok(numOfPosts);
        }

        [HttpGet]
        [Route("GetPostsFromFollowedUsers")]
        public async Task<ActionResult<PostWithUser[]>> GetPostsFromFollowedUsers(
            string username,
            int offset
        )
        {
            var records = new List<object>();
            var session = _driver.AsyncSession();
            IResultCursor results = await session.RunAsync(
                $"MATCH (u:User {{username: '{username}'}})-[relF:FOLLOWS]->(uf:User)-[relP:POSTED]->(post:Post) RETURN post.date as date, post.text as text, uf.username as username ORDER BY post.date DESC SKIP {offset} LIMIT 5 "
            );
            while (await results.FetchAsync())
            {
                records.Add(results.Current.Values);
            }
            return Ok(records);
        }

        [Route("[action]")]
        [HttpPost]
        public async Task<ActionResult<string>> CreatePost(
            string username,
            string text,
            DateTime date
        )
        {
            var statementText = new StringBuilder();
            statementText.Append(
                $"MATCH (u:User {{username: '{username}'}}) CREATE (p:Post {{text: '{text}', date: '{date.Year}-{date.Month}-{date.Day}'}}) CREATE (u)-[rel:POSTED]->(p) return u"
            );

            var session = _driver.AsyncSession();

            var result = await session.RunAsync((statementText.ToString()));

            var resList = await result.ToListAsync();

            if (resList.Count == 0)
                return NotFound("User has not been found");

            return Ok("Post has been created successfully!");
        }

        [Route("Like")]
        [HttpPost]
        public async Task<ActionResult<string>> LikePost(string username, int id)
        {
            var statementText = new StringBuilder();
            statementText.Append(
                $"MATCH (u:User {{username: '{username}'}}) MATCH (p: Post) WHERE ID(p) = {id} CREATE (u)-[rel:LIKED]->(p) "
            );

            var session = _driver.AsyncSession();
            var result = await session.ExecuteWriteAsync(
                tx => tx.RunAsync(statementText.ToString())
            );

            return Ok("User liked the post!");
        }

        [HttpPatch]
        [Route("[action]")]
        public async Task<ActionResult<string>> UpdatePost(
            string username,
            int postId,
            string newText
        )
        {
            var statementText = new StringBuilder();
            statementText.Append(
                $"MATCH (u:User {{username: '{username}'}})-[rel:POSTED]->(post:Post) WHERE ID(post) = {postId} "
                    + $"SET post.text = '{newText}' RETURN post"
            );

            var session = _driver.AsyncSession();

            IResultCursor results = await session.RunAsync(
                $"MATCH (user:User {{username: '{username}'}}) RETURN user LIMIT 1"
            );

            var resList = await results.ToListAsync();

            if (resList.Count == 0)
                return NotFound("User has not been found");

            var result = await session.RunAsync(statementText.ToString());

            resList = await result.ToListAsync();

            if (resList.Count == 0)
                return NotFound("Post has not been found");

            return Ok("Post data has been updated");
        }

        [HttpDelete]
        [Route("Unlike")]
        public async Task<ActionResult<string>> UnlikePost(string username, int id)
        {
            var statementText = new StringBuilder();
            statementText.Append(
                $"MATCH (p: Post) WHERE ID(p) = {id} MATCH (u:User {{username: '{username}'}})-[rel:LIKED]->(p) DELETE rel"
            );

            var session = _driver.AsyncSession();
            var result = await session.ExecuteWriteAsync(
                tx => tx.RunAsync(statementText.ToString())
            );

            return Ok("User unliked the post");
        }

        [HttpDelete]
        [Route("DeletePost")]
        public async Task<ActionResult<string>> DeletePost(int? id)
        {
            if (id == null)
                return BadRequest("Id field is empty");
            var statementText = new StringBuilder();
            statementText.Append($"MATCH (post:Post) WHERE ID(post) = {id} DETACH DELETE post");

            var session = _driver.AsyncSession();

            var results = await session.RunAsync(
                $"MATCH (post:Post) WHERE ID(post) = {id} RETURN post"
            );

            var resList = await results.ToListAsync();

            if (resList.Count == 0)
                return NotFound("User has not been found");

            results = await session.ExecuteWriteAsync(tx => tx.RunAsync(statementText.ToString()));

            return Ok("Post has been deleted!");
        }
    }
}
