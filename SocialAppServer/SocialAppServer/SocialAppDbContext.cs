using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

//using System.Data.Entity;

namespace SocialAppServer
{
    public class SocialAppDbContext : DbContext
    {
        //public DbSet<Product> Products { get; set; }

        public SocialAppDbContext(DbContextOptions<SocialAppDbContext> options)
            : base(options) { }
        //public DbSet<TodoItem> TodoItems { get; set; } = null!;
    }
}
