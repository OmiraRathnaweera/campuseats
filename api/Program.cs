using System.Text;
using CampusEats.Api.Data;
using CampusEats.Api.Models;
using CampusEats.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger with an Authorize button
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Paste ONLY the token - no 'Bearer ' prefix."
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// CORS: allow the deployed frontend (Vercel / Netlify) and local development
builder.Services.AddCors(o => o.AddPolicy("Frontend", p =>
{
    p.WithOrigins("https://campuseats-web.vercel.app")
     .SetIsOriginAllowed(origin =>
     {
         if (string.IsNullOrWhiteSpace(origin)) return false;
         try
         {
             var uri = new Uri(origin);
             return uri.Host == "localhost" ||
                    uri.Host.EndsWith("vercel.app", StringComparison.OrdinalIgnoreCase) ||
                    uri.Host.EndsWith("netlify.app", StringComparison.OrdinalIgnoreCase);
         }
         catch
         {
             return false;
         }
     })
     .AllowAnyHeader()
     .AllowAnyMethod();
}));

// Database
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// Services (Scoped because they use the DbContext)
builder.Services.AddScoped<IMenuService, MenuService>();

// JWT authentication
var jwt = builder.Configuration.GetSection("Jwt");
var jwtKey = jwt["Key"] ?? "dev-only-secret-change-me-min-32-characters!!";
var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt => opt.TokenValidationParameters = new()
    {
        ValidateIssuer = true,
        ValidIssuer = jwt["Issuer"] ?? "CampusEats",
        ValidateAudience = true,
        ValidAudience = jwt["Audience"] ?? "CampusEatsUsers",
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateLifetime = true
    });
builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var db = services.GetRequiredService<AppDbContext>();
        db.Database.Migrate();
        if (!db.MenuItems.Any())
        {
            db.MenuItems.AddRange(
                new MenuItem { Name = "Kottu Roti", Price = 750m, Category = "Mains" },
                new MenuItem { Name = "Fried Rice", Price = 850m, Category = "Mains" },
                new MenuItem { Name = "Watalappan", Price = 350m, Category = "Dessert" });
            db.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogWarning(ex, "Could not apply database migrations or seed data at startup.");
    }
}

// Enable Swagger in all environments for easy API verification (Task 03 / Task 05)
app.UseSwagger();
app.UseSwaggerUI();

if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("Frontend"); // before MapControllers()

app.UseAuthentication();
app.UseAuthorization();   

app.MapControllers();
app.Run();