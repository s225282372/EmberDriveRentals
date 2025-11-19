using Microsoft.EntityFrameworkCore;
using CarRentalAPI.Models;

namespace CarRentalAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<DamageReport> DamageReports { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<MaintenanceRecord> MaintenanceRecords { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configurations
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Car configurations
            modelBuilder.Entity<Car>(entity =>
            {
                entity.HasIndex(e => e.Status);
            });

            // Booking configurations
            modelBuilder.Entity<Booking>(entity =>
            {
                entity.HasIndex(e => new { e.CarId, e.StartDate, e.EndDate, e.Status });

                entity.HasOne(b => b.User)
                    .WithMany(u => u.Bookings)
                    .HasForeignKey(b => b.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(b => b.Car)
                    .WithMany(c => c.Bookings)
                    .HasForeignKey(b => b.CarId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // DamageReport configurations
            modelBuilder.Entity<DamageReport>(entity =>
            {
                entity.HasOne(d => d.Booking)
                    .WithMany(b => b.DamageReports)
                    .HasForeignKey(d => d.BookingId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Review configurations
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasIndex(e => e.BookingId).IsUnique();

                entity.HasOne(r => r.Booking)
                    .WithOne(b => b.Review)
                    .HasForeignKey<Review>(r => r.BookingId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // MaintenanceRecord configurations
            modelBuilder.Entity<MaintenanceRecord>(entity =>
            {
                entity.HasOne(m => m.Car)
                    .WithMany(c => c.MaintenanceRecords)
                    .HasForeignKey(m => m.CarId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Seed initial admin user
            var adminId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserId = adminId,
                    FullName = "System Administrator",
                    Email = "admin@carrental.com",
                    // Password: Admin@123
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                }
            );
        }
    }
}
