using BackEnd.Context;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ContactsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Contacts
        [HttpGet("get")]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
        {
            var contacts = await _context.Contacts.FromSqlRaw("SELECT * FROM Contacts ORDER BY Name, Surname").ToListAsync();
            return Ok(contacts);
        }


        // GET: api/Contacts/5
        [HttpGet("{id}")]

        public async Task<ActionResult<Contact>> GetContact(int id)
        {
            var contact = await _context.Contacts.FromSqlRaw("SELECT * FROM Contacts WHERE Id = {0}", id).FirstOrDefaultAsync();

            if (contact == null)
            {
                return NotFound();
            }

            return Ok(contact);
        }

        // POST: api/Contacts
        [HttpPost("create")]
        public async Task<ActionResult<Contact>> PostContact(Contact contact)
        {
            await _context.Database.ExecuteSqlRawAsync("INSERT INTO Contacts (Name, Surname, Email) VALUES ({0}, {1}, {2})", contact.Name, contact.Surname, contact.Email);
            return CreatedAtAction(nameof(GetContact), new { id = contact.Id }, contact);
        }

        // PUT: api/Contacts/5
        [HttpPut("update/{id}")]
        public async Task<IActionResult> PutContact(int id, Contact contact)
        {
            await _context.Database.ExecuteSqlRawAsync("UPDATE Contacts SET Name = {0}, Surname = {1}, Email = {2} WHERE Id = {3}", contact.Name, contact.Surname, contact.Email, id);
            return NoContent();
        }

        // DELETE: api/Contacts/5
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Contacts WHERE Id = {0}", id);
            return NoContent();
        }
    }
}
