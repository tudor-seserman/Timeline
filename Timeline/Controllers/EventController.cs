using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Timeline.Data;
using Timeline.Helpers.DTOs.Timeline;
using Timeline.Helpers.Mappers;
using Timeline.Interfaces.Data;
using Timeline.Models;

namespace Timeline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly ITimelineRepository _timelineRepository;
        private readonly IEventRepository _eventRepository;

        public EventController(ApplicationDBContext context,ITimelineRepository timelineRepository, IEventRepository eventRepository)
        {
            _context = context;
            _timelineRepository = timelineRepository;
            _eventRepository = eventRepository;
        }

        // GET: api/Event
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TEvent>>> GetTEvents()
        {
            return await _context.TEvents.ToListAsync();
        }

        // GET: api/Event/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<TEvent>> GetTEvent(int id)
        {
            var tEvent = await _context.TEvents.FindAsync(id);

            if (tEvent == null)
            {
                return NotFound();
            }

            return tEvent;
        }

        // PUT: api/Event/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTEvent(int id, EditEventDTO editEventDto)
        {
            if (id != editEventDto.Id)
            {
                return BadRequest();
            }

            try
            {
                var updateAsync = await _eventRepository.UpdateAsync(id, editEventDto);
                return Ok(updateAsync);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TEventExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Event
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<TEvent>> PostTEvent(CreateEventDTO createEvent)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            try
            {
                var eventTimeline = await _timelineRepository.GetAsyncTTimelineById(createEvent.TTimelineId);
                if (eventTimeline == null!)
                {
                    return StatusCode(500, "Cannot locate timeline");
                }

                TEvent newEvent = createEvent.toTEventFromAuthorizedCreateDTO(eventTimeline);
                _context.TEvents.Add(newEvent);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetTEvent", new { id = newEvent.Id }, newEvent);


            }catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        // DELETE: api/Event/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTEvent(int id)
        {
            var tEvent = await _context.TEvents.FindAsync(id);
            if (tEvent == null)
            {
                return NotFound();
            }

            _context.TEvents.Remove(tEvent);
           await _context.SaveChangesAsync();

            return Ok();
        }
        
        [Authorize]
        private bool TEventExists(int id)
        {
            return _context.TEvents.Any(e => e.Id == id);
        }
    }
}
