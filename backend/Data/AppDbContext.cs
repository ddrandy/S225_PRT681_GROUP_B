using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NtEvents.Api.Models;

namespace NtEvents.Api.Data
{
  public class AppDbContext : IdentityDbContext<ApplicationUser>
  {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Registration> Registrations => Set<Registration>();
    protected override void OnModelCreating(ModelBuilder b)
    {
      base.OnModelCreating(b);

      b.Entity<Event>().HasIndex(e => new { e.StartTime, e.Category });
      b.Entity<Registration>()
        .HasOne(r => r.Event)
        .WithMany(e => e.Registrations)
        .HasForeignKey(r => r.EventId);
    }
  }
}