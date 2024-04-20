using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Timeline.Data;
using Timeline.Data.Repositories;
using Timeline.Helpers.DTOs.Timeline;
using Timeline.Helpers.Extensions;
using Timeline.Helpers.Mappers;
using Timeline.Interfaces.Data;
using Timeline.Models;


namespace Timeline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimelineController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly ITimelineRepository _timelineRepository;

        public TimelineController(ApplicationDBContext context, UserManager<AppUser> userManager, ITimelineRepository timelineRepository)
        {
            _context = context;
            _userManager = userManager;
            _timelineRepository = timelineRepository;
        }
        

        // GET: api/Timeline
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TTimeline>>> GetTTimelines()
        {
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);
        
            return await _timelineRepository.GetUserTTimelines(appUser);
        }

        // GET: api/Timeline/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TTimeline>> GetTTimeline(int id)
        {
            var tTimeline = await _context.TTimelines.FindAsync(id);

            if (tTimeline == null)
            {
                return NotFound();
            }

            return tTimeline;
        }
        
        // GET: api/Timeline/Events/5
        [Authorize]
        [HttpGet("Events/{id}")]
        public async Task<ActionResult<List<TEvent>>> GetTTimelineEvents(int id)
        {
            var tTimeline = await _timelineRepository.GetTimelineEventsAsyncFromTimelineId(id);
            
            if (tTimeline.IsNullOrEmpty())
            {
                return NotFound();
            }
            

            return tTimeline;
        }

        // PUT: api/Timeline/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTTimeline(int id, EditTimelineDTO editTimelineDto)
        {
            if (id != editTimelineDto.Id)
            {
                return BadRequest();
            }
            
            try
            {
                var updateAsync = await _timelineRepository.UpdateAsync(id, editTimelineDto);
                return Ok(updateAsync);;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TTimelineExists(id))
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
        
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<TTimeline>> PostTTimeline([FromBody]CreateTimelineDTO CreateTimelineDTO)
        {
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var newTimeline = CreateTimelineDTO.toTTimelineFromAuthorizedCreateDTO(appUser);
                await _timelineRepository.CreateAsyncTTimeline(newTimeline);
                
                return CreatedAtAction("GetTTimeline", new { id = newTimeline.Id }, newTimeline);
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        // DELETE: api/Timeline/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTTimeline(int id)
        {
            var tTimeline = await _context.TTimelines.FindAsync(id);
            if (tTimeline == null)
            {
                return NotFound();
            }

            _context.TTimelines.Remove(tTimeline);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TTimelineExists(int id)
        {
            return _context.TTimelines.Any(e => e.Id == id);
        }
    }
}
