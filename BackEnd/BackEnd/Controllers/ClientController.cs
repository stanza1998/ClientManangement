using BackEnd.Context;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using System.Text.RegularExpressions;

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
        [HttpGet("get")]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients()
        {
            var clients = await _context.Clients.FromSqlRaw("SELECT * FROM Clients").ToListAsync();
            if (clients == null || !clients.Any())
            {
                return Ok("No client(s) found.");
            }
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
        [HttpPost("create")]
        public async Task<ActionResult<Client>> PostClient(Client client)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            client.ClientCode = GenerateClientCode(client.Name);

            var sql = "INSERT INTO Clients (Name, ClientCode) VALUES (@Name, @ClientCode); SELECT SCOPE_IDENTITY();";
            var parameters = new List<SqlParameter>
            {
                new SqlParameter("@Name", client.Name),
                new SqlParameter("@ClientCode", client.ClientCode)
            };

            try
            {
                var clientId = await _context.Database.ExecuteSqlRawAsync(sql, parameters.ToArray());

                var newClient = await _context.Clients.FindAsync(clientId);

                if (newClient == null)
                {
                    return BadRequest("Failed to retrieve newly created client.");
                }

                return CreatedAtAction(nameof(GetClient), new { id = newClient.Id }, newClient);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Database error occurred while inserting client.");
            }
        }

        // PUT: api/Clients/5
        [HttpPut("update/{id}")]
        public async Task<IActionResult> PutClient(int id, Client client)
        {
            await _context.Database.ExecuteSqlRawAsync("UPDATE Clients SET Name = {0}, ClientCode = {1} WHERE Id = {2}", client.Name, client.ClientCode, id);
            return NoContent();
        }

        // DELETE: api/Clients/5
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Clients WHERE Id = {0}", id);
            return NoContent();
        }

        private string GenerateClientCode(string name)
        {
            string prefix;

            if (name.Length < 3)
            {
                prefix = GenerateAlphaPrefix();
            }
            else
            {
                prefix = new string(name.Where(char.IsLetter).Take(3).ToArray()).ToUpper();
            }

            int nextNumber = GetNextClientCodeNumber(prefix);
            return $"{prefix}{nextNumber:D3}";
        }

        private string GenerateAlphaPrefix()
        {
            const string alphaPrefixStart = "AAA";
            var lastClient = _context.Clients
                                     .OrderByDescending(c => c.ClientCode)
                                     .FirstOrDefault(c => c.ClientCode.Length == 6 && Regex.IsMatch(c.ClientCode, @"^[A-Z]{3}\d{3}$"));

            if (lastClient == null) return alphaPrefixStart;

            var lastAlphaPart = lastClient.ClientCode.Substring(0, 3);
            var nextAlphaPart = IncrementAlphaPart(lastAlphaPart);
            return nextAlphaPart;
        }

        private string IncrementAlphaPart(string alphaPart)
        {
            char[] alphaChars = alphaPart.ToCharArray();
            for (int i = alphaChars.Length - 1; i >= 0; i--)
            {
                if (alphaChars[i] < 'Z')
                {
                    alphaChars[i]++;
                    break;
                }
                else
                {
                    alphaChars[i] = 'A';
                }
            }
            return new string(alphaChars);
        }

        private int GetNextClientCodeNumber(string prefix)
        {
            var lastClientWithPrefix = _context.Clients
                                               .Where(c => c.ClientCode.StartsWith(prefix))
                                               .OrderByDescending(c => c.ClientCode)
                                               .FirstOrDefault();

            if (lastClientWithPrefix == null) return 1;

            int lastNumber = int.Parse(lastClientWithPrefix.ClientCode.Substring(3, 3));
            return lastNumber + 1;
        }
    }
}
