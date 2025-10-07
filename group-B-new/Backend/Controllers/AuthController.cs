using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NTEventFinder.Data;
using NTEventFinder.DTOs;
using NTEventFinder.Models;
using NTEventFinder.Services;
using BCrypt.Net;

namespace NTEventFinder.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;

    public AuthController(AppDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        // Check if email already exists
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest(new { message = "Email already registered" });
        }

        // Check if username already exists
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
        {
            return BadRequest(new { message = "Username already taken" });
        }

        // Check if this is the first user (will become admin)
        var isFirstUser = !await _context.Users.AnyAsync();

        // Create new user
        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            IsAdmin = isFirstUser,
            DateRegistered = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Generate JWT token
        var token = _jwtService.GenerateToken(user);

        var response = new AuthResponse
        {
            UserId = user.UserId,
            Username = user.Username,
            Email = user.Email,
            IsAdmin = user.IsAdmin,
            Token = token,
            DateRegistered = user.DateRegistered
        };

        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        // Find user by email
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        // Verify password
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        // Generate JWT token
        var token = _jwtService.GenerateToken(user);

        var response = new AuthResponse
        {
            UserId = user.UserId,
            Username = user.Username,
            Email = user.Email,
            IsAdmin = user.IsAdmin,
            Token = token,
            DateRegistered = user.DateRegistered
        };

        return Ok(response);
    }
}
