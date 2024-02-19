namespace Timeline.Models;

public class TEvent
{
    public int Id { get; set; }
    public DateTime DateTime { get; set; }
    public string Desrciption { get; set; }

    public TEvent(int id, DateTime dateTime, string desrciption)
    {
        Id = id;
        DateTime = dateTime;
        Desrciption = desrciption;
    }
}