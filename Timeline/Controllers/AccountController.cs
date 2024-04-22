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
using Timeline.Helpers.DTOs.Connections;
using Timeline.Helpers.Extensions;
using Timeline.Helpers.Mappers;

namespace Timeline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly DbContext _context;
        
        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, SignInManager<AppUser> signInManager,DbContext context)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO loginDto)
        {
            
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());
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
        [HttpGet("Connections")]
        public async Task<ActionResult<List<ConnectionDTO>>> GetConnections()
        {
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);
        
            return appUser.toConnectionListFromUser();
        }
        
        [Authorize]
        [HttpPost("Connections")]
        public async Task<ActionResult<AppUser>> AddConnection([FromBody]string newConnection)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var username = User.GetUsername();
            
            if (username == newConnection)
                return BadRequest("You should aready be in touch with yourself!");
            
            var appUser = await _userManager.FindByNameAsync(username);

            try
            {
                var newConnectionUser = await _userManager.FindByNameAsync(newConnection);
                appUser.Friends.Add(newConnectionUser);
                await _userManager.UpdateAsync(appUser);

                return Ok();
            }
            catch(Exception e)
            {
                return StatusCode(500, "User not found.");
            }
        }
    }
}
