using BackEnd.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using BackEnd.Models;


namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Clients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients()
        {
            var clients = await _context.Clients.FromSqlRaw("SELECT * FROM Clients").ToListAsync();
            return Ok(clients);
        }

        // GET: api/Clients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetClient(int id)
        {
            var client = await _context.Clients.FromSqlRaw("SELECT * FROM Clients WHERE Id = {0}", id).FirstOrDefaultAsync();

            if (client == null)
            {
                return NotFound();
            }

            return Ok(client);
        }

        // POST: api/Clients
        [HttpPost]
        public async Task<ActionResult<Client>> PostClient(Client client)
        {
            await _context.Database.ExecuteSqlRawAsync("INSERT INTO Clients (Name, ClientCode) VALUES ({0}, {1})", client.Name, client.ClientCode);
            return CreatedAtAction(nameof(GetClient), new { id = client.Id }, client);
        }

        // PUT: api/Clients/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClient(int id, Client client)
        {
            await _context.Database.ExecuteSqlRawAsync("UPDATE Clients SET Name = {0}, ClientCode = {1} WHERE Id = {2}", client.Name, client.ClientCode, id);
            return NoContent();
        }

        // DELETE: api/Clients/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Clients WHERE Id = {0}", id);
            return NoContent();
        }
    }
}
