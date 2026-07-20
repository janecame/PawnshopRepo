using Microsoft.AspNetCore.Mvc;
using SCPWEBAPI.FldrClass;
using System.Data.SqlClient;
using Microsoft.Data.SqlClient;

namespace SCPWEBAPI.Controllers
{
    [Route("health")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        private readonly ClsGetConnection _connection;

        public HealthController()
        {
            _connection = new ClsGetConnection();
        }

        [HttpGet]
        public IActionResult CheckHealth()
        {
            string connectionString = _connection.PlsConnect();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                try
                {
                    conn.Open();
                    return Ok(new { server = "up", database = "up" });
                }
                catch (SqlException)
                {
                    return StatusCode(500, new { server = "up", database = "down" });
                }
            }
        }
    }
}
