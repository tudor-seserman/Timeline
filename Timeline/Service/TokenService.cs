using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Timeline.Interfaces;
using Timeline.Models;

namespace Timeline.Service;

public class TokenService:ITokenService
{
    private readonly IConfiguration _configuration;
    private readonly SymmetricSecurityKey _key;
    
    public TokenService(IConfiguration configuration, String signinKey)
    {
        _configuration = configuration;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signinKey));
    }

    public string CreateToken(AppUser user)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.GivenName, user.UserName)
        };
        var creds = new SigningCredentials(_key,SecurityAlgorithms.HmacSha512Signature);
        var tokenDescription = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(7),
            SigningCredentials = creds,
            Issuer = _configuration["JWT:Issuer"],
            Audience = _configuration["JWT:Audience"],
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescription);

        return tokenHandler.WriteToken(token);
    }
}