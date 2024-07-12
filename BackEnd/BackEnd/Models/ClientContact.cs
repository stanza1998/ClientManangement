using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models
{
    public class ClientContact
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "ClientId is required")]
        public int ClientId { get; set; }

        [ForeignKey("ClientId")]
        public Client Client { get; set; }

        [Required(ErrorMessage = "ContactId is required")]
        public int ContactId { get; set; }

        [ForeignKey("ContactId")]
        public Contact Contact { get; set; }
    }

}
