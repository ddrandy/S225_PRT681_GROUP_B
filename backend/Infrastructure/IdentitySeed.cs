using Microsoft.AspNetCore.Identity;
using NtEvents.Api.Models;

namespace NtEvents.Api.Infrastructure
{
  public static class IdentitySeed
  {
    public static async Task SeedAsync(IServiceProvider sp)
    {
      using var scope = sp.CreateScope();
      var roles = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
      var users = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

      const string adminRole = "Admin";
      if (!await roles.RoleExistsAsync(adminRole))
        await roles.CreateAsync(new IdentityRole(adminRole));

      var adminEmail = "admin@ntevents.local";
      var admin = await users.FindByEmailAsync(adminEmail);
      if (admin == null)
      {
        admin = new ApplicationUser { UserName = adminEmail, Email = adminEmail, EmailConfirmed = true };
        await users.CreateAsync(admin, "Admin#123"); // test admin passwd
        await users.AddToRoleAsync(admin, adminRole);
      }
    }
  }
}