using Timeline.Helpers.DTOs.Connections;
using Timeline.Models;

namespace Timeline.Helpers.DTOs.Timeline;

public class TimelineDTO
{
    public int Id { get; set; }
    public string Name { get;set; }
    public string Description { get;set; }
    public DateTime DateCreated { get;set; } 
    public DateTime DateStarted { get;set; }
    public DateTime DateFinished { get;set; }
    public List<TEvent> Events { get; set; } = new List<TEvent>();
    public List<ConnectionDTO> UserTTimelines { get; set; } = new List<ConnectionDTO>();
    public ConnectionDTO Creator { get; set; } = new ConnectionDTO();
}