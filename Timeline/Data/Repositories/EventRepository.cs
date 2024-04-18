using Timeline.Helpers.DTOs.Timeline;
using Timeline.Interfaces.Data;
using Timeline.Models;

namespace Timeline.Data.Repositories;

public class EventRepository: IEventRepository
{
    private readonly ApplicationDBContext _context;

    public EventRepository(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<TEvent?> UpdateAsync(int id, EditEventDTO editEventDto)
    {
        var tEvent = await _context.TEvents.FindAsync(id);

        if (tEvent == null)
        {
            return null;
            
        }

        tEvent.Name = editEventDto.Name;
        tEvent.Description = editEventDto.Description;
        tEvent.DateStarted = editEventDto.DateStarted;
        tEvent.DateFinished = editEventDto.DateFinished;
        
        await _context.SaveChangesAsync();
        
        return tEvent;
    }
}