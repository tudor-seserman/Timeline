using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Timeline.Models;

namespace Timeline.Helpers;

public class ApplicationDBContext : IdentityDbContext<AppUser>
{
    // protected readonly IConfiguration Configuration;

    public ApplicationDBContext(DbContextOptions dbContextOptions)
        :base(dbContextOptions)
    {
        
    }

    // protected override void OnConfiguring(DbContextOptionsBuilder options)
    // {
    //     // connect to postgres with connection string from app settings
    //     options.UseNpgsql(Configuration.GetConnectionString("TimelineContext"));
    // }

    public DbSet<TEvent> TEvents { get; set; }
}