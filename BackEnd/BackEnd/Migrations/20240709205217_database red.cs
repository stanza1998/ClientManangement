using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd.Migrations
{
    /// <inheritdoc />
    public partial class databasered : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ClientContacts",
                table: "ClientContacts");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "ClientContacts",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ClientContacts",
                table: "ClientContacts",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_ClientContacts_ClientId",
                table: "ClientContacts",
                column: "ClientId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ClientContacts",
                table: "ClientContacts");

            migrationBuilder.DropIndex(
                name: "IX_ClientContacts_ClientId",
                table: "ClientContacts");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "ClientContacts");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ClientContacts",
                table: "ClientContacts",
                columns: new[] { "ClientId", "ContactId" });
        }
    }
}
