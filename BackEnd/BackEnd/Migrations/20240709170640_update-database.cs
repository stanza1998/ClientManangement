using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd.Migrations
{
    /// <inheritdoc />
    public partial class updatedatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Contacts_Email",
                table: "Contacts");

            migrationBuilder.DropIndex(
                name: "IX_Clients_ClientCode",
                table: "Clients");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Contacts",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "ClientCode",
                table: "Clients",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldDefaultValueSql: "NEWID()");

            migrationBuilder.CreateTable(
                name: "ClientContacts",
                columns: table => new
                {
                    ClientId = table.Column<int>(type: "int", nullable: false),
                    ContactId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientContacts", x => new { x.ClientId, x.ContactId });
                    table.ForeignKey(
                        name: "FK_ClientContacts_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClientContacts_Contacts_ContactId",
                        column: x => x.ContactId,
                        principalTable: "Contacts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClientContacts_ContactId",
                table: "ClientContacts",
                column: "ContactId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClientContacts");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Contacts",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ClientCode",
                table: "Clients",
                type: "nvarchar(450)",
                nullable: false,
                defaultValueSql: "NEWID()",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_Email",
                table: "Contacts",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Clients_ClientCode",
                table: "Clients",
                column: "ClientCode",
                unique: true);
        }
    }
}
