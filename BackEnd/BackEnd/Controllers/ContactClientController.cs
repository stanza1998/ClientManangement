using BackEnd.Context;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.Controllers
{
    // Controller for managing relationships between contacts and clients
    [Route("api/[controller]")]
    [ApiController]
    public class ContactClientController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Constructor injection of ApplicationDbContext for database access
        public ContactClientController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Endpoint to link a client to a contact
        [HttpPost("{contactId}/linkClient/{clientId}")]
        public async Task<IActionResult> LinkClientToContact(int contactId, int clientId)
        {
            // Retrieve contact and client from database safely using parameterized queries
            var contact = await _context.Contacts
                .FirstOrDefaultAsync(c => c.Id == contactId);

            var client = await _context.Clients
                .FirstOrDefaultAsync(c => c.Id == clientId);

            // If contact or client is not found, return NotFound result
            if (contact == null || client == null)
            {
                return NotFound();
            }

            // SQL query and parameters to insert into ClientContacts table
            var sql = "INSERT INTO ClientContacts (ContactId, ClientId) VALUES (@ContactId, @ClientId)";
            var parameters = new[]
            {
                new SqlParameter("@ContactId", contactId),
                new SqlParameter("@ClientId", clientId)
            };

            // Execute SQL command asynchronously
            await _context.Database.ExecuteSqlRawAsync(sql, parameters);

            // Return NoContent result
            return NoContent();
        }

        // Endpoint to unlink a client from a contact
        [HttpDelete("{contactId}/unlinkClient/{clientId}")]
        public async Task<IActionResult> UnlinkClientFromContact(int contactId, int clientId)
        {
            // Retrieve contact and client from database safely using parameterized queries
            var contact = await _context.Contacts
                .FirstOrDefaultAsync(c => c.Id == contactId);

            var client = await _context.Clients
                .FirstOrDefaultAsync(c => c.Id == clientId);

            // If contact or client is not found, return NotFound result
            if (contact == null || client == null)
            {
                return NotFound();
            }

            // SQL query and parameters to delete from ClientContacts table
            var sql = "DELETE FROM ClientContacts WHERE ContactId = @ContactId AND ClientId = @ClientId";
            var parameters = new[]
            {
                new SqlParameter("@ContactId", contactId),
                new SqlParameter("@ClientId", clientId)
            };

            // Execute SQL command asynchronously
            await _context.Database.ExecuteSqlRawAsync(sql, parameters);

            // Return NoContent result
            return NoContent();
        }

        // Endpoint to retrieve clients linked to a contact
        [HttpGet("{contactId}/clients")]
        public async Task<ActionResult<IEnumerable<Client>>> GetClientsForContact(int contactId)
        {
            // SQL query to retrieve clients linked to a contact using parameterized queries
            var sql = @"
                SELECT c.*
                FROM Clients c
                INNER JOIN ClientContacts cc ON c.Id = cc.ClientId
                WHERE cc.ContactId = @ContactId
                ORDER BY c.Name ASC"; // Order by name ascending

            var parameter = new SqlParameter("@ContactId", contactId);

            // Execute SQL query asynchronously and retrieve list of clients
            var clients = await _context.Clients
                .FromSqlRaw(sql, parameter)
                .ToListAsync();

            // If no clients found, return Ok with a message
            if (!clients.Any())
            {
                return Ok("No clients found.");
            }

            // Return Ok with the list of clients
            return Ok(clients);
        }
    }
}
