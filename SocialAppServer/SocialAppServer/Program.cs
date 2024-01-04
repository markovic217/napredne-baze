using System.Configuration;
using Microsoft.AspNet.SignalR;
using Microsoft.EntityFrameworkCore;
using Neo4j.Driver;
using SocialAppServer.Config;
using SocialAppServer.Hubs;

namespace SocialAppServer
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder
                .Services.AddSignalR()
                .AddStackExchangeRedis(builder.Configuration["RedisConnection"]);
            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddOpenApiDocument();

            builder.Services.AddDbContext<SocialAppDbContext>(opt => opt.UseSqlServer(""));
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var neo4jusername = builder.Configuration["Neo4j:Username"];
            var neo4jpassword = builder.Configuration["Neo4j:Password"];
            Neo4JDriver.driver = GraphDatabase.Driver(
                "bolt://localhost:7687",
                AuthTokens.Basic(neo4jusername, neo4jpassword)
            );
            RedisConnection.Connection = builder.Configuration["RedisConnection"];
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(
                    "SocialApp",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:3000", "http://localhost:3000/");
                        policy.AllowAnyMethod();
                        policy.AllowAnyHeader();
                        policy.AllowCredentials();
                    }
                );
            });

            var idProvider = new CustomUserIdProvider();

            /*GlobalHost.DependencyResolver.UseStackExchangeRedis(
                "localhost",
                6379,
                "Pass",
                "AppName"
            );*/

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                //                app.UseSwagger();
                app.UseOpenApi();

                app.UseSwaggerUi3();
            }

            app.UseCors("SocialApp");

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.MapHub<ChatHub>("/hub");

            app.Run();
        }
    }
}
