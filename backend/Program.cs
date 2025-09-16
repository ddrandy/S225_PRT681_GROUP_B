using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NtEvents.Api.Data;
using NtEvents.Api.Models;
using NtEvents.Api.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// EF Core
builder.Services.AddDbContext<AppDbContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// Identity
builder.Services.AddIdentityCore<ApplicationUser>(opts =>
{
    opts.User.RequireUniqueEmail = true;
    opts.Password.RequiredLength = 6;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<AppDbContext>()
.AddSignInManager<SignInManager<ApplicationUser>>();

// JWT auth
var jwt = builder.Configuration.GetSection("Jwt");
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));
builder.Services.AddAuthentication(o =>
{
    o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(o =>
{
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidAudience = jwt["Audience"],
        ValidIssuer = jwt["Issuer"],
        IssuerSigningKey = key
    };
});

// admin-only policy
var authBuilder = builder.Services.AddAuthorizationBuilder();
authBuilder.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS for frontend
builder.Services.AddCors(o =>
{
    o.AddDefaultPolicy(p => p
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
        .WithOrigins("http://localhost:5173"));
});

builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// health
app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }))
   .WithName("HealthCheck");

// auth endpoints
app.MapPost("/api/auth/register", async (
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    IConfiguration cfg,
    string email, string password) =>
{
    var user = await userManager.FindByEmailAsync(email);
    if (user == null) return Results.Unauthorized();

    var ok = await userManager.CheckPasswordAsync(user, password);
    if (!ok) return Results.Unauthorized();

    // issue JWT
    var jwt = cfg.GetSection("Jwt");
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var claims = new[] {
        new System.Security.Claims.Claim("sub", user.Id),
        new System.Security.Claims.Claim("email", user.Email!)
    };
    var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
        issuer: jwt["Issuer"],
        audience: jwt["Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddHours(2),
        signingCredentials: creds
    );
    var jwtString = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);
    return Results.Ok(new { token = jwtString });
});

// profile
app.MapGet("/api/auth/me", async (UserManager<ApplicationUser> userManager, HttpContext http) =>
{
    if (!http.User.Identity?.IsAuthenticated ?? true) return Results.Unauthorized();
    var userId = http.User.FindFirst("sub")?.Value;
    if (userId is null) return Results.Unauthorized();
    var user = await userManager.FindByIdAsync(userId);
    return user is null ? Results.Unauthorized()
                        : Results.Ok(new { user.Id, user.Email, user.UserName });
}).RequireAuthorization();

// example endpoints
app.MapGet("/api/events/count", async (AppDbContext db) =>
{
    var count = await db.Events.CountAsync();
    return Results.Ok(new { count });
});

app.MapGet("/api/events", async (
    string? q, EventCategory? category, DateTimeOffset? from, DateTimeOffset? to, string? suburb,
    int page, int pageSize, AppDbContext db) =>
{
    page = page <= 0 ? 1 : page;
    pageSize = pageSize is <= 0 or > 50 ? 10 : pageSize;

    var query = db.Events.AsQueryable();
    if (!string.IsNullOrWhiteSpace(q))
        query = query.Where(e => e.Title.Contains(q) || (e.Suburb.Contains(q) || e.Address.Contains(q)));
    if (category.HasValue) query = query.Where(e => e.Category == category);
    if (from.HasValue) query = query.Where(e => e.StartTime >= from);
    if (to.HasValue) query = query.Where(e => e.EndTime <= to);
    if (!string.IsNullOrWhiteSpace(suburb)) query = query.Where(e => e.Suburb == suburb);

    var total = await query.CountAsync();
    var data = await query.OrderBy(e => e.StartTime)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

    return Results.Ok(new { total, page, pageSize, data });
});

app.MapGet("/api/events/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var e = await db.Events.FindAsync(id);
    return e is null ? Results.NotFound() : Results.Ok(e);
});

// admin CRUD
app.MapPost("/api/admin/events", async (Event dto, AppDbContext db) =>
{
    dto.Id = Guid.NewGuid();
    dto.CreatedAt = DateTimeOffset.UtcNow;
    db.Events.Add(dto);
    await db.SaveChangesAsync();
    return Results.Created($"/api/events/{dto.Id}", dto);
}).RequireAuthorization("AdminOnly");

app.MapPut("/api/admin/events/{id:guid}", async (Guid id, Event dto, AppDbContext db) =>
{
    var e = await db.Events.FindAsync(id);
    if (e is null) return Results.NotFound();

    e.Title = dto.Title;
    e.Description = dto.Description;
    e.Category = dto.Category;
    e.StartTime = dto.StartTime;
    e.EndTime = dto.EndTime;
    e.VenueName = dto.VenueName;
    e.Suburb = dto.Suburb;
    e.Address = dto.Address;
    e.HeroImageUrl = dto.HeroImageUrl;
    await db.SaveChangesAsync();
    return Results.Ok(e);
}).RequireAuthorization("AdminOnly");

app.MapDelete("/api/admin/events/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var e = await db.Events.FindAsync(id);
    if (e is null) return Results.NotFound();
    db.Events.Remove(e);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization("AdminOnly");

// registrations
app.MapPost("/api/events/{id:guid}/registrations", async (Guid id, Registration r, AppDbContext db) =>
{
    var exists = await db.Events.AnyAsync(e => e.Id == id);
    if (!exists) return Results.NotFound();
    r.Id = Guid.NewGuid();
    r.EventId = id;
    r.CreatedAt = DateTimeOffset.UtcNow;
    db.Registrations.Add(r);
    await db.SaveChangesAsync();
    return Results.Created($"/api/events/{id}/registrations/{r.Id}", new { r.Id });
});

app.MapGet("/api/admin/events/{id:guid}/registrations", async (Guid id, AppDbContext db) =>
{
    var list = await db.Registrations.Where(x => x.EventId == id).ToListAsync();
    return Results.Ok(list);
}).RequireAuthorization("AdminOnly");

// Add seed admin
await IdentitySeed.SeedAsync(app.Services);
app.Run();
