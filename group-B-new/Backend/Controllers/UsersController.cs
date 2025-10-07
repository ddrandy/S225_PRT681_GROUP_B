using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NTEventFinder.Data;
using System.Security.Claims;

namespace NTEventFinder.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim!);
    }

    private bool IsAdmin()
    {
        var isAdminClaim = User.FindFirst("isAdmin")?.Value;
        return isAdminClaim != null && bool.Parse(isAdminClaim);
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        // Only admin can view all users
        if (!IsAdmin())
        {
            return Forbid();
        }

        var users = await _context.Users
            .Select(u => new
            {
                u.UserId,
                u.Username,
                u.Email,
                u.IsAdmin,
                u.DateRegistered
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var currentUserId = GetCurrentUserId();
        var isAdmin = IsAdmin();

        // Users can only view their own profile unless they're admin
        if (!isAdmin && currentUserId != id)
        {
            return Forbid();
        }

        var user = await _context.Users
            .Where(u => u.UserId == id)
            .Select(u => new
            {
                u.UserId,
                u.Username,
                u.Email,
                u.IsAdmin,
                u.DateRegistered
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        return Ok(user);
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetCurrentUserId();

        var user = await _context.Users
            .Where(u => u.UserId == userId)
            .Select(u => new
            {
                u.UserId,
                u.Username,
                u.Email,
                u.IsAdmin,
                u.DateRegistered
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        return Ok(user);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        // Only admin can delete users
        if (!IsAdmin())
        {
            return Forbid();
        }

        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        // Prevent deleting yourself
        var currentUserId = GetCurrentUserId();
        if (currentUserId == id)
        {
            return BadRequest(new { message = "Cannot delete your own account" });
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User deleted successfully" });
    }
}
