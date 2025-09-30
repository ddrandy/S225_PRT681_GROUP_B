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
            var events = new[]
            {
                // Markets
                new Event
                {
                    Id = Guid.NewGuid(),
                    Title = "Mindil Beach Sunset Markets",
                    Category = EventCategory.Market,
                    Description = "Darwin's iconic sunset market featuring food stalls from over 50 countries, arts, crafts, and live entertainment. Watch the spectacular sunset over the Arafura Sea while enjoying delicious food and a vibrant atmosphere.",
                    StartTime = now.AddDays(3).AddHours(17),
                    EndTime = now.AddDays(3).AddHours(21),
                    VenueName = "Mindil Beach",
                    Suburb = "The Gardens",
                    Address = "Daly Street, The Gardens NT 0820",
                    HeroImageUrl = "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800",
                    CreatedAt = now
                },
                new Event
                {
                    Id = Guid.NewGuid(),
                    Title = "Parap Village Markets",
                    Category = EventCategory.Market,
                    Description = "Local produce, handmade crafts, tropical plants, and delicious breakfast options. A favorite among locals for fresh tropical fruits and vegetables.",
                    StartTime = now.AddDays(5).AddHours(8),
                    EndTime = now.AddDays(5).AddHours(14),
                    VenueName = "Parap Shopping Village",
                    Suburb = "Parap",
                    Address = "Parap Place, Parap NT 0820",
                    HeroImageUrl = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800",
                    CreatedAt = now
                },
                new Event
                {
                    Id = Guid.NewGuid(),
                    Title = "Nightcliff Markets",
                    Category = EventCategory.Market,
                    Description = "Beachside markets with fresh produce, food vans, arts and crafts. Perfect for a Sunday morning stroll by the beach.",
                    StartTime = now.AddDays(6).AddHours(6).AddMinutes(30),
                    EndTime = now.AddDays(6).AddHours(11),
                    VenueName = "Nightcliff Foreshore",
                    Suburb = "Nightcliff",
                    Address = "Pavonia Way, Nightcliff NT 0810",
                    CreatedAt = now
                },

                // Festivals
                new Event
                {
                    Id = Guid.NewGuid(),
                    Title = "Darwin Festival Opening Night",
                    Category = EventCategory.Festival,
                    Description = "Celebrate the opening of Darwin Festival with spectacular performances, art installations, and community celebrations in the heart of the city.",
                    StartTime = now.AddDays(10).AddHours(18),
                    EndTime = now.AddDays(10).AddHours(22),
                    VenueName = "Festival Park",
                    Suburb = "Darwin City",
                    Address = "Civic Park, Smith Street, Darwin NT 0800",
                    HeroImageUrl = "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
                    CreatedAt = now
                },
                new Event
                {
                    Id = Guid.NewGuid(),
                    Title = "Territory Day Fireworks Spectacular",
                    Category = EventCategory.Festival,
                    Description = "Annual Territory Day celebrations featuring the biggest fireworks display in the NT. Family-friendly event with food stalls and entertainment.",
                    StartTime = now.AddDays(15).AddHours(17),
                    EndTime = now.AddDays(15).AddHours(23),
                    VenueName = "Mindil Beach",
                    Suburb = "The Gardens",
                    Address = "Daly Street, The Gardens NT 0820",
                    CreatedAt = now
                },

                // Music Events
                new Event
                {
                    Id = Guid.NewGuid(),
                    Title = "Live at the Amphitheatre",
                    Category = EventCategory.Music,
                    Description = "Local bands showcase featuring Darwin's best emerging talent. BYO picnic and enjoy music under the stars.",
                    StartTime = now.AddDays(7).AddHours(19),
                    EndTime = now.AddDays(7).AddHours(22),
                    VenueName = "Darwin Amphitheatre",
                    Suburb = "Darwin City",
                    Address = "93 Mitchell Street, Darwin NT 0800",
                    HeroImageUrl = "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
                    CreatedAt = now
                },
                new Event
                {
                    Id = Guid.NewGuid(),
                    Title = "Jazz by the Sea",
                    Category = EventCategory.Music,
                    Description = "Smooth jazz evening featuring local and interstate artists. Bring a blanket and enjoy the tropical evening breeze.",
                    StartTime = now.AddDays(12).AddHours(18).AddMinutes(30),
                    EndTime = now.AddDays(12).AddHours(21),
                    VenueName = "East Point Reserve",
                    Suburb = "Fannie Bay",
                    Address = "East Point Road, Fannie Bay NT 0820",
                    CreatedAt = now
                },

                // Sports Events
                new Event
                {
                    Id = Guid.NewGuid(),
                    Title = "Casuarina Park Run",
                    Category = EventCategory.Sports,
                    Description = "Free weekly 5km timed run along the beautiful Casuarina coastline. All fitness levels welcome, walkers encouraged!",
                    StartTime = now.AddDays(1).AddHours(-14), // Saturday morning
                    EndTime = now.AddDays(1).AddHours(-13),
                    VenueName = "Casuarina Coastal Reserve",
                    Suburb = "Casuarina",
                    Address = "Dripstone Road, Brinkin NT 0810",
                    HeroImageUrl = "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=800",
                    CreatedAt = now
                },
                new Event
                {
                    Id = Guid.NewGuid(),
                    Title = "Darwin Triathlon Club Training",
                    Category = EventCategory.Sports,
                    Description = "Join the Darwin Triathlon Club for their weekly training session. Open water swim, bike, and run training for all levels.",
                    StartTime = now.AddDays(2).AddHours(-15),
                    EndTime = now.AddDays(2).AddHours(-13),
                    VenueName = "Stokes Hill Wharf",
                    Suburb = "Darwin City",
                    Address = "Stokes Hill Road, Darwin NT 0800",
                    CreatedAt = now
                },
                new Event
                {
                    Id = Guid.NewGuid(),
                    Title = "Beach Volleyball Tournament",
                    Category = EventCategory.Sports,
                    Description = "Social beach volleyball tournament. Teams of 4, all skill levels welcome. Prizes and BBQ included.",
                    StartTime = now.AddDays(8).AddHours(9),
                    EndTime = now.AddDays(8).AddHours(15),
                    VenueName = "Mindil Beach",
                    Suburb = "The Gardens",
                    Address = "Daly Street, The Gardens NT 0820",
                    CreatedAt = now
                },

                // Community Events
                new Event
                {
                    Id = Guid.NewGuid(),
                    Title = "Community Garden Working Bee",
                    Category = EventCategory.Community,
                    Description = "Help maintain our community garden! Learn about tropical gardening, composting, and meet fellow green thumbs.",
                    StartTime = now.AddDays(4).AddHours(7),
                    EndTime = now.AddDays(4).AddHours(10),
                    VenueName = "Rapid Creek Community Garden",
                    Suburb = "Rapid Creek",
                    Address = "48 Trower Road, Rapid Creek NT 0810",
                    CreatedAt = now
                },
                new Event
                {
                    Id = Guid.NewGuid(),
                    Title = "Darwin Library Story Time",
                    Category = EventCategory.Community,
                    Description = "Interactive story time for children aged 2-5 years. Songs, stories, and craft activities.",
                    StartTime = now.AddDays(3).AddHours(10),
                    EndTime = now.AddDays(3).AddHours(11),
                    VenueName = "Darwin City Library",
                    Suburb = "Darwin City",
                    Address = "Harry Chan Avenue, Darwin NT 0800",
                    CreatedAt = now
                },
                new Event
                {
                    Id = Guid.NewGuid(),
                    Title = "Seniors Morning Tea & Bingo",
                    Category = EventCategory.Community,
                    Description = "Social morning tea and bingo for seniors. Meet new friends and enjoy some friendly competition.",
                    StartTime = now.AddDays(5).AddHours(10),
                    EndTime = now.AddDays(5).AddHours(12),
                    VenueName = "Nightcliff Community Centre",
                    Suburb = "Nightcliff",
                    Address = "18 Bauhinia Street, Nightcliff NT 0810",
                    CreatedAt = now
                },

                // Other Events
                new Event
                {
                    Id = Guid.NewGuid(),
                    Title = "Crocodile Safety Workshop",
                    Category = EventCategory.Other,
                    Description = "Learn about crocodile behavior and safety in the Top End. Essential knowledge for all Territory residents and visitors.",
                    StartTime = now.AddDays(6).AddHours(14),
                    EndTime = now.AddDays(6).AddHours(16),
                    VenueName = "Crocosaurus Cove",
                    Suburb = "Darwin City",
                    Address = "58 Mitchell Street, Darwin NT 0800",
                    CreatedAt = now
                },
                new Event
                {
                    Id = Guid.NewGuid(),
                    Title = "Darwin Harbour Sunset Cruise",
                    Category = EventCategory.Other,
                    Description = "Experience Darwin's famous sunset from the water. Light refreshments provided, BYO drinks welcome.",
                    StartTime = now.AddDays(9).AddHours(17).AddMinutes(30),
                    EndTime = now.AddDays(9).AddHours(19).AddMinutes(30),
                    VenueName = "Cullen Bay Marina",
                    Suburb = "Cullen Bay",
                    Address = "54 Marina Boulevard, Cullen Bay NT 0820",
                    HeroImageUrl = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
                    CreatedAt = now
                }
            };

            db.Events.AddRange(events);
            await db.SaveChangesAsync();

            // Add some sample registrations
            var sampleRegistrations = new[]
            {
                new Registration
                {
                    Id = Guid.NewGuid(),
                    EventId = events[0].Id,
                    Name = "John Smith",
                    Email = "john@example.com",
                    Phone = "0400 123 456",
                    CreatedAt = now.AddDays(-2)
                },
                new Registration
                {
                    Id = Guid.NewGuid(),
                    EventId = events[0].Id,
                    Name = "Sarah Johnson",
                    Email = "sarah@example.com",
                    Phone = "0412 345 678",
                    CreatedAt = now.AddDays(-1)
                },
                new Registration
                {
                    Id = Guid.NewGuid(),
                    EventId = events[1].Id,
                    Name = "Mike Wilson",
                    Email = "mike@example.com",
                    CreatedAt = now.AddHours(-6)
                },
                new Registration
                {
                    Id = Guid.NewGuid(),
                    EventId = events[8].Id,
                    Name = "Emma Brown",
                    Email = "emma@example.com",
                    Phone = "0423 456 789",
                    CreatedAt = now.AddHours(-3)
                }
            };

            db.Registrations.AddRange(sampleRegistrations);
            await db.SaveChangesAsync();
        }
    }
}