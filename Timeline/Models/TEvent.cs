namespace Timeline.Models;

public class TEvent
{
    public int Id { get; set; }
    public DateTime DateTime { get; set; }
    public string Description { get; set; }

    public TEvent(int id, DateTime dateTime, string description)
    {
        Id = id;
        DateTime = dateTime;
        Description = description;
    }
}