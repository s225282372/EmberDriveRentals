# 🚗 EmberDrive ~ Backend-First Car Rental Management System

**EmberDrive** is a **backend-first, full-stack car rental management system** built with **ASP.NET Core 8 Web API** and **SQL Server**, designed to model real-world rental workflows with a strong focus on **security**, **business logic**, and **API design**.

The backend API is treated as the core product and is designed to be **production-oriented**, while a React frontend consumes the API to provide customer and admin interfaces.

---

## 🎯 Project Goals

This project was built to demonstrate:

- Backend-first system design
- Secure authentication and session management
- Workflow-driven business logic (not CRUD-only)
- Clean Architecture and separation of concerns
- RESTful API design with pagination, filtering, and validation
- Realistic domain modeling for a rental business

---

## 🏗️ System Overview

```
React Frontend (In Progress)
        ↓
ASP.NET Core 8 Web API
        ↓
Entity Framework Core
        ↓
SQL Server
```

- The backend API can operate **independently** of the frontend  
- All business rules, validation, and authorization live in the API  
- The frontend acts as a client, not the source of truth  

---

## 🔐 Authentication & Security Model

EmberDrive implements a **security-first authentication system** inspired by real production APIs.

### Authentication Features
- JWT Bearer authentication
- Short-lived access tokens (15 minutes)
- Refresh token rotation
- Session tracking per device
- Single-session and global logout
- Secure password hashing using BCrypt
- GUID-based identifiers to prevent enumeration attacks

### Token Lifecycle
1. User logs in → access token + refresh token issued  
2. Access token expires → refresh token used  
3. Old refresh token is revoked (rotation)  
4. New access & refresh tokens issued  
5. Suspicious or revoked tokens are rejected  

Refresh tokens are persisted and tracked with:
- Device information
- IP address
- Expiration and revocation timestamps

This enables **multi-device session management**.

---

## 🔁 Business Workflows (Backend-Driven)

### 🚙 Booking Lifecycle
```
Pending → Confirmed → Completed
      ↘
       Cancelled
```

- Double-booking prevention enforced at API level  
- Date validation ensures logical rental periods  
- Dynamic price calculation  
- Role-based authorization for admin actions  

### 🔧 Damage Reporting
- Damage reports allowed only for completed bookings  
- Severity classification (Low / Medium / High)  
- Admin resolution workflow with audit timestamps  

### 🛠️ Maintenance Tracking
- Maintenance schedules tied to vehicles  
- Overdue maintenance alerts  
- Vehicle availability affected by maintenance state  

---

## 📡 API Design Principles

- RESTful resource naming  
- Explicit action endpoints for workflows  
- Pagination, sorting, and filtering  
- DTO-based API contracts  
- Business logic isolated in service layer  

Example endpoints:
```
POST /api/Bookings/{id}/cancel
POST /api/DamageReports/{id}/resolve
POST /api/Maintenance/{id}/complete
```

---

## 🧩 Architecture

```
Controllers → Services → Data Access
                  ↓
                DTOs
```

### Patterns Used
- Service Layer Pattern  
- DTO Pattern  
- Dependency Injection  
- EF Core DbContext as repository abstraction  

---

## 🗄️ Database Design

- Normalized relational schema  
- Explicit foreign keys and constraints  
- Enumerated workflow states  
- Refresh tokens as first-class entities  
- Referential integrity enforced via EF Core  

---

## 📊 Admin & Observability Features

- System-wide statistics  
- Booking and revenue trends  
- Top-performing vehicles  
- Maintenance and system alerts  

---

## 🖥️ Frontend (Supporting Layer)

The React frontend consumes the API and provides:

- Customer booking flows  
- Vehicle browsing and availability checks  
- User dashboards  
- Admin management panels  

**Status:** In progress  
The backend API is fully functional and testable independently via Swagger.

---

## 🛠️ Tech Stack

### Backend
- ASP.NET Core 8 Web API  
- Entity Framework Core  
- SQL Server  
- JWT Authentication  
- BCrypt.Net  
- Swagger / OpenAPI  

### Frontend
- React 18  
- Tailwind CSS  
- Axios  
- React Router  

---

## 🚀 Running the Project

```bash
git clone https://github.com/s225282372/CarRentalAPI.git
cd CarRentalAPI
dotnet ef database update
dotnet run
```

Swagger:
```
https://localhost:5001/swagger
```

---

## ⚠️ Known Limitations & Future Improvements

- API response envelope standardization  
- Centralized error response model  
- Payment workflow (mock gateway)  
- Rate limiting  
- Unit & integration testing  
- Dockerization and CI/CD  


---

## 👨‍💻 Author

**Maselaelo Glen**  
Backend-focused Software Engineer
