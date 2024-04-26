using System.Configuration;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Timeline.Models;

namespace Timeline.Data;

public class ApplicationDBContext : IdentityDbContext<AppUser>
{
    // private readonly IConfiguration _configuration;
    public ApplicationDBContext(DbContextOptions dbContextOptions)
        :base(dbContextOptions)
    {
        // _configuration = configuration;
    }
    public DbSet<TEvent> TEvents { get; set; }
    public DbSet<TTimeline> TTimelines { get; set; }
    public DbSet<UserTTimeline> UserTTimelines { get; set; }
    
    // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    //     => optionsBuilder.UseNpgsql(_configuration.GetConnectionString("TimelineContext"));


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        builder.Entity<UserTTimeline>()
            .HasKey(ut => new { ut.AppUserId, ut.TTimelineId });

        builder.Entity<UserTTimeline>()
            .HasOne(ut => ut.AppUser)
            .WithMany(u => u.UserTTimelines)
            .HasForeignKey(ut => ut.AppUserId);

        builder.Entity<UserTTimeline>()
            .HasOne(ut => ut.TTimeline)
            .WithMany(t => t.UserTTimelines)
            .HasForeignKey(ut => ut.TTimelineId);
        
        builder.Entity<AppUser>()
            .HasMany(e => e.Friends)
            .WithMany();
    
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