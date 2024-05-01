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
            .SelectMany(user =>user.Connections)
            .Select(f=>new ConnectionDTO(){Name=f.UserName})
            .ToListAsync();
    }

    public Boolean IsUserConnectedtoAnother(AppUser appUser, AppUser potentialConnection)
    {
        return _context.Users.Where(user => user.Id == appUser.Id)
            .SelectMany(user => user.Connections)
            .Any(f => f == potentialConnection);
    }
    
    public async Task<List<ConnectionDTO>> GetAllPendingConnectionsAsync(AppUser appUser)
    {
        return await _context.Users.Where(user => user.Id == appUser.Id)
            .SelectMany(user =>user.PendingConnections)
            .Select(f=>new ConnectionDTO(){Name=f.UserName})
            .ToListAsync();
    }

    public Boolean IsUserPendingConnectedtoAnother(AppUser appUser, AppUser potentialConnection)
    {
        return _context.Users.Where(user => user.Id == appUser.Id)
            .SelectMany(user => user.PendingConnections)
            .Any(f => f == potentialConnection);
    }

}