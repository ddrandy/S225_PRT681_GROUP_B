// Infrastructure/SeedData.cs
using NtEvents.Api.Data;
using NtEvents.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace NtEvents.Api.Infrastructure;

public static class SeedData
{
  public static async Task EnsureSeededAsync(IServiceProvider sp)
  {
    using var scope = sp.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();

    if (!await db.Events.AnyAsync())
    {
      var now = DateTimeOffset.UtcNow;
      var items = new[]
      {
        new Event {
          Id = Guid.NewGuid(),
          Title = "Mindil Beach Sunset Markets",
          Category = EventCategory.Market,
          Description = "Food stalls, crafts, music at the iconic sunset market.",
          StartTime = now.AddDays(3),
          EndTime = now.AddDays(3).AddHours(4),
          VenueName = "Mindil Beach",
          Suburb = "Darwin",
          Address = "Daly St, The Gardens NT 0820",
          HeroImageUrl = null,
          CreatedAt = now
        },
        new Event {
          Id = Guid.NewGuid(),
          Title = "Darwin Festival Opening Night",
          Category = EventCategory.Festival,
          Description = "Performances, art, and community celebration.",
          StartTime = now.AddDays(10),
          EndTime = now.AddDays(10).AddHours(3),
          VenueName = "Festival Park",
          Suburb = "Darwin City",
          Address = "Civic Park, Smith St, Darwin NT",
          CreatedAt = now
        },
        new Event {
          Id = Guid.NewGuid(),
          Title = "Casuarina Park Run",
          Category = EventCategory.Sports,
          Description = "Free 5km timed run—beginners welcome.",
          StartTime = now.AddDays(1).AddHours(22),
          EndTime = now.AddDays(1).AddHours(24),
          VenueName = "Casuarina Coastal Reserve",
          Suburb = "Casuarina",
          Address = "Dripstone Rd, Brinkin NT",
          CreatedAt = now
        }
      };
      db.Events.AddRange(items);
      await db.SaveChangesAsync();
    }
  }
}
