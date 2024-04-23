using Microsoft.EntityFrameworkCore;
using Timeline.Helpers.DTOs.Connections;
using Timeline.Interfaces.Data;
using Timeline.Models;

namespace Timeline.Data.Repositories;

public class UserRepository: IUserRepository
{
    private readonly ApplicationDBContext _context;

    public UserRepository(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<List<ConnectionDTO>> GetAllConnectionsAsync(AppUser appUser)
    {
        return await _context.Users.Where(user => user.Id == appUser.Id)
            .SelectMany(user =>user.Friends)
            .Select(f=>new ConnectionDTO(){Name=f.UserName})
            .ToListAsync();
    }

    public Boolean IsUserConnectedtoAnother(AppUser appUser, AppUser potentialConnection)
    {
        return _context.Users.Where(user => user.Id == appUser.Id)
            .SelectMany(user => user.Friends)
            .Any(f => f == potentialConnection);
    }

}