using Timeline.Helpers.DTOs.Connections;
using Timeline.Helpers.DTOs.Timeline;
using Timeline.Models;

namespace Timeline.Helpers.Mappers;

public static class TimelineMapper
{
    public static TTimeline toTTimelineFromAuthorizedCreateDTO(this CreateTimelineDTO createTimelineDto, AppUser appUser)
    {
        return new TTimeline()
        {
            Name = createTimelineDto.Name,
            Description = createTimelineDto.Description,
            DateCreated = createTimelineDto.DateCreated,
            DateStarted = createTimelineDto.DateStarted,
            DateFinished = createTimelineDto.DateFinished,
            Creator = appUser,
            AppUserId = appUser.Id
        };
    }
    
    public static TEvent toTEventFromAuthorizedCreateDTO(this CreateEventDTO createEvent, TTimeline timeline)
    {
        return new TEvent()
        {
            DateCreated = createEvent.DateCreated,
            DateStarted = createEvent.DateStarted,
            DateFinished = createEvent.DateFinished,
            Description = createEvent.Description,
            Name = createEvent.Name,
            TTimelineId = createEvent.TTimelineId,
            TTimeline = timeline,
        };
    }

    public static TimelineDTO ToTimelineDTOfromUserTimeline(this UserTTimeline ttimeline)
    {
        return new TimelineDTO()
        {
            Id = ttimeline.TTimelineId,
            Name = ttimeline.TTimeline.Name ?? "",
            Description = ttimeline.TTimeline.Description ?? "",
            DateCreated = ttimeline.TTimeline.DateCreated,
            DateStarted = ttimeline.TTimeline.DateStarted,
            DateFinished = ttimeline.TTimeline.DateFinished,
            UserTTimelines = ttimeline.TTimeline.UserTTimelines.Select(ut=> new ConnectionDTO() { Name = ut.AppUser?.UserName ?? ""}).ToList(),
            Events = ttimeline.TTimeline.Events,
            Creator = new ConnectionDTO() { Name = ttimeline.TTimeline.Creator?.UserName ?? ""},
        };
 
    }
}