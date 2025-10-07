using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NTEventFinder.Data;
using NTEventFinder.DTOs;
using NTEventFinder.Models;
using System.Security.Claims;

namespace NTEventFinder.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FavoritesController : ControllerBase
{
    private readonly AppDbContext _context;

    public FavoritesController(AppDbContext context)
    {
        _context = context;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim!);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventResponse>>> GetFavorites()
    {
        var userId = GetCurrentUserId();

        var favorites = await _context.Favorites
            .Include(f => f.Event)
            .ThenInclude(e => e!.Creator)
            .Where(f => f.UserId == userId)
            .Select(f => f.Event!)
            .ToListAsync();

        var response = favorites.Select(e => new EventResponse
        {
            EventId = e.EventId,
            Title = e.Title,
            Description = e.Description,
            Date = e.Date,
            Time = e.Time,
            Location = e.Location,
            Category = e.Category,
            ImagePath = e.ImagePath,
            CreatedBy = e.CreatedBy,
            CreatorUsername = e.Creator?.Username ?? "Unknown",
            IsApproved = e.IsApproved,
            CreatedAt = e.CreatedAt,
            IsFavorited = true
        }).ToList();

        return Ok(response);
    }

    [HttpPost("{eventId}")]
    public async Task<IActionResult> AddFavorite(int eventId)
    {
        var userId = GetCurrentUserId();

        // Check if event exists
        var eventExists = await _context.Events.AnyAsync(e => e.EventId == eventId);
        if (!eventExists)
        {
            return NotFound(new { message = "Event not found" });
        }

        // Check if already favorited
        var existingFavorite = await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.EventId == eventId);

        if (existingFavorite != null)
        {
            return BadRequest(new { message = "Event already in favorites" });
        }

        var favorite = new Favorite
        {
            UserId = userId,
            EventId = eventId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Favorites.Add(favorite);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Event added to favorites" });
    }

    [HttpDelete("{eventId}")]
    public async Task<IActionResult> RemoveFavorite(int eventId)
    {
        var userId = GetCurrentUserId();

        var favorite = await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.EventId == eventId);

        if (favorite == null)
        {
            return NotFound(new { message = "Favorite not found" });
        }

        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Event removed from favorites" });
    }

    [HttpGet("check/{eventId}")]
    public async Task<ActionResult<bool>> CheckFavorite(int eventId)
    {
        var userId = GetCurrentUserId();

        var isFavorited = await _context.Favorites
            .AnyAsync(f => f.UserId == userId && f.EventId == eventId);

        return Ok(new { isFavorited });
    }
}
