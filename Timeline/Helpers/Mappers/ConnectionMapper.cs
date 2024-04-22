using Timeline.Helpers.DTOs.Connections;
using Timeline.Models;

namespace Timeline.Helpers.Mappers;

public static class ConnectionMapper
{
    public static List<ConnectionDTO> toConnectionListFromUser(this AppUser appUser)
    {
        List<ConnectionDTO> connections = new List<ConnectionDTO>();
        appUser.Friends.ForEach(c=>
        {
            connections.Add(new ConnectionDTO() { Name = c.UserName }); 
        });
        return connections;
    }
}