using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    // Model representing a contact
    public class Contact
    {
        // Primary key for the contact
        public int Id { get; set; }

        // Required name of the contact
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        // Required surname of the contact
        [Required(ErrorMessage = "Surname is required")]
        public string Surname { get; set; }

        // Required and validated email address of the contact
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }
    }
}
