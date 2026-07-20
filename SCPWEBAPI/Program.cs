using SCPWEBAPI.Repositories.Implementations.Entries;
using SCPWEBAPI.Repositories.Interfaces.Entries;
using SCPWEBAPI.Services.Implementations.Entries;
using SCPWEBAPI.Services.Interfaces.Entries;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Entries (Controller -> Service -> Repository) pilot
builder.Services.AddScoped<IColorRepository, ColorRepository>();
builder.Services.AddScoped<IColorService, ColorService>();



var app = builder.Build();

app.UseCors(cors => cors
           .AllowAnyMethod()
           .AllowAnyHeader()
           .SetIsOriginAllowed(origin => true)
           .AllowCredentials()
           );


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
