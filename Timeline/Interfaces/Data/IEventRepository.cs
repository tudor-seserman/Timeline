using Timeline.Helpers.DTOs.Timeline;
using Timeline.Models;

namespace Timeline.Interfaces.Data;

public interface IEventRepository
{
    Task<TEvent?> UpdateAsync(int id, EditEventDTO editEventDto);
}