using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using CarRentalAPI.Data;
using CarRentalAPI.DTOs;
using CarRentalAPI.Models;
using CarRentalAPI.Services;

namespace CarRentalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IJwtService _jwtService;
        private readonly IEmailService _emailService;

        public AuthController(
            ApplicationDbContext context,
            IJwtService jwtService,
            IEmailService emailService)
        {
            _context = context;
            _jwtService = jwtService;
            _emailService = emailService;
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return BadRequest(new { message = "Email is already registered" });
            }

            // Create new user
            var user = new User
            {
                FullName = registerDto.FullName,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Role = "Customer", // Default role
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Send welcome email (fire and forget - don't wait)
            _ = _emailService.SendWelcomeEmailAsync(user.Email, user.FullName);

            // Generate tokens
            var accessToken = _jwtService.GenerateAccessToken(user);
            var refreshToken = await CreateRefreshTokenAsync(user.UserId);

            var response = new AuthResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token,
                ExpiresIn = 900, // 15 minutes
                User = new UserDto
                {
                    UserId = user.UserId,
                    FullName = user.FullName,
                    Email = user.Email,
                    Role = user.Role
                }
            };

            return Ok(response);
        }

        /// <summary>
        /// Login with email and password
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
        {
            // Find user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Generate tokens
            var accessToken = _jwtService.GenerateAccessToken(user);
            var refreshToken = await CreateRefreshTokenAsync(user.UserId);

            var response = new AuthResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token,
                ExpiresIn = 900, // 15 minutes
                User = new UserDto
                {
                    UserId = user.UserId,
                    FullName = user.FullName,
                    Email = user.Email,
                    Role = user.Role
                }
            };

            return Ok(response);
        }

        /// <summary>
        /// Refresh access token using refresh token
        /// </summary>
        [HttpPost("refresh")]
        public async Task<ActionResult<AuthResponseDto>> Refresh(RefreshTokenRequestDto request)
        {
            var refreshToken = await _context.RefreshTokens
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Token == request.RefreshToken);

            if (refreshToken == null)
            {
                return Unauthorized(new { message = "Invalid refresh token" });
            }

            if (!refreshToken.IsActive)
            {
                return Unauthorized(new { message = "Refresh token is expired or revoked" });
            }

            // Generate new tokens
            var newAccessToken = _jwtService.GenerateAccessToken(refreshToken.User);
            var newRefreshToken = await CreateRefreshTokenAsync(refreshToken.UserId);

            // Revoke old refresh token (token rotation)
            refreshToken.IsRevoked = true;
            refreshToken.RevokedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var response = new AuthResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken.Token,
                ExpiresIn = 900,
                User = new UserDto
                {
                    UserId = refreshToken.User.UserId,
                    FullName = refreshToken.User.FullName,
                    Email = refreshToken.User.Email,
                    Role = refreshToken.User.Role
                }
            };

            return Ok(response);
        }

        /// <summary>
        /// Revoke a specific refresh token (logout)
        /// </summary>
        [HttpPost("revoke")]
        [Authorize]
        public async Task<IActionResult> Revoke(RefreshTokenRequestDto request)
        {
            var currentUserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var refreshToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(r => r.Token == request.RefreshToken && r.UserId == currentUserId);

            if (refreshToken == null)
            {
                return NotFound(new { message = "Refresh token not found" });
            }

            refreshToken.IsRevoked = true;
            refreshToken.RevokedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Refresh token revoked successfully" });
        }

        /// <summary>
        /// Revoke all refresh tokens for the current user (logout from all devices)
        /// </summary>
        [HttpPost("revoke-all")]
        [Authorize]
        public async Task<IActionResult> RevokeAll()
        {
            var currentUserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var userTokens = await _context.RefreshTokens
                .Where(r => r.UserId == currentUserId && !r.IsRevoked)
                .ToListAsync();

            foreach (var token in userTokens)
            {
                token.IsRevoked = true;
                token.RevokedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = $"{userTokens.Count} refresh token(s) revoked successfully" });
        }

        /// <summary>
        /// Get all active sessions for the current user
        /// </summary>
        [HttpGet("sessions")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ActiveSessionDto>>> GetActiveSessions()
        {
            var currentUserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var currentTokenJti = User.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;

            var activeSessions = await _context.RefreshTokens
                .Where(r => r.UserId == currentUserId && r.IsActive)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ActiveSessionDto
                {
                    Id = r.Id,
                    DeviceInfo = r.DeviceInfo ?? "Unknown Device",
                    IpAddress = r.IpAddress ?? "Unknown",
                    CreatedAt = r.CreatedAt,
                    ExpiresAt = r.ExpiresAt,
                    IsCurrentSession = false // Will be updated below
                })
                .ToListAsync();

            return Ok(activeSessions);
        }

        /// <summary>
        /// Revoke a specific session by ID
        /// </summary>
        [HttpDelete("sessions/{sessionId}")]
        [Authorize]
        public async Task<IActionResult> RevokeSession(Guid sessionId)
        {
            var currentUserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var session = await _context.RefreshTokens
                .FirstOrDefaultAsync(r => r.Id == sessionId && r.UserId == currentUserId);

            if (session == null)
            {
                return NotFound(new { message = "Session not found" });
            }

            session.IsRevoked = true;
            session.RevokedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Session revoked successfully" });
        }

        // Private helper method
        private async Task<RefreshToken> CreateRefreshTokenAsync(Guid userId)
        {
            var refreshToken = new RefreshToken
            {
                UserId = userId,
                Token = _jwtService.GenerateRefreshToken(),
                ExpiresAt = DateTime.UtcNow.AddDays(7), // 7 days
                CreatedAt = DateTime.UtcNow,
                DeviceInfo = Request.Headers["User-Agent"].ToString(),
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
            };

            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();

            return refreshToken;
        }
    }
}

