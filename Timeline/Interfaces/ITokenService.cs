using Timeline.Models;

namespace Timeline.Interfaces;

public interface ITokenService
{
    string CreateToken(AppUser user);
}