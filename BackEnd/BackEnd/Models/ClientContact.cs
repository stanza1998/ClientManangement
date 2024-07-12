using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models
{
    // Model representing a link between a Client and a Contact
    public class ClientContact
    {
        // Primary key for the ClientContact entity
        [Key]
        public int Id { get; set; }

        // Foreign key to reference the Client entity
        [Required(ErrorMessage = "ClientId is required")]
        public int ClientId { get; set; }

        // Navigation property to access the related Client entity
        [ForeignKey("ClientId")]
        public Client Client { get; set; }

        // Foreign key to reference the Contact entity
        [Required(ErrorMessage = "ContactId is required")]
        public int ContactId { get; set; }

        // Navigation property to access the related Contact entity
        [ForeignKey("ContactId")]
        public Contact Contact { get; set; }
    }
}
