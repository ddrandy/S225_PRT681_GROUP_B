using Microsoft.EntityFrameworkCore;
using NTEventFinder.Models;

namespace NTEventFinder.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<Favorite> Favorites { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Username).IsUnique();
        });

        // Configure Event entity
        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasOne(e => e.Creator)
                  .WithMany(u => u.CreatedEvents)
                  .HasForeignKey(e => e.CreatedBy)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Favorite entity
        modelBuilder.Entity<Favorite>(entity =>
        {
            entity.HasOne(f => f.User)
                  .WithMany(u => u.Favorites)
                  .HasForeignKey(f => f.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(f => f.Event)
                  .WithMany(e => e.Favorites)
                  .HasForeignKey(f => f.EventId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Ensure a user can only favorite an event once
            entity.HasIndex(e => new { e.UserId, e.EventId }).IsUnique();
        });
    }
}
