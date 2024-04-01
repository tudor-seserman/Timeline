using Microsoft.Build.Framework;

namespace Timeline.Helpers.DTOs.Timeline;

public class CreateTimelineDTO
{
    [Required]
    public string Name { get;set; }
    public string Description { get;set; }
    public DateTime DateCreated { get;set; } 
    public DateTime DateStarted { get;set; }
    public DateTime DateFinished { get;set; }
}