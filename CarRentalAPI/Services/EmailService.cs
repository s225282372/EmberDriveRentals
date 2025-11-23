using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace CarRentalAPI.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
        Task SendBookingConfirmationAsync(string toEmail, string userName, string carName, DateTime startDate, DateTime endDate, decimal totalPrice);
        Task SendBookingStatusUpdateAsync(string toEmail, string userName, string carName, string status);
        Task SendWelcomeEmailAsync(string toEmail, string userName);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(_configuration["Email:From"]));
                email.To.Add(MailboxAddress.Parse(toEmail));
                email.Subject = subject;

                var builder = new BodyBuilder { HtmlBody = body };
                email.Body = builder.ToMessageBody();

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(
                    _configuration["Email:Host"],
                    int.Parse(_configuration["Email:Port"] ?? "587"),
                    SecureSocketOptions.StartTls
                );

                await smtp.AuthenticateAsync(
                    _configuration["Email:Username"],
                    _configuration["Email:Password"]
                );

                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                _logger.LogInformation($"Email sent to {toEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to send email to {toEmail}: {ex.Message}");
                // Don't throw - we don't want email failures to crash the application
            }
        }

        public async Task SendBookingConfirmationAsync(
            string toEmail,
            string userName,
            string carName,
            DateTime startDate,
            DateTime endDate,
            decimal totalPrice)
        {
            var subject = "Booking Confirmation - Car Rental";
            var body = $@"
                <html>
                <body style='font-family: Arial, sans-serif;'>
                    <h2 style='color: #2563eb;'>Booking Confirmed!</h2>
                    <p>Dear {userName},</p>
                    <p>Your booking has been confirmed. Here are the details:</p>
                    <div style='background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                        <p><strong>Car:</strong> {carName}</p>
                        <p><strong>Start Date:</strong> {startDate:MMMM dd, yyyy}</p>
                        <p><strong>End Date:</strong> {endDate:MMMM dd, yyyy}</p>
                        <p><strong>Total Price:</strong> ${totalPrice:F2}</p>
                    </div>
                    <p>Please arrive at the pickup location on time with a valid driver's license.</p>
                    <p>Thank you for choosing our service!</p>
                    <p style='color: #6b7280; margin-top: 30px;'>Best regards,<br>Car Rental Team</p>
                </body>
                </html>
            ";

            await SendEmailAsync(toEmail, subject, body);
        }

        public async Task SendBookingStatusUpdateAsync(
            string toEmail,
            string userName,
            string carName,
            string status)
        {
            var subject = $"Booking Status Update - {status}";
            var body = $@"
                <html>
                <body style='font-family: Arial, sans-serif;'>
                    <h2 style='color: #2563eb;'>Booking Status Updated</h2>
                    <p>Dear {userName},</p>
                    <p>Your booking for <strong>{carName}</strong> has been updated.</p>
                    <div style='background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                        <p><strong>New Status:</strong> <span style='color: #16a34a; font-weight: bold;'>{status}</span></p>
                    </div>
                    {(status == "Completed" ? "<p>We hope you enjoyed your ride! Please consider leaving a review.</p>" : "")}
                    {(status == "Cancelled" ? "<p>If you have any questions about this cancellation, please contact our support team.</p>" : "")}
                    <p style='color: #6b7280; margin-top: 30px;'>Best regards,<br>Car Rental Team</p>
                </body>
                </html>
            ";

            await SendEmailAsync(toEmail, subject, body);
        }

        public async Task SendWelcomeEmailAsync(string toEmail, string userName)
        {
            var subject = "Welcome to Car Rental!";
            var body = $@"
                <html>
                <body style='font-family: Arial, sans-serif;'>
                    <h2 style='color: #2563eb;'>Welcome to Car Rental!</h2>
                    <p>Dear {userName},</p>
                    <p>Thank you for registering with us. We're excited to have you on board!</p>
                    <div style='background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                        <p>With your account, you can:</p>
                        <ul>
                            <li>Browse our wide selection of vehicles</li>
                            <li>Make instant bookings</li>
                            <li>Track your rental history</li>
                            <li>Leave reviews and ratings</li>
                        </ul>
                    </div>
                    <p>Start exploring our cars and book your next adventure today!</p>
                    <p style='color: #6b7280; margin-top: 30px;'>Best regards,<br>Car Rental Team</p>
                </body>
                </html>
            ";

            await SendEmailAsync(toEmail, subject, body);
        }
    }
}