using Timeline.Models;

namespace Timeline.Interfaces.Data;

public interface ITimelineRepository
{
    Task<List<TTimeline>> GetUserTTimelines(AppUser appUser);
    Task<TTimeline> GetTimelineEventsAsyncFromTimelineId(int id);
    Task<TTimeline> CreateAsyncTTimeline(TTimeline timeline);
    Task<TTimeline> GetAsyncTTimelineById(int id);
    
    // Task<TTimeline> DeleteTTimeline(TTimeline timeline);
}