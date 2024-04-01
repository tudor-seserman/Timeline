using Microsoft.EntityFrameworkCore;
using Timeline.Interfaces.Data;
using Timeline.Models;

namespace Timeline.Data.Repositories;

public class TimelineRepository : ITimelineRepository
{
    private readonly ApplicationDBContext _context;

    public TimelineRepository(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<List<TTimeline>> GetUserTTimelines(AppUser appUser)
    {
        return await _context.UserTTimelines.Where(u => u.AppUser == appUser).Select(ttimeline => new TTimeline()
        {
            Id = ttimeline.TTimelineId,
            Name = ttimeline.TTimeline.Name,
            Description = ttimeline.TTimeline.Description,
            DateCreated = ttimeline.TTimeline.DateCreated,
            DateStarted = ttimeline.TTimeline.DateStarted,
            DateFinished = ttimeline.TTimeline.DateFinished,
            UserTTimelines = ttimeline.TTimeline.UserTTimelines,
            Events = ttimeline.TTimeline.Events,
            Creator = ttimeline.TTimeline.Creator,

        }).ToListAsync();
    }

    public async Task<TTimeline> CreateAsyncTTimeline(TTimeline timeline)
    {
        await _context.TTimelines.AddAsync(timeline);
        await _context.UserTTimelines.AddAsync(new UserTTimeline()
        {
            AppUser = timeline.Creator,
            AppUserId = timeline.AppUserId,
            TTimeline = timeline,
            TTimelineId = timeline.Id
        });
        await _context.SaveChangesAsync();
        return timeline;
    }

    // public Task<TTimeline> DeleteTTimeline(TTimeline timeline)
    // {
    //     throw new NotImplementedException();
    // }
}