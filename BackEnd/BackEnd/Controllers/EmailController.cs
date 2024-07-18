
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using MigraDoc.DocumentObjectModel;
using MigraDoc.Rendering;
using PdfSharp.Pdf;

namespace BackEnd.Controllers
{
    public class EmailController : Controller
    {
        private readonly EmailService _emailService;

        public EmailController()
        {
            // Use your SMTP server configuration
            _emailService = new EmailService("smtp.gmail.com", 587, "narib98jerry@gmail.com", "fdff upni wmzr caot");
        }

        [HttpPost("send-email")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest emailRequest)
        {
            byte[]? pdfData = null;
            string? attachmentName = null;

            // Generate PDF if body is provided
            if (!string.IsNullOrEmpty(emailRequest.Body))
            {
                pdfData = GeneratePdf(emailRequest.Body);
                attachmentName = "hello_world.pdf";
            }

            try
            {
                await _emailService.SendEmailAsync("engdesign@lotsinsights.com", emailRequest.To, emailRequest.Subject, emailRequest.Body, pdfData, attachmentName);
                return Ok("Email sent successfully!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to send email: {ex.Message}");
            }
        }

        private byte[] GeneratePdf(string title)
        {
            // Create a new MigraDoc document
            Document document = new Document();

            // Add a section to the document
            Section section = document.AddSection();

            // Add a paragraph with the title
            Paragraph paragraph = section.AddParagraph();
            paragraph.Format.Font.Size = 16;
            paragraph.Format.Font.Bold = true;
            paragraph.AddText(title);

            // Ensure the document has at least one page
            PdfDocumentRenderer pdfRenderer = new PdfDocumentRenderer();
            pdfRenderer.Document = document;

            // Render the PDF document to a MemoryStream
            MemoryStream stream = new MemoryStream();
            pdfRenderer.RenderDocument();
            pdfRenderer.PdfDocument.Save(stream, false);

            return stream.ToArray();
        }
    }
}
