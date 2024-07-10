using BackEnd.Context;
using BackEnd.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowSpecificOrigin")]
    public class ClientContactController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientContactController(ApplicationDbContext context)
        {
            _context = context;
        }



        [HttpPost("{clientId}/linkContact/{contactId}")]
        public async Task<IActionResult> LinkContactToClient(int clientId, int contactId)
        {
            var client = await _context.Clients.FromSqlRaw("SELECT * FROM Clients WHERE Id = @ClientId",
                new SqlParameter("@ClientId", clientId)).FirstOrDefaultAsync();
            var contact = await _context.Contacts.FromSqlRaw("SELECT * FROM Contacts WHERE Id = @ContactId",
                new SqlParameter("@ContactId", contactId)).FirstOrDefaultAsync();

            if (client == null || contact == null)
            {
                return NotFound();
            }

            var sql = "INSERT INTO ClientContacts (ClientId, ContactId) VALUES (@ClientId, @ContactId)";
            var parameters = new[]
            {
                new SqlParameter("@ClientId", clientId),
                new SqlParameter("@ContactId", contactId)
            };

            await _context.Database.ExecuteSqlRawAsync(sql, parameters);

            return NoContent();
        }

        [HttpGet("{clientId}/contacts")]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContactsForClient(int clientId)
        {
            var sql = @"
                SELECT c.*
                FROM Contacts c
                INNER JOIN ClientContacts cc ON c.Id = cc.ContactId
                WHERE cc.ClientId = @ClientId";
            var parameter = new SqlParameter("@ClientId", clientId);

            var contacts = await _context.Contacts.FromSqlRaw(sql, parameter).ToListAsync();

            if (!contacts.Any())
            {
                return Ok("No contacts found.");
            }

            return Ok(contacts);
        }
    }
}
