using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FormValidationController : ControllerBase
    {
        // POST: api/FormValidation/ValidateClient
        [HttpPost("ValidateClient")]
        public IActionResult ValidateClient([FromBody] Client client)
        {
            // Check if client object is null
            if (client == null)
            {
                return BadRequest("Client data is required.");
            }

            // Validate client object using data annotations
            var validationContext = new ValidationContext(client);
            var validationResults = new List<ValidationResult>();
            bool isValid = Validator.TryValidateObject(client, validationContext, validationResults, true);

            // If client object is not valid, return BadRequest with validation errors
            if (!isValid)
            {
                var errors = new Dictionary<string, string>();
                foreach (var validationResult in validationResults)
                {
                    foreach (var memberName in validationResult.MemberNames)
                    {
                        errors[memberName] = validationResult.ErrorMessage;
                    }
                }
                return BadRequest(errors);
            }

            // Return Ok if client details are valid
            return Ok("Client details are valid.");
        }

        // POST: api/FormValidation/ValidateContact
        [HttpPost("ValidateContact")]
        public IActionResult ValidateContact([FromBody] Contact contact)
        {
            // Check if contact object is null
            if (contact == null)
            {
                return BadRequest("Contact data is required.");
            }

            // Validate contact object using data annotations
            var validationContext = new ValidationContext(contact);
            var validationResults = new List<ValidationResult>();
            bool isValid = Validator.TryValidateObject(contact, validationContext, validationResults, true);

            // If contact object is not valid, return BadRequest with validation errors
            if (!isValid)
            {
                var errors = new Dictionary<string, string>();
                foreach (var validationResult in validationResults)
                {
                    foreach (var memberName in validationResult.MemberNames)
                    {
                        errors[memberName] = validationResult.ErrorMessage;
                    }
                }
                return BadRequest(errors);
            }

            // Return Ok if contact details are valid
            return Ok("Contact details are valid.");
        }
    }
}
