using Microsoft.Build.Framework;

namespace Timeline.Helpers.DTOs.Timeline;

public class EditEventDTO
{
    [Required]
    public int Id { get; set; }
    [Required]
    public string Name { get;set; }
    public string Description { get;set; }
    public DateTime DateStarted { get;set; }
    public DateTime DateFinished { get;set; }
}