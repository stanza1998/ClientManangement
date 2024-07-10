namespace BackEnd.Models
{
    public class Contact
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        // public ICollection<ClientContact> ClientContacts { get; set; }
    }
}
