using System.Configuration;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Timeline.Models;

namespace Timeline.Data;

public class ApplicationDBContext : IdentityDbContext<AppUser>
{
    private readonly IConfiguration _configuration;
    public ApplicationDBContext(DbContextOptions dbContextOptions,IConfiguration configuration)
        :base(dbContextOptions)
    {
        _configuration = configuration;
    }
    
    public DbSet<TEvent> TEvents { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql(_configuration.GetConnectionString("TimelineContext"));


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    
        List<IdentityRole> roles = new() 
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
}