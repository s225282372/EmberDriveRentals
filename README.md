
# 🚗 EmberDrive Car Rental Management System 

Is a full-stack car rental platform built with ASP.NET Core 8, featuring JWT authentication, advanced booking management, damage tracking, maintenance scheduling, and a comprehensive admin dashboard.

---

## 🚦 Project Status

| Component | Status |
|-----------|--------|
| **Backend API** | ✅ Complete |
| **Database** | ✅ Complete |
| **Authentication** | ✅ Complete |
| **Frontend (React)** | 🚧 In Progress |
| **Documentation** | 🚧 In Progress |
| **Deployment** | ⏳ Planned |

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Admin/Customer)
- Session management with device tracking
- Secure password hashing using BCrypt
- Automatic token refresh mechanism

### 🚙 Cars Management
- Full CRUD operations for vehicles
- Advanced search and filtering
- Pagination and sorting
- Multiple image upload support
- Real-time availability checking
- Vehicle status management

### 📅 Booking System
- Create bookings with date validation
- Automatic double-booking prevention
- Dynamic price calculation
- Status tracking (Pending/Confirmed/Completed/Cancelled)
- Email notifications for booking updates
- Booking history and statistics

### 🔧 Damage Reports
- Report damage for completed bookings
- Image upload for damage documentation
- Severity classification (Low/Medium/High)
- Admin resolution workflow
- Damage history tracking

### ⭐ Reviews System
- One review per completed booking
- Star ratings (1-5 scale)
- Admin approval workflow
- Bulk approve/reject operations
- Average rating calculation

### 🛠️ Maintenance Tracking
- Schedule maintenance tasks
- Overdue maintenance alerts
- Completion status tracking
- Maintenance history per vehicle
- Automated notification system

### 📊 Admin Dashboard
- Comprehensive business statistics
- Revenue tracking with growth metrics
- 12-month trend analysis
- Top-performing vehicles
- System-wide alert notifications
- Real-time booking insights

### 🎯 Advanced Features
- Pagination on all list endpoints
- Full-text search capabilities
- Email notification system
- Secure file upload with validation
- Session management
- RESTful API design

---

## 🛠️ Tech Stack

### Backend
- **Framework:** ASP.NET Core 8.0 Web API
- **ORM:** Entity Framework Core
- **Database:** SQL Server (via SSMS)
- **Authentication:** JWT Bearer Tokens
- **Password Hashing:** BCrypt.Net
- **Email Service:** Custom SMTP integration
- **File Storage:** Local file system (wwwroot/uploads)

### Frontend (In Development)
- **Framework:** React 18
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (planned)
- **Animations:** Framer Motion (planned)
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **State Management:** React Context API

---

## 🏗️ Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

```
CarRentalAPI/
├── Controllers/          # API endpoints
├── Services/            # Business logic layer
├── Data/                # Database context
├── Models/              # Domain entities
├── DTOs/                # Data transfer objects
├── Helpers/             # Utility classes
│   ├── FileUploadHelper
│   ├── PaginationHelpers
│   └── SearchParams
├── Migrations/          # EF Core migrations
└── wwwroot/
    └── uploads/         # File storage
        ├── cars/
        └── damages/
```

### Design Patterns Used
- **Repository Pattern** (via EF Core DbContext)
- **Service Layer Pattern** (Business logic separation)
- **DTO Pattern** (API contract management)
- **Dependency Injection** (Built-in .NET DI)

---

## 📡 API Endpoints

### Authentication (7 endpoints)
```http
POST   /api/Auth/register          # User registration
POST   /api/Auth/login             # User login
POST   /api/Auth/refresh           # Refresh access token
POST   /api/Auth/revoke            # Revoke refresh token
POST   /api/Auth/revoke-all        # Revoke all user sessions
GET    /api/Auth/sessions          # Get active sessions
DELETE /api/Auth/sessions/{id}     # Delete specific session
```

### Cars (9 endpoints)
```http
GET    /api/Cars                   # List cars (paginated, searchable)
GET    /api/Cars/{id}              # Get car details
POST   /api/Cars                   # Create car [Admin]
PUT    /api/Cars/{id}              # Update car [Admin]
DELETE /api/Cars/{id}              # Delete car [Admin]
GET    /api/Cars/{id}/availability # Check availability
POST   /api/Cars/{id}/images       # Upload car images [Admin]
DELETE /api/Cars/{id}/images       # Delete car image [Admin]
```

