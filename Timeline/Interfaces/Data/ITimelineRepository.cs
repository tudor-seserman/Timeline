using Timeline.Helpers.DTOs.Connections;
using Timeline.Helpers.DTOs.Timeline;
using Timeline.Models;

namespace Timeline.Interfaces.Data;

public interface ITimelineRepository
{
    Task<List<TimelineDTO>> GetUserTTimelines(AppUser appUser);
    Task<List<TEvent>> GetTimelineEventsAsyncFromTimelineId(int id);
    Task<TTimeline> CreateAsyncTTimeline(TTimeline timeline);
    Task<TTimeline> GetAsyncTTimelineById(int id);
    Task<TTimeline?> UpdateAsync(int id, EditTimelineDTO editTimelineDTO);
    Task<TTimeline> AddConnectionAsync(int id, AppUser appUser);
    Task<TTimeline> RemoveConnectionAsync(int id, AppUser appUser);

    // Task<TTimeline> DeleteTTimeline(TTimeline timeline);
}