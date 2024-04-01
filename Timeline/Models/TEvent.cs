namespace Timeline.Models;

public class TEvent
{
    public int Id { get; set; }
    public DateTime DateTime { get; set; }
    public string Description { get; set; }
    public int TTimelineId { get; set; }
    
}