using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FormValidationController : Controller
    {
        // POST: api/Validation/ValidateClient
        [HttpPost("ValidateClient")]
        public IActionResult ValidateClient([FromBody] Client client)
        {
            if (client == null)
            {
                return BadRequest("Client data is required.");
            }

            var validationContext = new ValidationContext(client);
            var validationResults = new List<ValidationResult>();
            bool isValid = Validator.TryValidateObject(client, validationContext, validationResults, true);

            if (!isValid)
            {
                var errors = new Dictionary<string, string>();
                foreach (var validationResult in validationResults)
                {
                    var memberNames = validationResult.MemberNames;
                    foreach (var memberName in memberNames)
                    {
                        errors[memberName] = validationResult.ErrorMessage;
                    }
                }
                return BadRequest(errors);
            }

            return Ok("Client details are valid.");
        }

        [HttpPost("ValidateContact")]
        public IActionResult ValidateContact([FromBody] Contact contact)
        {
            if (contact == null)
            {
                return BadRequest("Contact data is required.");
            }

            var validationContext = new ValidationContext(contact);
            var validationResults = new List<ValidationResult>();
            bool isValid = Validator.TryValidateObject(contact, validationContext, validationResults, true);

            if (!isValid)
            {
                var errors = new Dictionary<string, string>();
                foreach (var validationResult in validationResults)
                {
                    var memberNames = validationResult.MemberNames;
                    foreach (var memberName in memberNames)
                    {
                        errors[memberName] = validationResult.ErrorMessage;
                    }
                }
                return BadRequest(errors);
            }

            return Ok("Contact details are valid.");
        }

    }
}
