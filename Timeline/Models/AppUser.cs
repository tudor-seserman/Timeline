using Microsoft.AspNetCore.Identity;

namespace Timeline.Models;

public class AppUser:IdentityUser
{
    public List<UserTTimeline> UserTTimelines { get; set; } = new List<UserTTimeline>();
    public List<TTimeline> TTimelines { get; set; } = new List<TTimeline>();
    public List<AppUser> Friends { get; } = [];
}