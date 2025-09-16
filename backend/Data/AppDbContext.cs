using Microsoft.EntityFrameworkCore;
using NtEvents.Api.Models;

namespace NtEvents.Api.Data
{
  public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
  {
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Registration> Registrations => Set<Registration>();
    protected override void OnModelCreating(ModelBuilder b)
    {
      b.Entity<Event>().HasIndex(e => new { e.StartTime, e.Category });
      b.Entity<Registration>()
      .HasOne(r => r.Event)
      .WithMany(e => e.Registrations)
      .HasForeignKey(r => r.EventId);
    }
  }
}