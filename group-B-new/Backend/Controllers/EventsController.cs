using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NTEventFinder.Data;
using NTEventFinder.DTOs;
using NTEventFinder.Models;
using System.Security.Claims;

namespace NTEventFinder.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly AppDbContext _context;

    public EventsController(AppDbContext context)
    {
        _context = context;
    }

    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return userIdClaim != null ? int.Parse(userIdClaim) : null;
    }

    private bool IsAdmin()
    {
        var isAdminClaim = User.FindFirst("isAdmin")?.Value;
        return isAdminClaim != null && bool.Parse(isAdminClaim);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventResponse>>> GetEvents(
        [FromQuery] string? category = null,
        [FromQuery] string? location = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] bool? approvedOnly = true)
    {
        var query = _context.Events.Include(e => e.Creator).AsQueryable();

        // Filter by approval status
        if (approvedOnly == true)
        {
            query = query.Where(e => e.IsApproved);
        }

        // Apply filters
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(e => e.Category.ToLower().Contains(category.ToLower()));
        }

        if (!string.IsNullOrEmpty(location))
        {
            query = query.Where(e => e.Location.ToLower().Contains(location.ToLower()));
        }

        if (startDate.HasValue)
        {
            query = query.Where(e => e.Date >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(e => e.Date <= endDate.Value);
        }

        var events = await query.OrderBy(e => e.Date).ToListAsync();
        var userId = GetCurrentUserId();

        var response = events.Select(e => new EventResponse
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
            IsFavorited = userId.HasValue && _context.Favorites.Any(f => f.UserId == userId.Value && f.EventId == e.EventId)
        }).ToList();

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventResponse>> GetEvent(int id)
    {
        var eventItem = await _context.Events
            .Include(e => e.Creator)
            .FirstOrDefaultAsync(e => e.EventId == id);

        if (eventItem == null)
        {
            return NotFound(new { message = "Event not found" });
        }

        var userId = GetCurrentUserId();

        var response = new EventResponse
        {
            EventId = eventItem.EventId,
            Title = eventItem.Title,
            Description = eventItem.Description,
            Date = eventItem.Date,
            Time = eventItem.Time,
            Location = eventItem.Location,
            Category = eventItem.Category,
            ImagePath = eventItem.ImagePath,
            CreatedBy = eventItem.CreatedBy,
            CreatorUsername = eventItem.Creator?.Username ?? "Unknown",
            IsApproved = eventItem.IsApproved,
            CreatedAt = eventItem.CreatedAt,
            IsFavorited = userId.HasValue && await _context.Favorites.AnyAsync(f => f.UserId == userId.Value && f.EventId == id)
        };

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<EventResponse>> CreateEvent([FromBody] CreateEventRequest request)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        var isAdmin = IsAdmin();

        var newEvent = new Event
        {
            Title = request.Title,
            Description = request.Description,
            Date = request.Date,
            Time = request.Time,
            Location = request.Location,
            Category = request.Category,
            ImagePath = request.ImagePath,
            CreatedBy = userId.Value,
            IsApproved = isAdmin, // Auto-approve if admin creates event
            CreatedAt = DateTime.UtcNow
        };

        _context.Events.Add(newEvent);
        await _context.SaveChangesAsync();

        var creator = await _context.Users.FindAsync(userId.Value);

        var response = new EventResponse
        {
            EventId = newEvent.EventId,
            Title = newEvent.Title,
            Description = newEvent.Description,
            Date = newEvent.Date,
            Time = newEvent.Time,
            Location = newEvent.Location,
            Category = newEvent.Category,
            ImagePath = newEvent.ImagePath,
            CreatedBy = newEvent.CreatedBy,
            CreatorUsername = creator?.Username ?? "Unknown",
            IsApproved = newEvent.IsApproved,
            CreatedAt = newEvent.CreatedAt
        };

        return CreatedAtAction(nameof(GetEvent), new { id = newEvent.EventId }, response);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<EventResponse>> UpdateEvent(int id, [FromBody] UpdateEventRequest request)
    {
        var eventItem = await _context.Events.Include(e => e.Creator).FirstOrDefaultAsync(e => e.EventId == id);

        if (eventItem == null)
        {
            return NotFound(new { message = "Event not found" });
        }

        var userId = GetCurrentUserId();
        var isAdmin = IsAdmin();

        // Only admin or event creator can update
        if (!isAdmin && eventItem.CreatedBy != userId)
        {
            return Forbid();
        }

        // Update fields if provided
        if (!string.IsNullOrEmpty(request.Title))
            eventItem.Title = request.Title;

        if (!string.IsNullOrEmpty(request.Description))
            eventItem.Description = request.Description;

        if (request.Date.HasValue)
            eventItem.Date = request.Date.Value;

        if (!string.IsNullOrEmpty(request.Time))
            eventItem.Time = request.Time;

        if (!string.IsNullOrEmpty(request.Location))
            eventItem.Location = request.Location;

        if (!string.IsNullOrEmpty(request.Category))
            eventItem.Category = request.Category;

        if (request.ImagePath != null)
            eventItem.ImagePath = request.ImagePath;

        // Only admin can approve/reject events
        if (isAdmin && request.IsApproved.HasValue)
            eventItem.IsApproved = request.IsApproved.Value;

        await _context.SaveChangesAsync();

        var response = new EventResponse
        {
            EventId = eventItem.EventId,
            Title = eventItem.Title,
            Description = eventItem.Description,
            Date = eventItem.Date,
            Time = eventItem.Time,
            Location = eventItem.Location,
            Category = eventItem.Category,
            ImagePath = eventItem.ImagePath,
            CreatedBy = eventItem.CreatedBy,
            CreatorUsername = eventItem.Creator?.Username ?? "Unknown",
            IsApproved = eventItem.IsApproved,
            CreatedAt = eventItem.CreatedAt
        };

        return Ok(response);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvent(int id)
    {
        var eventItem = await _context.Events.FindAsync(id);

        if (eventItem == null)
        {
            return NotFound(new { message = "Event not found" });
        }

        var userId = GetCurrentUserId();
        var isAdmin = IsAdmin();

        // Only admin or event creator can delete
        if (!isAdmin && eventItem.CreatedBy != userId)
        {
            return Forbid();
        }

        _context.Events.Remove(eventItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<EventResponse>>> GetFeaturedEvents([FromQuery] int count = 5)
    {
        var events = await _context.Events
            .Include(e => e.Creator)
            .Where(e => e.IsApproved && e.Date >= DateTime.UtcNow)
            .OrderBy(e => e.Date)
            .Take(count)
            .ToListAsync();

        var userId = GetCurrentUserId();

        var response = events.Select(e => new EventResponse
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
            IsFavorited = userId.HasValue && _context.Favorites.Any(f => f.UserId == userId.Value && f.EventId == e.EventId)
        }).ToList();

        return Ok(response);
    }

    [HttpGet("upcoming")]
    public async Task<ActionResult<IEnumerable<EventResponse>>> GetUpcomingEvents([FromQuery] int count = 12)
    {
        var events = await _context.Events
            .Include(e => e.Creator)
            .Where(e => e.IsApproved && e.Date >= DateTime.UtcNow)
            .OrderBy(e => e.Date)
            .Take(count)
            .ToListAsync();

        var userId = GetCurrentUserId();

        var response = events.Select(e => new EventResponse
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
            IsFavorited = userId.HasValue && _context.Favorites.Any(f => f.UserId == userId.Value && f.EventId == e.EventId)
        }).ToList();

        return Ok(response);
    }
}
