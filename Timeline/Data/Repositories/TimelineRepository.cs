using Microsoft.EntityFrameworkCore;
using Timeline.Helpers.DTOs.Connections;
using Timeline.Helpers.DTOs.Timeline;
using Timeline.Helpers.Mappers;
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

    public async Task<List<TimelineDTO>> GetUserTTimelines(AppUser appUser)
    {
        return await _context.UserTTimelines.Where(u => u.AppUser == appUser).Select(ttimeline => ttimeline.ToTimelineDTOfromUserTimeline()).ToListAsync();
    }

    public async Task<List<TEvent>> GetTimelineEventsAsyncFromTimelineId(int id)
    {
        var timelineEvents = await _context.TTimelines.Where(t => t.Id == id)
            .SelectMany(ttimeline => ttimeline.Events)
            .Select(e => new TEvent()
                {
                    Id = e.Id,
                    Name = e.Name,
                    Description = e.Description,
                    DateStarted = e.DateStarted,
                    DateFinished = e.DateFinished,
                    DateCreated = e.DateCreated
                }
            ).ToListAsync();
        
        return timelineEvents;
    }

    public async Task<TTimeline> GetAsyncTTimelineById(int id)
    {
        var timeline = await _context.TTimelines.FirstOrDefaultAsync(t=>t.Id==id);
        if (timeline is null)
        {
            return null;
        }

        return timeline;
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

    public async Task<TTimeline?> UpdateAsync(int id, EditTimelineDTO editTimelineDto)
    {
        var tTimeline = await _context.TTimelines.FindAsync(id);

        if (tTimeline == null)
        {
            return null;
            
        }

        tTimeline.Name = editTimelineDto.Name;
        tTimeline.Description = editTimelineDto.Description;
        tTimeline.DateStarted = editTimelineDto.DateStarted;
        tTimeline.DateFinished = editTimelineDto.DateFinished;
        
        await _context.SaveChangesAsync();
        
        return tTimeline;
    }

    public async Task<TTimeline> AddConnectionAsync(int id, AppUser appUser)
    {
        var tTimeline = await _context.TTimelines.FindAsync(id);
        
        // Make sure user is not already in timeline
        var existing = await _context.UserTTimelines.Where(ut => ut.AppUserId == appUser.Id && ut.TTimelineId==tTimeline.Id).ToListAsync();
        if (existing.Count>0)
            throw new Exception("Connection is already part of the Timeline");
        
        await _context.UserTTimelines.AddAsync(new UserTTimeline()
        {
            AppUser = appUser,
            AppUserId = appUser.Id,
            TTimeline = tTimeline,
            TTimelineId = tTimeline.Id
        });
        
        await _context.SaveChangesAsync();
        return tTimeline;
    }
}