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
using Timeline.Helpers.DTOs.Connections;
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
        private readonly IUserRepository _userRepository;


        public TimelineController(ApplicationDBContext context, UserManager<AppUser> userManager, ITimelineRepository timelineRepository, IUserRepository userRepository)
        {
            _context = context;
            _userManager = userManager;
            _timelineRepository = timelineRepository;
            _userRepository = userRepository;
        }
        

        // GET: api/Timeline
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TimelineDTO>>> GetTTimelines()
        {
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);
            if (appUser == null)
                return NotFound();
            
            return await _context.UserTTimelines.Where(u => u.AppUser == appUser).Select(ttimeline => new TimelineDTO()
            {
                Id = ttimeline.TTimelineId,
                Name = ttimeline.TTimeline.Name,
                Description = ttimeline.TTimeline.Description,
                DateCreated = ttimeline.TTimeline.DateCreated,
                DateStarted = ttimeline.TTimeline.DateStarted,
                DateFinished = ttimeline.TTimeline.DateFinished,
                UserTTimelines = ttimeline.TTimeline.UserTTimelines.Select(ut=> new ConnectionDTO() { Name = ut.AppUser.UserName ?? ""}).ToList(),
                Events = ttimeline.TTimeline.Events,
                Creator = new ConnectionDTO() { Name = ttimeline.TTimeline.Creator.UserName ?? ""},

            }).ToListAsync();
        
            // return await _timelineRepository.GetUserTTimelines(appUser);
        }

        // GET: api/Timeline/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<TimelineDTO>> GetTTimeline(int id)
        {
            // var tTimeline = await _context.TTimelines.FindAsync(id);
            var tTimeline = await _context.TTimelines.Where(t => t.Id == id).Select(ttimeline => new TimelineDTO()
            {
                Id = ttimeline.Id,
                Name = ttimeline.Name,
                Description = ttimeline.Description,
                DateCreated = ttimeline.DateCreated,
                DateStarted = ttimeline.DateStarted,
                DateFinished = ttimeline.DateFinished,
                UserTTimelines = ttimeline.UserTTimelines
                    .Select(ut => new ConnectionDTO() { Name = ut.AppUser.UserName ?? "" }).ToList(),
                Events = ttimeline.Events,
                Creator = new ConnectionDTO() { Name = ttimeline.Creator.UserName ?? "" },

            }).FirstOrDefaultAsync();
            
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
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTTimeline(int id, EditTimelineDTO editTimelineDto)
        {
            if (!TTimelineExists(id))
            {
                return NotFound();
            }
            
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);
            var tTimeline = await _context.TTimelines.FindAsync(id);

            if (id != editTimelineDto.Id)
            {
                return BadRequest();
            }

            if (appUser == tTimeline.Creator)
            {
                try
                {
                    var updateAsync = await _timelineRepository.UpdateAsync(id, editTimelineDto);
                    return Ok(updateAsync);
                    ;
                }
                catch (Exception e)
                {
                    return StatusCode(500, e);
                }
            }
            else
            {
                return BadRequest("Only the creator can edit timelines");
            }
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

        [Authorize]
        // DELETE: api/Timeline/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTTimeline(int id)
        {
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);
            var tTimeline = await _context.TTimelines.FindAsync(id);
            if (tTimeline == null)
            {
                return NotFound();
            }

            if (appUser == tTimeline.Creator)
            {
                _context.TTimelines.Remove(tTimeline);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            else
            {
                return BadRequest("Only the creator can delete timelines");
            }
        }
        
        // PUT: api/Timeline/5/addConnection
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}/addConnection")]
        public async Task<IActionResult> PutConnectionInTTimeline(int id, ConnectionDTO connectionDto)
        {
            if (!TTimelineExists(id))
            {
                return NotFound("Timeline not found!");
            }
            
            var username = User.GetUsername();
            
            if (username == connectionDto.Name)
                return BadRequest("You should already be in this Timeline!");
            
            var appUser = await _userManager.FindByNameAsync(username);
            var connectionUser = await _userManager.FindByNameAsync(connectionDto.Name);
            
            if (connectionUser == null)
            {
                return NotFound("Connection not found!");
            }
            
            if(!_userRepository.IsUserConnectedtoAnother(appUser,connectionUser))
                return BadRequest("You can only add Connections to your Timelines.");
            
            try
            {
                var updateAsync = await _timelineRepository.AddConnectionAsync(id, connectionUser);
                return Ok(updateAsync);;
            }
            catch (Exception e)
            {
               
                return StatusCode(500, e); 
            }
        }
        
        [Authorize]
        [HttpDelete("{id}/removeConnection")]
        public async Task<IActionResult> DeleteConnectionFromTTimeline(int id, ConnectionDTO connectionDto)
        {
            if (!TTimelineExists(id))
            {
                return NotFound("Timeline not found!");
            }

            var timeline = await _timelineRepository.GetAsyncTTimelineById(id);
            
            var username = User.GetUsername();
            
            var appUser = await _userManager.FindByNameAsync(username);
            
            var connectionUser = await _userManager.FindByNameAsync(connectionDto.Name);
            
            if (connectionUser == null)
            {
                return NotFound("Connection not found!");
            }

            if (appUser == timeline.Creator || appUser == connectionUser)
            {
                try
                {
                    var updateAsync = await _timelineRepository.RemoveConnectionAsync(id, connectionUser);
                    return Ok(updateAsync);
                    ;
                }
                catch (Exception e)
                {

                    return StatusCode(500, e);
                }
            }
            else
            {
                return BadRequest("Only the creator of the Timeline can remove other members."); 
            }
        }

        private bool TTimelineExists(int id)
        {
            return _context.TTimelines.Any(e => e.Id == id);
        }
    }
}
