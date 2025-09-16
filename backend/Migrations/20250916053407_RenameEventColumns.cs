using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NtEvents.Api.Migrations
{
    /// <inheritdoc />
    public partial class RenameEventColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Surbub",
                table: "Events",
                newName: "Suburb");

            migrationBuilder.RenameColumn(
                name: "CreatedAd",
                table: "Events",
                newName: "CreatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Suburb",
                table: "Events",
                newName: "Surbub");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Events",
                newName: "CreatedAd");
        }
    }
}
