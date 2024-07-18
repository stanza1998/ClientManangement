using BackEnd.Context;
using BackEnd.Dtos;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Crypto.Generators;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var user = new User { Email = dto.Email, PasswordHash = passwordHash, FullName = dto.FullName };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok();
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized();

            user.IsLoggedIn = true; // Set IsLoggedIn to true
            await _context.SaveChangesAsync(); // Save changes to the database

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, user.Email) }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new { Token = tokenHandler.WriteToken(token) });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] string email)
        {
            try
            {
                // Validate the input email
                if (string.IsNullOrWhiteSpace(email))
                    return BadRequest("Email is required.");

                // Update IsLoggedIn to false using raw SQL query
                var updateQuery = "UPDATE Users SET IsLoggedIn = 0 WHERE Email = {0}";
                var affectedRows = await _context.Database.ExecuteSqlRawAsync(updateQuery, email);

                if (affectedRows == 0)
                    return NotFound("User not found.");

                return Ok();
            }
            catch (Exception ex)
            {
                // Log the exception for debugging
                Console.WriteLine($"Exception: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpPost("validate-token")]
        public IActionResult ValidateToken([FromBody] string email)
        {
            try
            {
                // Log the email being checked
                Console.WriteLine($"Checking IsLoggedIn status for email: {email}");

                // Use raw SQL query to check IsLoggedIn status
                var isLoggedIn = _context.Users
                                         .FromSqlRaw("SELECT IsLoggedIn FROM Users WHERE Email = {0}", email)
                                         .Select(u => u.IsLoggedIn)
                                         .FirstOrDefault();

                // Log the result
                Console.WriteLine($"IsLoggedIn status: {isLoggedIn}");

                return Ok(isLoggedIn);
            }
            catch (Exception ex)
            {
                // Log the exception for debugging
                Console.WriteLine($"Exception: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }







    }
}
