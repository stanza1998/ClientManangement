using BackEnd.Context;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
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
                .FromSqlRaw("SELECT * FROM Contacts ORDER BY Name, Surname")
                .ToListAsync();

            // Return Ok with the list of contacts
            return Ok(contacts);
        }

        // GET: api/Contacts/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContact(int id)
        {
            // Retrieve contact by id from database
            var contact = await _context.Contacts
                .FromSqlRaw("SELECT * FROM Contacts WHERE Id = {0}", id)
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
            // Execute SQL command to insert new contact into database
            await _context.Database.ExecuteSqlRawAsync("INSERT INTO Contacts (Name, Surname, Email) VALUES ({0}, {1}, {2})", contact.Name, contact.Surname, contact.Email);

            // Return CreatedAtAction with route values and contact object
            return CreatedAtAction(nameof(GetContact), new { id = contact.Id }, contact);
        }

        // PUT: api/Contacts/update/{id}
        [HttpPut("update/{id}")]
        public async Task<IActionResult> PutContact(int id, Contact contact)
        {
            // Execute SQL command to update contact in database
            await _context.Database.ExecuteSqlRawAsync("UPDATE Contacts SET Name = {0}, Surname = {1}, Email = {2} WHERE Id = {3}", contact.Name, contact.Surname, contact.Email, id);

            // Return NoContent result
            return NoContent();
        }

        // DELETE: api/Contacts/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            // Execute SQL command to delete contact from database
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Contacts WHERE Id = {0}", id);

            // Return NoContent result
            return NoContent();
        }
    }
}
