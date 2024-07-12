using BackEnd.Context;
using BackEnd.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.Controllers
{
    // Controller for managing Client-Contact relationships
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowSpecificOrigin")] // Enable CORS with a specific policy
    public class ClientContactController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Constructor injection of ApplicationDbContext for database access
        public ClientContactController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Endpoint to link a contact to a client
        [HttpPost("{clientId}/linkContact/{contactId}")]
        public async Task<IActionResult> LinkContactToClient(int clientId, int contactId)
        {
            // Retrieve client and contact from database
            var client = await _context.Clients
                .FromSqlRaw("SELECT * FROM Clients WHERE Id = @ClientId",
                    new SqlParameter("@ClientId", clientId))
                .FirstOrDefaultAsync();

            var contact = await _context.Contacts
                .FromSqlRaw("SELECT * FROM Contacts WHERE Id = @ContactId",
                    new SqlParameter("@ContactId", contactId))
                .FirstOrDefaultAsync();

            // If either client or contact is not found, return NotFound result
            if (client == null || contact == null)
            {
                return NotFound();
            }

            // SQL query and parameters to insert into ClientContacts table
            var sql = "INSERT INTO ClientContacts (ClientId, ContactId) VALUES (@ClientId, @ContactId)";
            var parameters = new[]
            {
                new SqlParameter("@ClientId", clientId),
                new SqlParameter("@ContactId", contactId)
            };

            // Execute SQL command asynchronously
            await _context.Database.ExecuteSqlRawAsync(sql, parameters);

            // Return NoContent result
            return NoContent();
        }

        // Endpoint to unlink a contact from a client
        [HttpDelete("{clientId}/unlinkContact/{contactId}")]
        public async Task<IActionResult> UnlinkContactFromClient(int clientId, int contactId)
        {
            // Retrieve ClientContact record from database
            var clientContact = await _context.ClientContacts
                .FromSqlRaw("SELECT * FROM ClientContacts WHERE ClientId = @ClientId AND ContactId = @ContactId",
                    new SqlParameter("@ClientId", clientId),
                    new SqlParameter("@ContactId", contactId))
                .FirstOrDefaultAsync();

            // If ClientContact record is not found, return NotFound result
            if (clientContact == null)
            {
                return NotFound();
            }

            // SQL query and parameters to delete from ClientContacts table
            var sql = "DELETE FROM ClientContacts WHERE ClientId = @ClientId AND ContactId = @ContactId";
            var parameters = new[]
            {
                new SqlParameter("@ClientId", clientId),
                new SqlParameter("@ContactId", contactId)
            };

            // Execute SQL command asynchronously
            await _context.Database.ExecuteSqlRawAsync(sql, parameters);

            // Return NoContent result
            return NoContent();
        }

        // Endpoint to retrieve contacts for a specific client
        [HttpGet("{clientId}/contacts")]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContactsForClient(int clientId)
        {
            // SQL query to retrieve contacts for a client
            var sql = @"
                SELECT c.*
                FROM Contacts c
                INNER JOIN ClientContacts cc ON c.Id = cc.ContactId
                WHERE cc.ClientId = @ClientId
                ORDER BY c.Name, c.Surname";

            var parameter = new SqlParameter("@ClientId", clientId);

            // Execute SQL query asynchronously and retrieve list of contacts
            var contacts = await _context.Contacts
                .FromSqlRaw(sql, parameter)
                .ToListAsync();

            // If no contacts found, return Ok with a message
            if (!contacts.Any())
            {
                return Ok("No contacts found.");
            }

            // Return Ok with the list of contacts
            return Ok(contacts);
        }
    }
}
