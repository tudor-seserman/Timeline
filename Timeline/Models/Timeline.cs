namespace Timeline.Models;

public class Timeline
{
    private int Id { get;set; }
    private string Name { get;set; }
    private string Description { get;set; }
    private DateTime DateCreated { get;set; } 
    private DateTime DateStarted { get;set; }
    private DateTime DateFinished { get;set; }
    private TEvent[] Events { get;set; }
    private AppUser[] Users { get; set; }
    private AppUser Creator { get; set; }


    public Timeline(int id, string name, string description, DateTime dateCreated, DateTime dateStarted, DateTime dateFinished, TEvent[] events, AppUser[] users, AppUser creator)
    {
        Id = id;
        Name = name;
        Description = description;
        DateCreated = dateCreated;
        DateStarted = dateStarted;
        DateFinished = dateFinished;
        Events = events;
        Users = users;
        Creator = creator;
    }
}