namespace Timeline.Models;

public class UserTTimeline
{
    public string AppUserId { get; set; }
    public AppUser AppUser { get; set; }
    public int TTimelineId { get; set; }
    public TTimeline TTimeline { get; set; }
}