namespace NtEvents.Api.Models
{
  public enum EventCategory { Market, Festival, Music, Sports, Community, Other }

  public class Event
  {
    public Guid Id { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public EventCategory Category { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public string VenueName { get; set; } = default!;
    public string Surbub { get; set; } = default!;
    public string Address { get; set; } = default!;
    public string? HeroImageUrl { get; set; }
    public DateTimeOffset CreatedAd { get; set; } = DateTimeOffset.UtcNow;
    public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
  }
}