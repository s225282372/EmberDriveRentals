using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CarRentalAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddScoped<IBookingService, BookingService>(); // Added this
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "CarRental API", Version = "v1" });

    // ? ADD JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Database configuration
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Services
builder.Services.AddScoped<CarRentalAPI.Services.IJwtService, CarRentalAPI.Services.JwtService>();
builder.Services.AddScoped<CarRentalAPI.Services.IEmailService, CarRentalAPI.Services.EmailService>();
builder.Services.AddScoped<CarRentalAPI.Services.IFileStorageService, CarRentalAPI.Services.FileStorageService>();

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer not configured");
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme; // ? ADD THIS
})
.AddJwtBearer(options =>
{
    options.SaveToken = true; // ? ADD THIS
    options.RequireHttpsMetadata = false; // ? For development only

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero // ? Remove 5-minute tolerance
    };

    // ? ADD DEBUGGING EVENTS
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("???????????????????????????????????????????");
            Console.WriteLine(" AUTHENTICATION FAILED");
            Console.WriteLine($"Exception: {context.Exception.GetType().Name}");
            Console.WriteLine($"Message: {context.Exception.Message}");
            if (context.Exception.InnerException != null)
            {
                Console.WriteLine($"Inner Exception: {context.Exception.InnerException.Message}");
            }
            Console.WriteLine("???????????????????????????????????????????");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("???????????????????????????????????????????");
            Console.WriteLine("TOKEN VALIDATED SUCCESSFULLY");
            var userId = context.Principal?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var role = context.Principal?.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            Console.WriteLine($"User ID: {userId}");
            Console.WriteLine($"Role: {role}");
            Console.WriteLine("???????????????????????????????????????????");
            return Task.CompletedTask;
        },
        OnChallenge = context =>
        {
            Console.WriteLine("???????????????????????????????????????????");
            Console.WriteLine("AUTHENTICATION CHALLENGE");
            Console.WriteLine($"Error: {context.Error}");
            Console.WriteLine($"Error Description: {context.ErrorDescription}");
            Console.WriteLine($"Has Token: {context.Request.Headers.ContainsKey("Authorization")}");
            if (context.Request.Headers.ContainsKey("Authorization"))
            {
                var authHeader = context.Request.Headers["Authorization"].ToString();
                Console.WriteLine($"Auth Header: {authHeader.Substring(0, Math.Min(50, authHeader.Length))}...");
            }
            Console.WriteLine("???????????????????????????????????????????");
            return Task.CompletedTask;
        },
        OnMessageReceived = context =>
        {
            Console.WriteLine("???????????????????????????????????????????");
            Console.WriteLine("MESSAGE RECEIVED");
            Console.WriteLine($"Path: {context.Request.Path}");
            Console.WriteLine($"Has Authorization Header: {context.Request.Headers.ContainsKey("Authorization")}");
            Console.WriteLine("???????????????????????????????????????????");
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite default port
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // Enable serving static files from wwwroot

app.UseCors("AllowFrontend");

// CRITICAL: Order matters!
app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

// ? Print startup info
Console.WriteLine("???????????????????????????????????????????");
Console.WriteLine("?? CarRental API Started");
Console.WriteLine($"JWT Issuer: {jwtIssuer}");
Console.WriteLine($"JWT Audience: {jwtAudience}");
Console.WriteLine($"JWT Key Length: {jwtKey.Length} characters");
Console.WriteLine("???????????????????????????????????????????");

app.Run();