### Bookings (8 endpoints)
```http
GET    /api/Bookings               # List bookings (paginated)
GET    /api/Bookings/{id}          # Get booking details
POST   /api/Bookings               # Create booking
PATCH  /api/Bookings/{id}/status   # Update status [Admin]
POST   /api/Bookings/{id}/cancel   # Cancel booking
GET    /api/Bookings/statistics    # Booking stats [Admin]
```

### Damage Reports (4 endpoints)
```http
GET    /api/DamageReports          # List damage reports
GET    /api/DamageReports/{id}     # Get report details
POST   /api/DamageReports          # Create report
POST   /api/DamageReports/{id}/resolve # Resolve report [Admin]
```

### Reviews (7 endpoints)
```http
GET    /api/Reviews                # List all reviews
GET    /api/Reviews/car/{carId}    # Get car reviews
POST   /api/Reviews                # Create review
PATCH  /api/Reviews/{id}/status    # Update status [Admin]
POST   /api/Reviews/bulk-approve   # Bulk approve [Admin]
POST   /api/Reviews/bulk-reject    # Bulk reject [Admin]
```

### Maintenance (7 endpoints)
```http
GET    /api/Maintenance            # List maintenance records
GET    /api/Maintenance/{id}       # Get record details
GET    /api/Maintenance/car/{carId} # Get car maintenance
POST   /api/Maintenance            # Create record [Admin]
PUT    /api/Maintenance/{id}       # Update record [Admin]
POST   /api/Maintenance/{id}/complete # Mark complete [Admin]
DELETE /api/Maintenance/{id}       # Delete record [Admin]
GET    /api/Maintenance/alerts     # Get alerts [Admin]
```

### Dashboard (5 endpoints)
```http
GET    /api/Dashboard/statistics     # System statistics [Admin]
GET    /api/Dashboard/revenue-chart  # Revenue trends [Admin]
GET    /api/Dashboard/bookings-chart # Booking trends [Admin]
GET    /api/Dashboard/top-cars       # Top performers [Admin]
GET    /api/Dashboard/alerts         # System alerts [Admin]
```

### File Upload (5 endpoints)
```http
POST   /api/Upload/car-image       # Upload single car image [Admin]
POST   /api/Upload/car-images      # Upload multiple images [Admin]
POST   /api/Upload/damage-image    # Upload damage image
POST   /api/Upload/damage-images   # Upload multiple damage images
DELETE /api/Upload/image           # Delete image [Admin]
```
---

## 🚀 Getting Started

