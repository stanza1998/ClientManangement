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
            // Use parameterized query to retrieve clients ordered by name
            var clients = await _context.Clients
                                        .FromSqlInterpolated($"SELECT * FROM Clients ORDER BY Name ASC")
                                        .ToListAsync();

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
            // Use parameterized query to retrieve client by id
            var client = await _context.Clients
                                       .FromSqlInterpolated($"SELECT * FROM Clients WHERE Id = {id}")
                                       .FirstOrDefaultAsync();

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
            // Execute SQL command to update client in database using parameterized query
            await _context.Database.ExecuteSqlRawAsync("UPDATE Clients SET Name = {0}, ClientCode = {1} WHERE Id = {2}", client.Name, client.ClientCode, id);

            // Return NoContent result
            return NoContent();
        }


        // DELETE: api/Clients/delete/{id}
   [HttpDelete("delete/{id}")]
public async Task<IActionResult> DeleteClient(int id)
{
    // Execute SQL command to delete client from database using parameterized query
    await _context.Database.ExecuteSqlRawAsync("DELETE FROM Clients WHERE Id = {0}", id);

    // Return NoContent result
    return NoContent();
}


        private string GenerateClientCode(string name)
        {
            // Determine the prefix based on the name length and structure
            string prefix;
            if (string.IsNullOrEmpty(name))
            {
                prefix = "AAA"; // Default prefix if name is empty
            }
            else if (name.Length < 3)
            {
                // Generate alpha prefix for short names
                prefix = GenerateAlphaPrefix(name);
            }
            else
            {
                // Use the first three letters of the name as prefix
                prefix = new string(name.Where(char.IsLetter).Take(3).ToArray()).ToUpper();
            }

            // Get the next available number for client code prefix
            int nextNumber = GetNextClientCodeNumber(prefix);

            // Format client code as prefix followed by number
            return $"{prefix}{nextNumber:D3}";
        }

        // Method to generate alphabetical prefix for short client names
        private string GenerateAlphaPrefix(string clientName)
        {
            const string defaultPrefix = "AAA"; // Default starting value for alpha prefix

            // Remove extra spaces and split the client name into words
            string[] words = clientName.Trim().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

            string alphaPart;
            if (words.Length == 3)
            {
                // Use the first letter of each word if there are exactly 3 words
                alphaPart = $"{Char.ToUpper(words[0][0])}{Char.ToUpper(words[1][0])}{Char.ToUpper(words[2][0])}";
            }
            else if (words.Length == 2)
            {
                // Use the first character of the first word, the first character of the second word, and the second character of the first word
                alphaPart = $"{Char.ToUpper(words[0][0])}{Char.ToUpper(words[1][0])}{Char.ToUpper(words[0].Length > 1 ? words[0][1] : 'A')}";
            }
            else if (words.Length == 1)
            {
                // Use the first three characters of the word if there is only 1 word
                alphaPart = words[0].Length >= 3 ? words[0].Substring(0, 3).ToUpper() : words[0].ToUpper().PadRight(3, 'A');
            }
            else
            {
                // Use three placeholders if no valid words are provided
                alphaPart = defaultPrefix;
            }

            // Ensure alpha part is exactly three characters long, otherwise pad with 'A'
            if (alphaPart.Length < 3)
            {
                alphaPart = alphaPart.PadRight(3, 'A');
            }
            else if (alphaPart.Length > 3)
            {
                alphaPart = alphaPart.Substring(0, 3); // Trim to three characters if longer
            }

            return alphaPart;
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


    }
}
