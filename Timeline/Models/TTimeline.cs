using System.ComponentModel.DataAnnotations;

namespace Timeline.Models;

public class TTimeline
{
    public int Id { get; set; }
    public string Name { get;set; }
    public string Description { get;set; }
    public DateTime DateCreated { get;set; } 
    public DateTime DateStarted { get;set; }
    public DateTime DateFinished { get;set; }
    public List<TEvent> Events { get; set; } = new List<TEvent>();
    public List<UserTTimeline> UserTTimelines { get; set; } = new List<UserTTimeline>();
    public AppUser Creator { get; set; }
    public string AppUserId { get; set; }
}