using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Timeline.Helpers.DTOs;
using Timeline.Helpers.DTOs.Account;
using Timeline.Interfaces;
using Timeline.Models;
using Timeline.Data;
using Microsoft.EntityFrameworkCore;

namespace Timeline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;
        
        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, SignInManager<AppUser> signInManager)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
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
    }
}
