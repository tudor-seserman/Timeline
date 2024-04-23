using Timeline.Helpers.DTOs.Connections;
using Timeline.Models;

namespace Timeline.Interfaces.Data;

public interface IUserRepository
{
    Task<List<ConnectionDTO>> GetAllConnectionsAsync(AppUser appUser);
    Boolean IsUserConnectedtoAnother(AppUser appUser, AppUser potentialConnection);
}