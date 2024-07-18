using BackEnd.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace BackEnd.Context
{
    // DbContext class for interacting with the database
    public class ApplicationDbContext : DbContext
    {
        // Constructor that accepts DbContextOptions
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            // Constructor initializes the base DbContext with provided options
        }

        // DbSet properties for database entities
        public DbSet<Client> Clients { get; set; } // DbSet for Client entity
        public DbSet<Contact> Contacts { get; set; } // DbSet for Contact entity
        public DbSet<ClientContact> ClientContacts { get; set; } // DbSet for ClientContact entity
     public DbSet<User> Users { get; set; } //DbSet for system users

        // Method to configure the database model
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Override this method to configure how database entities are mapped
            // You can define entity configurations, relationships, indexes, etc. here
            // Example:
            // modelBuilder.Entity<Client>()
            //     .HasKey(c => c.ClientId);
            // modelBuilder.Entity<Client>()
            //     .Property(c => c.Name)
            //     .IsRequired();
            // modelBuilder.Entity<Client>()
            //     .HasMany(c => c.ClientContacts)
            //     .WithOne(cc => cc.Client)
            //     .HasForeignKey(cc => cc.ClientId);
        }
    }
}
