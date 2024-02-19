using Microsoft.EntityFrameworkCore;
using Timeline.Models;

namespace Timeline.Helpers;

public class ApplicationDBContext:DbContext
{
    protected readonly IConfiguration Configuration;

    public ApplicationDBContext(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        // connect to postgres with connection string from app settings
        options.UseNpgsql(Configuration.GetConnectionString("TimelineContext"));
    }

    public DbSet<TEvent> TEvents { get; set; }
}