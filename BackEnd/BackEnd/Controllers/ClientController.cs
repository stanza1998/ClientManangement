using BackEnd.Context;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace BackEnd.Controllers
{
    // Controller for managing clients
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Constructor injection of ApplicationDbContext for database access
        public ClientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Clients/get
        [HttpGet("get")]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients()
        {
            // Retrieve all clients from database ordered by name
            var clients = await _context.Clients.FromSqlRaw("SELECT * FROM Clients ORDER BY Name ASC").ToListAsync();

            // If no clients found, return Ok with a message
            if (clients == null || !clients.Any())
            {
                return Ok("No client(s) found.");
            }

            // Return Ok with the list of clients
            return Ok(clients);
        }

        // GET: api/Clients/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetClient(int id)
        {
            // Retrieve client by id from database
            var client = await _context.Clients.FromSqlRaw("SELECT * FROM Clients WHERE Id = {0}", id).FirstOrDefaultAsync();

            // If client not found, return NotFound result
            if (client == null)
            {
                return NotFound();
            }

            // Return Ok with the client
            return Ok(client);
        }

        // POST: api/Clients/create
        [HttpPost("create")]
        public async Task<ActionResult<Client>> PostClient(Client client)
        {
            // Validate the client model
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Generate client code based on client name
            client.ClientCode = GenerateClientCode(client.Name);

            // SQL query to insert client into database and retrieve its generated Id
            var sql = "INSERT INTO Clients (Name, ClientCode) VALUES (@Name, @ClientCode); SELECT SCOPE_IDENTITY();";
            var parameters = new List<SqlParameter>
            {
                new SqlParameter("@Name", client.Name),
                new SqlParameter("@ClientCode", client.ClientCode)
            };

            try
            {
                // Execute SQL command asynchronously
                var clientId = await _context.Database.ExecuteSqlRawAsync(sql, parameters.ToArray());

                // Retrieve newly created client from database
                var newClient = await _context.Clients.FindAsync(clientId);

                // If new client not found, return BadRequest with message
                if (newClient == null)
                {
                    return BadRequest("Failed to retrieve newly created client.");
                }

                // Return CreatedAtAction with route values and new client object
                return CreatedAtAction(nameof(GetClient), new { id = newClient.Id }, newClient);
            }
            catch (Exception)
            {
                // Return StatusCode 500 with error message for database error
                return StatusCode(StatusCodes.Status500InternalServerError, "Database error occurred while inserting client.");
            }
        }

        // PUT: api/Clients/update/{id}
        [HttpPut("update/{id}")]
        public async Task<IActionResult> PutClient(int id, Client client)
        {
            // Execute SQL command to update client in database
            await _context.Database.ExecuteSqlRawAsync("UPDATE Clients SET Name = {0}, ClientCode = {1} WHERE Id = {2}", client.Name, client.ClientCode, id);

            // Return NoContent result
            return NoContent();
        }

        // DELETE: api/Clients/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            // Execute SQL command to delete client from database
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Clients WHERE Id = {0}", id);

            // Return NoContent result
            return NoContent();
        }

        // Method to generate client code based on client name
        private string GenerateClientCode(string name)
        {
            string prefix;

            // Determine prefix based on client name length
            if (name.Length < 3)
            {
                prefix = GenerateAlphaPrefix(); // Generate alpha prefix for short names
            }
            else
            {
                prefix = new string(name.Where(char.IsLetter).Take(3).ToArray()).ToUpper(); // Use first three letters as prefix
            }

            // Get next available number for client code prefix
            int nextNumber = GetNextClientCodeNumber(prefix);

            // Format client code as prefix followed by number
            return $"{prefix}{nextNumber:D3}";
        }

        // Method to generate alphabetical prefix for short client names
        private string GenerateAlphaPrefix()
        {
            const string alphaPrefixStart = "AAA"; // Starting value for alpha prefix
            var lastClient = _context.Clients
                                     .OrderByDescending(c => c.ClientCode)
                                     .FirstOrDefault(c => c.ClientCode.Length == 6 && Regex.IsMatch(c.ClientCode, @"^[A-Z]{3}\d{3}$"));

            // If no clients found, return start value
            if (lastClient == null) return alphaPrefixStart;

            // Increment alpha part of last client code
            var lastAlphaPart = lastClient.ClientCode.Substring(0, 3);
            var nextAlphaPart = IncrementAlphaPart(lastAlphaPart);
            return nextAlphaPart;
        }

        // Method to increment alphabetical part of client code
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

        // Method to get next available number for client code prefix
        private int GetNextClientCodeNumber(string prefix)
        {
            var lastClientWithPrefix = _context.Clients
                                               .Where(c => c.ClientCode.StartsWith(prefix))
                                               .OrderByDescending(c => c.ClientCode)
                                               .FirstOrDefault();

            // If no clients found with prefix, start at 1
            if (lastClientWithPrefix == null) return 1;

            // Get last number in client code and increment
            int lastNumber = int.Parse(lastClientWithPrefix.ClientCode.Substring(3, 3));
            return lastNumber + 1;
        }
    }
}
