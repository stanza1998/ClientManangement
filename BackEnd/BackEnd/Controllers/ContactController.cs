using BackEnd.Context;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackEnd.Controllers
{
    // Controller for managing contacts
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Constructor injection of ApplicationDbContext for database access
        public ContactsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Contacts/get
        [HttpGet("get")]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
        {
            // Retrieve all contacts from database ordered by name and surname
            var contacts = await _context.Contacts
                .OrderBy(c => c.Name).ThenBy(c => c.Surname)
                .ToListAsync();

            // Return Ok with the list of contacts
            return Ok(contacts);
        }

        // GET: api/Contacts/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContact(int id)
        {
            // Retrieve contact by id from database using parameterized query
            var contact = await _context.Contacts
                .FromSqlInterpolated($"SELECT * FROM Contacts WHERE Id = {id}")
                .FirstOrDefaultAsync();

            // If contact not found, return NotFound result
            if (contact == null)
            {
                return NotFound();
            }

            // Return Ok with the contact
            return Ok(contact);
        }

        // POST: api/Contacts/create
        [HttpPost("create")]
        public async Task<ActionResult<Contact>> PostContact(Contact contact)
        {
            // Execute SQL command to insert new contact into database using parameterized query
            var sql = "INSERT INTO Contacts (Name, Surname, Email) VALUES (@Name, @Surname, @Email)";
            var parameters = new[]
            {
                new SqlParameter("@Name", contact.Name),
                new SqlParameter("@Surname", contact.Surname),
                new SqlParameter("@Email", contact.Email)
            };

            await _context.Database.ExecuteSqlRawAsync(sql, parameters);

            // Return CreatedAtAction with route values and contact object
            return CreatedAtAction(nameof(GetContact), new { id = contact.Id }, contact);
        }

        // PUT: api/Contacts/update/{id}
        [HttpPut("update/{id}")]
        public async Task<IActionResult> PutContact(int id, Contact contact)
        {
            // Execute SQL command to update contact in database using parameterized query
            var sql = "UPDATE Contacts SET Name = @Name, Surname = @Surname, Email = @Email WHERE Id = @Id";
            var parameters = new[]
            {
                new SqlParameter("@Name", contact.Name),
                new SqlParameter("@Surname", contact.Surname),
                new SqlParameter("@Email", contact.Email),
                new SqlParameter("@Id", id)
            };

            await _context.Database.ExecuteSqlRawAsync(sql, parameters);

            // Return NoContent result
            return NoContent();
        }

        // DELETE: api/Contacts/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            // Execute SQL command to delete contact from database using parameterized query
            var sql = "DELETE FROM Contacts WHERE Id = @Id";
            var parameter = new SqlParameter("@Id", id);

            await _context.Database.ExecuteSqlRawAsync(sql, parameter);

            // Return NoContent result
            return NoContent();
        }
    }
}
