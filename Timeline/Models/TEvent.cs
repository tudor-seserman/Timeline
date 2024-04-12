namespace Timeline.Models;

public class TEvent
{
    public int Id { get; set; }
    public string Name { get; set; } 
    public string Description { get; set; }
    public DateTime DateCreated { get;set; } 
    public DateTime DateStarted { get;set; }
    public DateTime DateFinished { get;set; }
    public int TTimelineId { get; set; }
    public TTimeline TTimeline { get; set; } = null!;

}