using BackEnd.Context;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactClientController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ContactClientController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Link Client to Contact
        [HttpPost("{contactId}/linkClient/{clientId}")]
        public async Task<IActionResult> LinkClientToContact(int contactId, int clientId)
        {
            var contact = await _context.Contacts.FromSqlRaw("SELECT * FROM Contacts WHERE Id = @ContactId",
                new SqlParameter("@ContactId", contactId)).FirstOrDefaultAsync();
            var client = await _context.Clients.FromSqlRaw("SELECT * FROM Clients WHERE Id = @ClientId",
                new SqlParameter("@ClientId", clientId)).FirstOrDefaultAsync();

            if (contact == null || client == null)
            {
                return NotFound();
            }

            var sql = "INSERT INTO ClientContacts (ContactId, ClientId) VALUES (@ContactId, @ClientId)";
            var parameters = new[]
            {
                new SqlParameter("@ContactId", contactId),
                new SqlParameter("@ClientId", clientId)
            };

            await _context.Database.ExecuteSqlRawAsync(sql, parameters);

            return NoContent();
        }

        // Get Clients linked to a Contact
        [HttpGet("{contactId}/clients")]
        public async Task<ActionResult<IEnumerable<Client>>> GetClientsForContact(int contactId)
        {
            var sql = @"
                SELECT c.*
                FROM Clients c
                INNER JOIN ClientContacts cc ON c.Id = cc.ClientId
                WHERE cc.ContactId = @ContactId";
            var parameter = new SqlParameter("@ContactId", contactId);

            var clients = await _context.Clients.FromSqlRaw(sql, parameter).ToListAsync();

            if (!clients.Any())
            {
                return Ok("No clients found.");
            }

            return Ok(clients);
        }
    }
}
