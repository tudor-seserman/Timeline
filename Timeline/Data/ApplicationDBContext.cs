using System.Configuration;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Timeline.Models;

namespace Timeline.Data;

public class ApplicationDBContext : IdentityDbContext<AppUser>
{
    public ApplicationDBContext(DbContextOptions dbContextOptions)
        :base(dbContextOptions)
    {
    }
    public DbSet<TEvent> TEvents { get; set; }
    public DbSet<TTimeline> TTimelines { get; set; }
    public DbSet<UserTTimeline> UserTTimelines { get; set; }

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
            .HasMany(e => e.Connections)
            .WithMany()
            .UsingEntity(
                "AppUserConnections",
                l => l.HasOne(typeof(AppUser)).WithMany().HasForeignKey("UserId")
                    .HasPrincipalKey(nameof(AppUser.Id)),
                r => r.HasOne(typeof(AppUser)).WithMany().HasForeignKey("ConnectionId")
                    .HasPrincipalKey(nameof(AppUser.Id)),
                j => j.HasKey("UserId", "ConnectionId"));
        
        builder.Entity<AppUser>()
            .HasMany(e => e.PendingConnections)
            .WithMany()
            .UsingEntity(
                "AppUserPendingConnections",
                l => l.HasOne(typeof(AppUser)).WithMany().HasForeignKey("UserId")
                    .HasPrincipalKey(nameof(AppUser.Id)),
                r => r.HasOne(typeof(AppUser)).WithMany().HasForeignKey("PendingConnectionId")
                    .HasPrincipalKey(nameof(AppUser.Id)),
                j => j.HasKey("UserId", "PendingConnectionId"));
    

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