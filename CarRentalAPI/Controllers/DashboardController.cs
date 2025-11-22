using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarRentalAPI.Data;

namespace CarRentalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get comprehensive dashboard statistics
        /// </summary>
        [HttpGet("statistics")]
        public async Task<ActionResult> GetDashboardStatistics()
        {
            // User Statistics
            var totalUsers = await _context.Users.CountAsync();
            var totalCustomers = await _context.Users.CountAsync(u => u.Role == "Customer");
            var totalAdmins = await _context.Users.CountAsync(u => u.Role == "Admin");
            var newUsersThisMonth = await _context.Users
                .CountAsync(u => u.CreatedAt.Month == DateTime.UtcNow.Month
                    && u.CreatedAt.Year == DateTime.UtcNow.Year);

            // Car Statistics
            var totalCars = await _context.Cars.CountAsync();
            var availableCars = await _context.Cars.CountAsync(c => c.Status == "Available");
            var maintenanceCars = await _context.Cars.CountAsync(c => c.Status == "Maintenance");
            var unavailableCars = await _context.Cars.CountAsync(c => c.Status == "Unavailable");

            // Booking Statistics
            var totalBookings = await _context.Bookings.CountAsync();
            var pendingBookings = await _context.Bookings.CountAsync(b => b.Status == "Pending");
            var confirmedBookings = await _context.Bookings.CountAsync(b => b.Status == "Confirmed");
            var completedBookings = await _context.Bookings.CountAsync(b => b.Status == "Completed");
            var cancelledBookings = await _context.Bookings.CountAsync(b => b.Status == "Cancelled");
            var activeBookings = await _context.Bookings
                .CountAsync(b => b.Status == "Confirmed"
                    && b.StartDate <= DateTime.UtcNow
                    && b.EndDate >= DateTime.UtcNow);

            // Revenue Statistics
            var totalRevenue = await _context.Bookings
                .Where(b => b.Status == "Completed")
                .SumAsync(b => b.TotalPrice);

            var revenueThisMonth = await _context.Bookings
                .Where(b => b.Status == "Completed"
                    && b.CreatedAt.Month == DateTime.UtcNow.Month
                    && b.CreatedAt.Year == DateTime.UtcNow.Year)
                .SumAsync(b => b.TotalPrice);

            var revenueLastMonth = await _context.Bookings
                .Where(b => b.Status == "Completed"
                    && b.CreatedAt.Month == DateTime.UtcNow.AddMonths(-1).Month
                    && b.CreatedAt.Year == DateTime.UtcNow.AddMonths(-1).Year)
                .SumAsync(b => b.TotalPrice);

            // Damage Reports Statistics
            var totalDamageReports = await _context.DamageReports.CountAsync();
            var pendingDamageReports = await _context.DamageReports.CountAsync(d => d.Status == "Pending");
            var resolvedDamageReports = await _context.DamageReports.CountAsync(d => d.Status == "Resolved");

            // Reviews Statistics
            var totalReviews = await _context.Reviews.CountAsync();
            var pendingReviews = await _context.Reviews.CountAsync(r => r.Status == "Pending");
            var approvedReviews = await _context.Reviews.CountAsync(r => r.Status == "Approved");
            var rejectedReviews = await _context.Reviews.CountAsync(r => r.Status == "Rejected");
            var averageRating = await _context.Reviews
                .Where(r => r.Status == "Approved")
                .AverageAsync(r => (double?)r.Rating) ?? 0.0;

            // Maintenance Statistics
            var totalMaintenanceRecords = await _context.MaintenanceRecords.CountAsync();
            var dueMaintenanceRecords = await _context.MaintenanceRecords.CountAsync(m => m.Status == "Due");
            var completedMaintenanceRecords = await _context.MaintenanceRecords.CountAsync(m => m.Status == "Completed");
            var overdueMaintenanceRecords = await _context.MaintenanceRecords
                .CountAsync(m => m.Status == "Due" && m.Date < DateTime.UtcNow);

            // Recent Activity
            var recentBookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Car)
                .OrderByDescending(b => b.CreatedAt)
                .Take(5)
                .Select(b => new
                {
                    bookingId = b.BookingId,
                    userName = b.User.FullName,
                    carName = $"{b.Car.Make} {b.Car.Model}",
                    status = b.Status,
                    totalPrice = b.TotalPrice,
                    createdAt = b.CreatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                users = new
                {
                    total = totalUsers,
                    customers = totalCustomers,
                    admins = totalAdmins,
                    newThisMonth = newUsersThisMonth
                },
                cars = new
                {
                    total = totalCars,
                    available = availableCars,
                    maintenance = maintenanceCars,
                    unavailable = unavailableCars
                },
                bookings = new
                {
                    total = totalBookings,
                    pending = pendingBookings,
                    confirmed = confirmedBookings,
                    completed = completedBookings,
                    cancelled = cancelledBookings,
                    active = activeBookings
                },
                revenue = new
                {
                    total = totalRevenue,
                    thisMonth = revenueThisMonth,
                    lastMonth = revenueLastMonth,
                    growth = revenueLastMonth > 0
                        ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
                        : 0
                },
                damageReports = new
                {
                    total = totalDamageReports,
                    pending = pendingDamageReports,
                    resolved = resolvedDamageReports
                },
                reviews = new
                {
                    total = totalReviews,
                    pending = pendingReviews,
                    approved = approvedReviews,
                    rejected = rejectedReviews,
                    averageRating = Math.Round(averageRating, 2)
                },
                maintenance = new
                {
                    total = totalMaintenanceRecords,
                    due = dueMaintenanceRecords,
                    completed = completedMaintenanceRecords,
                    overdue = overdueMaintenanceRecords
                },
                recentActivity = recentBookings
            });
        }

        /// <summary>
        /// Get revenue chart data (monthly breakdown for the last 12 months)
        /// </summary>
        [HttpGet("revenue-chart")]
        public async Task<ActionResult> GetRevenueChart()
        {
            var now = DateTime.UtcNow;
            var monthlyRevenue = new List<object>();

            for (int i = 11; i >= 0; i--)
            {
                var targetDate = now.AddMonths(-i);
                var revenue = await _context.Bookings
                    .Where(b => b.Status == "Completed"
                        && b.CreatedAt.Month == targetDate.Month
                        && b.CreatedAt.Year == targetDate.Year)
                    .SumAsync(b => b.TotalPrice);

                monthlyRevenue.Add(new
                {
                    month = targetDate.ToString("MMM yyyy"),
                    revenue = revenue
                });
            }

            return Ok(monthlyRevenue);
        }

        /// <summary>
        /// Get bookings chart data (monthly breakdown for the last 12 months)
        /// </summary>
        [HttpGet("bookings-chart")]
        public async Task<ActionResult> GetBookingsChart()
        {
            var now = DateTime.UtcNow;
            var monthlyBookings = new List<object>();

            for (int i = 11; i >= 0; i--)
            {
                var targetDate = now.AddMonths(-i);
                var bookings = await _context.Bookings
                    .Where(b => b.CreatedAt.Month == targetDate.Month
                        && b.CreatedAt.Year == targetDate.Year)
                    .CountAsync();

                monthlyBookings.Add(new
                {
                    month = targetDate.ToString("MMM yyyy"),
                    bookings = bookings
                });
            }

            return Ok(monthlyBookings);
        }

        /// <summary>
        /// Get top performing cars (by booking count)
        /// </summary>
        [HttpGet("top-cars")]
        public async Task<ActionResult> GetTopCars([FromQuery] int limit = 5)
        {
            var topCars = await _context.Bookings
                .Include(b => b.Car)
                .GroupBy(b => new { b.CarId, b.Car.Make, b.Car.Model, b.Car.Year })
                .Select(g => new
                {
                    carId = g.Key.CarId,
                    carName = $"{g.Key.Make} {g.Key.Model} {g.Key.Year}",
                    bookingCount = g.Count(),
                    totalRevenue = g.Where(b => b.Status == "Completed").Sum(b => b.TotalPrice)
                })
                .OrderByDescending(c => c.bookingCount)
                .Take(limit)
                .ToListAsync();

            return Ok(topCars);
        }

        /// <summary>
        /// Get recent alerts and notifications
        /// </summary>
        [HttpGet("alerts")]
        public async Task<ActionResult> GetAlerts()
        {
            var alerts = new List<object>();

            // Pending bookings
            var pendingBookingsCount = await _context.Bookings.CountAsync(b => b.Status == "Pending");
            if (pendingBookingsCount > 0)
            {
                alerts.Add(new
                {
                    type = "bookings",
                    severity = "info",
                    message = $"{pendingBookingsCount} pending booking(s) require confirmation",
                    count = pendingBookingsCount
                });
            }

            // Pending damage reports
            var pendingDamageCount = await _context.DamageReports.CountAsync(d => d.Status == "Pending");
            if (pendingDamageCount > 0)
            {
                alerts.Add(new
                {
                    type = "damage",
                    severity = "warning",
                    message = $"{pendingDamageCount} damage report(s) need attention",
                    count = pendingDamageCount
                });
            }

            // Pending reviews
            var pendingReviewsCount = await _context.Reviews.CountAsync(r => r.Status == "Pending");
            if (pendingReviewsCount > 0)
            {
                alerts.Add(new
                {
                    type = "reviews",
                    severity = "info",
                    message = $"{pendingReviewsCount} review(s) awaiting approval",
                    count = pendingReviewsCount
                });
            }

            // Overdue maintenance
            var overdueMaintenanceCount = await _context.MaintenanceRecords
                .CountAsync(m => m.Status == "Due" && m.Date < DateTime.UtcNow);
            if (overdueMaintenanceCount > 0)
            {
                alerts.Add(new
                {
                    type = "maintenance",
                    severity = "error",
                    message = $"{overdueMaintenanceCount} overdue maintenance record(s)",
                    count = overdueMaintenanceCount
                });
            }

            // Upcoming maintenance (next 7 days)
            var upcomingMaintenanceCount = await _context.MaintenanceRecords
                .CountAsync(m => m.Status == "Due"
                    && m.Date >= DateTime.UtcNow
                    && m.Date <= DateTime.UtcNow.AddDays(7));
            if (upcomingMaintenanceCount > 0)
            {
                alerts.Add(new
                {
                    type = "maintenance",
                    severity = "warning",
                    message = $"{upcomingMaintenanceCount} maintenance task(s) due in the next 7 days",
                    count = upcomingMaintenanceCount
                });
            }

            return Ok(alerts);
        }
    }
}