using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Timeline.Models;

namespace Timeline.Helpers;

public class ApplicationDBContext : IdentityDbContext<AppUser>
{

    public ApplicationDBContext(DbContextOptions dbContextOptions)
        :base(dbContextOptions)
    {
        
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        List<IdentityRole> roles = new List<IdentityRole>
        {
            new IdentityRole
            {
                Name = "Admin",
                NormalizedName = "ADMIN"
            },
            new IdentityRole
            {
                Name = "User",
                NormalizedName = "USER"
            },
        };

        builder.Entity<IdentityRole>().HasData(roles);
    }

    public DbSet<TEvent> TEvents { get; set; }
}