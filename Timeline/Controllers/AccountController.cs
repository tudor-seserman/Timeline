using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Timeline.Helpers.DTOs;
using Timeline.Helpers.DTOs.Account;
using Timeline.Interfaces;
using Timeline.Models;
using Timeline.Data;
using Microsoft.EntityFrameworkCore;
using Timeline.Data.Repositories;
using Timeline.Helpers.DTOs.Connections;
using Timeline.Helpers.Extensions;
using Timeline.Helpers.Mappers;
using Timeline.Interfaces.Data;

namespace Timeline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IUserRepository _userRepository;
        private readonly ApplicationDBContext _context;
        
        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, SignInManager<AppUser> signInManager,IUserRepository userRepository,ApplicationDBContext context)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userRepository = userRepository;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO loginDto)
        {
            
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == loginDto.Username);
                if (user == null) return Unauthorized("Invalid Username!");
                var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
                
                if(!result.Succeeded) return Unauthorized("Invalid Username and/or Password!");

                return Ok(
                    new NewUserDTO
                    {
                        Username = user.UserName,
                        Email = user.Email,
                        Token = _tokenService.CreateToken(user)
                    });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var appUser = new AppUser
                {
                    UserName = registerDto.Username,
                    Email = registerDto.Email,
                };

                var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);

                if (createdUser.Succeeded)
                {
                    var roleResult = await _userManager.AddToRoleAsync(appUser, "User");
                    if (roleResult.Succeeded)
                    {
                        return Ok(new NewUserDTO()
                        {                            
                            Username = appUser.UserName,
                            Email = appUser.Email,
                            Token = _tokenService.CreateToken(appUser)
                        });
                    }
                    else
                    {
                        return StatusCode(500, roleResult.Errors);
                    }
                    
                }
                else
                {
                    return StatusCode(500, createdUser.Errors);
                }
                
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }
        
        [Authorize]
        [HttpGet("connections")]
        public async Task<ActionResult<List<ConnectionDTO>>> GetConnections()
        {
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);
            var connections = await _userRepository.GetAllConnectionsAsync(appUser);
            
            return connections;
        }
        
        [Authorize]
        [HttpGet("pendingConnections")]
        public async Task<ActionResult<List<ConnectionDTO>>> GetPendingConnections()
        {
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);
            var connections = await _userRepository.GetAllPendingConnectionsAsync(appUser);
            
            return connections;
        }
        
        [Authorize]
        [HttpPost("requestConnection")]
        public async Task<ActionResult<AppUser>> AddPendingConnection([FromBody]ConnectionDTO newConnection)
        {
           
            
            var username = User.GetUsername();
            
            if (username == newConnection.Name)
                return BadRequest("You should already be in touch with yourself!");
            
            var appUser = await _userManager.FindByNameAsync(username);

            try
            {
                var newConnectionUser = await _userManager.FindByNameAsync(newConnection.Name);
                
                if(_userRepository.IsUserConnectedtoAnother(appUser,newConnectionUser))
                    return BadRequest("You are already friends.");
                    
                newConnectionUser.PendingConnections.Add(appUser);
                
                IdentityResult result = await _userManager.UpdateAsync(appUser);
                

                return Ok();
            }
            catch(Exception e)
            {
                return StatusCode(500, "User not found.");
            }
        }
        
        [Authorize]
        [HttpPost("connections")]
        public async Task<ActionResult<AppUser>> AddConnection([FromBody]ConnectionDTO newConnection)
        {
           
            
            var username = User.GetUsername();
            
            if (username == newConnection.Name)
                return BadRequest("You should already be in touch with yourself!");

            var appUser = await _userManager.FindByNameAsync(username);

            try
            {
                var newConnectionUser = await _userManager.FindByNameAsync(newConnection.Name);
                
                if(!_userRepository.IsUserPendingConnectedtoAnother(appUser,newConnectionUser))
                    return BadRequest("You must first request a connection.");
                
                if(_userRepository.IsUserConnectedtoAnother(appUser,newConnectionUser))
                    return BadRequest("You are already connected.");
                    
                appUser.Connections.Add(newConnectionUser);
                newConnectionUser.Connections.Add(appUser);
                
                await _context.Entry(appUser)
                    .Collection(u => u.PendingConnections)
                    .LoadAsync();
                await _context.Entry(newConnectionUser)
                    .Collection(u => u.PendingConnections)
                    .LoadAsync();
             
                appUser.PendingConnections.Remove(newConnectionUser);
                newConnectionUser.PendingConnections.Remove(appUser);
                
                IdentityResult result = await _userManager.UpdateAsync(appUser);
                

                return Ok();
            }
            catch(Exception e)
            {
                return StatusCode(500, "User not found.");
            }
        }

        [Authorize]
        [HttpDelete("connections")]
        public async Task<ActionResult<AppUser>> EndConnection([FromBody] ConnectionDTO connection)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var username = User.GetUsername();
                
                if (username == connection.Name)
                    return BadRequest("You are not friends with yourself.");

                var appUser = await _userManager.FindByNameAsync(username);
                var connectionToDelete = await _userManager.FindByNameAsync(connection.Name);
                
                if (!_userRepository.IsUserConnectedtoAnother(appUser, connectionToDelete))
                    return BadRequest("You are not contected.");

                await _context.Entry(appUser)
                    .Collection(u => u.Connections)
                    .LoadAsync();
             
                appUser.Connections.Remove(connectionToDelete);
                
                
                IdentityResult result = await _userManager.UpdateAsync(appUser);

                return Ok();
            }
            catch (Exception e)
            {
                return StatusCode(500, e); 
            }
        }
        
        [Authorize]
        [HttpDelete("rejectConnections")]
        public async Task<ActionResult<AppUser>> RejectConnection([FromBody] ConnectionDTO connection)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var username = User.GetUsername();
                
                if (username == connection.Name)
                    return BadRequest("You are not connected with yourself.");

                var appUser = await _userManager.FindByNameAsync(username);
                var connectionToDelete = await _userManager.FindByNameAsync(connection.Name);
                

                await _context.Entry(appUser)
                    .Collection(u => u.PendingConnections)
                    .LoadAsync();
             
                appUser.PendingConnections.Remove(connectionToDelete);
                
                
                IdentityResult result = await _userManager.UpdateAsync(appUser);

                return Ok();
            }
            catch (Exception e)
            {
                return StatusCode(500, e); 
            }
        }
    }
}
