using BackEnd.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace BackEnd.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Contact> Contacts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Client>()
                .HasIndex(c => c.ClientCode)
                .IsUnique();

            modelBuilder.Entity<Client>()
                .Property(c => c.ClientCode)
                .HasDefaultValueSql("NEWID()");

            modelBuilder.Entity<Contact>()
                .HasIndex(c => c.Email)
                .IsUnique();

            modelBuilder.Entity<Client>()
                .HasMany(c => c.Contacts)
                .WithMany(c => c.Clients)
                .UsingEntity<Dictionary<string, object>>(
                    "ClientContact",
                    r => r.HasOne<Contact>().WithMany().HasForeignKey("ContactId"),
                    l => l.HasOne<Client>().WithMany().HasForeignKey("ClientId"));
        }
    }

}
