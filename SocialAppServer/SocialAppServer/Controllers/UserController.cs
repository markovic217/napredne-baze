using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Net;
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
    public class UserController : ControllerBase
    {
        private readonly IDriver _driver;

        public UserController()
        {
            _driver = Neo4JDriver.driver;
        }

        [HttpGet]
        [Route("GetUser")]
        public async Task<ActionResult<User>> GetUser(string username, string password)
        {
            var records = new List<IRecord>();
            var session = _driver.AsyncSession();
            IResultCursor results = await session.RunAsync(
                $"MATCH (user:User {{username: '{username}', password: '{password}'}}) RETURN user LIMIT 1"
            );
            while (await results.FetchAsync())
            {
                records.Add(results.Current);
            }
            if (records.Count == 0)
                return NotFound("User has not been found");

            IRecord result = records[0];
            var user = result.Values["user"];
            return Ok(user);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<ActionResult<User[]>> SearchUsers(string username)
        {
            var records = new List<object>();
            var session = _driver.AsyncSession();
            IResultCursor results = await session.RunAsync(
                $"MATCH (user:User) WHERE user.username STARTS WITH '{username}' RETURN user LIMIT 10"
            );
            while (await results.FetchAsync())
            {
                records.Add(results.Current.Values["user"]);
            }
            return Ok(records);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<ActionResult<int>> GetFollowerCount(string username)
        {
            long numOfFollowers = 0;
            var session = _driver.AsyncSession();
            IResultCursor results = await session.RunAsync(
                $"MATCH (uf:User)-[rel:FOLLOWS]->(u:User {{username: '{username}'}}) RETURN COUNT(uf) as numOfFollowers"
            );
            while (await results.FetchAsync())
            {
                numOfFollowers = (long)results.Current.Values["numOfFollowers"];
            }
            return Ok(numOfFollowers);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<ActionResult<int>> GetFollowsCount(string username)
        {
            long numOfFollows = 0;
            var session = _driver.AsyncSession();
            IResultCursor results = await session.RunAsync(
                $"MATCH (uf:User)<-[rel:FOLLOWS]-(u:User {{username: '{username}'}}) RETURN COUNT(uf) as numOfFollows"
            );
            while (await results.FetchAsync())
            {
                numOfFollows = (long)results.Current.Values["numOfFollows"];
            }
            return Ok(numOfFollows);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<ActionResult<int>> GetIsFollowing(string username, string usernameFollow)
        {
            long numOfFollows = 0;
            var session = _driver.AsyncSession();
            IResultCursor results = await session.RunAsync(
                $"MATCH (u:User {{username: '{username}'}})-[rel:FOLLOWS]->(uf:User {{username: '{usernameFollow}'}}) RETURN COUNT(rel) as numOfFollows"
            );
            while (await results.FetchAsync())
            {
                numOfFollows = (long)results.Current.Values["numOfFollows"];
            }
            return Ok(numOfFollows);
        }

        [HttpPost]
        [Route("CreateUser")]
        public async Task<ActionResult<string>> CreateUser(
            string username,
            string name,
            string surname,
            string password
        )
        {
            var statementText = new StringBuilder();
            statementText.Append(
                $"CREATE (user:User {{username: '{username}', name: '{name}', surname: '{surname}', password: '{password}'}})"
            );
            try
            {
                var session = _driver.AsyncSession();

                var result = await session.ExecuteWriteAsync(
                    tx => tx.RunAsync(statementText.ToString())
                );

                return Ok("Sign up successful");
            }
            catch (Neo4jException e)
            {
                if (e.Code == "Neo.ClientError.Schema.ConstraintValidationFailed")
                    return Conflict(e.Message);
                return Problem(e.Message);
            }
        }

        [HttpPost]
        [Route("Follow")]
        public async Task<ActionResult<string>> FollowUser(string username, string usernameToFollow)
        {
            var statementText = new StringBuilder();
            statementText.Append(
                $"MATCH (u:User {{username: '{username}'}}) MATCH (uf: User {{username: '{usernameToFollow}'}}) CREATE (u)-[rel:FOLLOWS]->(uf) "
            );

            var session = _driver.AsyncSession();
            var result = await session.ExecuteWriteAsync(
                tx => tx.RunAsync(statementText.ToString())
            );

            return Ok($"User {username} now follows user {usernameToFollow}");
        }

        [HttpPatch]
        [Route("UpdateUser")]
        public async Task<ActionResult<string>> UpdateUser(
            string username,
            string newUsername,
            string name,
            string surname
        )
        {
            var statementText = new StringBuilder();
            statementText.Append(
                $"MATCH (u:User {{username: '{username}'}}) SET u.username = '{newUsername}' "
                    + $"SET u.name = '{name}' SET u.surname = '{surname}' RETURN u"
            );

            var session = _driver.AsyncSession();

            var result = await session.RunAsync(statementText.ToString());

            var resList = await result.ToListAsync();

            if (resList.Count == 0)
                return NotFound("User has not been found");

            return Ok("User data has been updated");
        }

        [HttpDelete]
        [Route("Unfollow")]
        public async Task<ActionResult<string>> UnfollowUser(
            string username,
            string usernameToUnfollow
        )
        {
            var statementText = new StringBuilder();
            statementText.Append(
                $"MATCH (u:User {{username: '{username}'}})-[rel:FOLLOWS]->(uf: User {{username: '{usernameToUnfollow}'}}) DELETE rel "
            );

            var session = _driver.AsyncSession();
            var result = await session.ExecuteWriteAsync(
                tx => tx.RunAsync(statementText.ToString())
            );

            return Ok($"User {username} unfollowed user {usernameToUnfollow}");
        }

        [HttpDelete]
        [Route("DeleteUser")]
        public async Task<ActionResult<string>> DeleteUser(string username)
        {
            var records = new List<IRecord>();
            var session = _driver.AsyncSession();
            IResultCursor results = await session.RunAsync(
                $"MATCH (user:User {{username: '{username}'}}) RETURN user LIMIT 1"
            );

            var resList = await results.ToListAsync();

            if (resList.Count == 0)
                return NotFound("User has not been found");

            var statementText = new StringBuilder();
            statementText.Append($"MATCH (u:User {{username: '{username}'}}) DETACH DELETE u");

            var result = await session.RunAsync(statementText.ToString());

            return Ok("User has been deleted successfully");
        }
    }
}
