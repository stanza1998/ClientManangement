using System;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

public class EmailService
{
    private readonly SmtpClient _smtpClient;

    public EmailService(string host, int port, string username, string password)
    {
        _smtpClient = new SmtpClient(host, port)
        {
            Credentials = new NetworkCredential(username, password),
            EnableSsl = true
        };
    }

    public async Task SendEmailAsync(string from, string to, string subject, string body, byte[]? attachmentData = null, string? attachmentName = null)
    {
        var mailMessage = new MailMessage(from, to, subject, body)
        {
            IsBodyHtml = true
        };

        // Add attachment if provided
        if (attachmentData != null && attachmentData.Length > 0 && !string.IsNullOrEmpty(attachmentName))
        {
            var attachment = new Attachment(new MemoryStream(attachmentData), attachmentName, "application/pdf");
            mailMessage.Attachments.Add(attachment);
        }

        try
        {
            await _smtpClient.SendMailAsync(mailMessage);
        }
        catch (Exception ex)
        {
            // Handle or log the exception
            throw new ApplicationException($"Failed to send email: {ex.Message}", ex);
        }
        finally
        {
            // Dispose attachments to release resources
            if (mailMessage.Attachments != null)
            {
                foreach (var attachment in mailMessage.Attachments)
                {
                    attachment.Dispose();
                }
            }

            mailMessage.Dispose();
        }
    }
}
