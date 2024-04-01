using Timeline.Models;

namespace Timeline.Interfaces.Data;

public interface ITimelineRepository
{
    Task<List<TTimeline>> GetUserTTimelines(AppUser appUser);
    Task<TTimeline> CreateAsyncTTimeline(TTimeline timeline);
    // Task<TTimeline> DeleteTTimeline(TTimeline timeline);
}