using Microsoft.Extensions.Configuration;

namespace SCPWEBAPI.FldrClass
{
    public class ClsGetConnection
    {
        // Environment is picked automatically by ASPNETCORE_ENVIRONMENT:
        // "Development" (default when running via dotnet run / launchSettings.json) -> appsettings.Development.json (local DB)
        // anything else, e.g. "Production" (default on Azure App Service) -> appsettings.json (live DB)
        private static readonly IConfiguration Configuration = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json", optional: true, reloadOnChange: true)
            .AddEnvironmentVariables()
            .Build();

        public string PlsConnect()
        {
            return Configuration.GetConnectionString("Default")
                ?? throw new InvalidOperationException("ConnectionStrings:Default is not configured in appsettings.json.");
        }

    }
}
