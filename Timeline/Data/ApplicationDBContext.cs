using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Timeline.Models;

namespace Timeline.Helpers;

public class ApplicationDBContext : IdentityDbContext<AppUser, IdentityRole, string>
{

    public ApplicationDBContext(DbContextOptions dbContextOptions)
        :base(dbContextOptions)
    {
        
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    
        var roleNames = new string[] { "Admin", "User" };
        foreach (var roleName in roleNames)
        {
            var role = new IdentityRole
            {
                Id = Guid.NewGuid().ToString(),
                Name = roleName,
                NormalizedName = roleName.ToUpperInvariant()
            };

            builder.Entity<IdentityRole>().HasData(role);
        }
    }

    public DbSet<TEvent> TEvents { get; set; }
}