### Prerequisites
- [.NET 8 SDK]
- [SQL Server] or SQL Server Express
- [SQL Server Management Studio (SSMS)]
- [Node.js] (for frontend, when available)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/s225282372/CarRentalAPI.git
   cd CarRentalAPI
   ```

2. **Update Connection String**
   
   Edit `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=YOUR_SERVER;Database=CarRentalDB;Trusted_Connection=True;TrustServerCertificate=True"
     }
   }
   ```

3. **Configure JWT Settings**
   
   Update `appsettings.json`:
   ```json
   {
     "JwtSettings": {
       "SecretKey": "your-super-secret-key-min-32-characters",
       "Issuer": "CarRentalAPI",
       "Audience": "CarRentalClient",
       "AccessTokenExpirationMinutes": 15,
       "RefreshTokenExpirationDays": 7
     }
   }
   ```

4. **Apply Database Migrations**
   ```bash
   dotnet ef database update
   ```

5. **Run the Application**
   ```bash
   dotnet run
   ```

6. **Access Swagger Documentation**
   ```
   https://localhost:5001/swagger
   ```

### Frontend Setup (Coming Soon)
```bash
cd client
npm install
npm start
```

---

## 🗄️ Database Schema

### Core Tables

#### Users
```sql
UserId (GUID, PK)
FullName (NVARCHAR)
Email (NVARCHAR, UNIQUE)
PasswordHash (NVARCHAR)
Role (NVARCHAR) -- 'Admin' or 'Customer'
CreatedAt (DATETIME)
```

#### Cars
```sql
CarId (GUID, PK)
Make (NVARCHAR)
Model (NVARCHAR)
Year (INT)
PricePerDay (DECIMAL)
Features (NVARCHAR) -- JSON array
ImageUrls (NVARCHAR) -- JSON array
Status (NVARCHAR) -- 'Available', 'Maintenance', 'Unavailable'
CreatedAt (DATETIME)
```

#### Bookings
```sql
BookingId (GUID, PK)
UserId (GUID, FK)
CarId (GUID, FK)
StartDate (DATETIME)
EndDate (DATETIME)
TotalPrice (DECIMAL)
Status (NVARCHAR) -- 'Pending', 'Confirmed', 'Completed', 'Cancelled'
CreatedAt (DATETIME)
```

#### DamageReports
```sql
DamageId (GUID, PK)
BookingId (GUID, FK)
Description (NVARCHAR)
Severity (NVARCHAR) -- 'Low', 'Medium', 'High'
ImageUrls (NVARCHAR) -- JSON array
Status (NVARCHAR) -- 'Pending', 'Resolved'
CreatedAt (DATETIME)
ResolvedAt (DATETIME, NULL)
```

#### Reviews
```sql
ReviewId (GUID, PK)
BookingId (GUID, FK)
Rating (INT) -- 1-5
Comment (NVARCHAR)
Status (NVARCHAR) -- 'Pending', 'Approved', 'Rejected'
CreatedAt (DATETIME)
```

#### MaintenanceRecords
```sql
MaintenanceId (GUID, PK)
CarId (GUID, FK)
Description (NVARCHAR)
ScheduledDate (DATETIME)
CompletedDate (DATETIME, NULL)
Status (NVARCHAR) -- 'Due', 'Completed'
Cost (DECIMAL, NULL)
```

#### RefreshTokens
```sql
TokenId (GUID, PK)
UserId (GUID, FK)
Token (NVARCHAR, UNIQUE)
DeviceInfo (NVARCHAR)
CreatedAt (DATETIME)
ExpiresAt (DATETIME)
IsRevoked (BIT)
```

---

## 🔒 Security Features

### Authentication & Authorization
- ✅ JWT Bearer token authentication
- ✅ Refresh token rotation
- ✅ Role-based access control (RBAC)
- ✅ Secure password hashing with BCrypt (cost factor: 12)
- ✅ Session management with device tracking

### Data Protection
- ✅ GUID primary keys (prevents enumeration attacks)
- ✅ SQL injection prevention (via EF Core parameterization)
- ✅ CORS configuration
- ✅ Input validation using Data Annotations

### File Upload Security
- ✅ File type validation (images only)
- ✅ File size limits (5MB per file)
- ✅ Sanitized file names
- ✅ Organized storage structure

### API Security
- ✅ HTTPS enforcement (production)
- ✅ Rate limiting (planned)
- ✅ Request validation
- ✅ Error handling without sensitive data exposure

---

## 🎯 Project Goals

This main aim of this project is to demonstrates:

1. **Clean Architecture** - Separation of concerns, maintainable code
2. **Enterprise Patterns** - Service layer, DTOs, dependency injection
3. **Security Best Practices** - JWT, BCrypt, GUID keys, validation
4. **RESTful API Design** - Proper HTTP methods, status codes, resource naming
5. **Database Design** - Normalized schema, proper relationships, migrations
6. **Professional Development** - Git workflow, documentation, planning

---

## 📚 API Documentation

Full API documentation is available via Swagger UI when running the application:

```
https://localhost:5001/swagger
```
## 🗺️ Roadmap

### Phase 1: Backend ✅ (Complete)
- [x] Authentication & Authorization
- [x] Cars Management
- [x] Booking System
- [x] Damage Reports
- [x] Reviews System
- [x] Maintenance Tracking
- [x] Admin Dashboard
- [x] File Upload

### Phase 2: Frontend 🚧 (In Progress)
- [x] React application setup
- [x] Authentication UI 
- [x] Car listing & search
- [x] Booking flow 
- [x] User dashboard 
- [x] Admin panel
- [ ] Responsive design

### Phase 3: Polish ⏳ (Planned)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Performance optimization
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Cloud deployment (Azure/AWS)

---

## 👨‍💻 Author

**Maselaelo Glen**
---
