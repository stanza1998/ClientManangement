using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class Client
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters")]
        public string Name { get; set; }

        [RegularExpression(@"^[A-Za-z0-9]+$", ErrorMessage = "Client code must only contain letters and numbers")]
        public string ClientCode { get; set; }
    }
}
