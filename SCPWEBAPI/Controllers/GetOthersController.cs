using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

using SCPWEBAPI.FldrClass;
using static SCPWEBAPI.FldrModels.Models;

namespace SCPWEBAPI.Controllers
{
    [ApiController]
    [Route("API/SCPWEBAPI")]
    public class GetOthersController : ControllerBase
    {
        
        [HttpGet("ClsGetTermSetup")]
        public IActionResult ClsGetTermSetup()
        {
            try
            {
                var service = new ClsGetSomething();
                var data = service.GetTermSetup();
                
                if (data == null) return NotFound();
                
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("ClsGetSilverRange")]
        public async Task<IActionResult> ClsGetSilverRange(decimal amount)
        {
            var service = new ClsGetSomething();
            string rate = await service.GetSilverIntRateAsync(amount);

            if (string.IsNullOrEmpty(rate))
            {
                return NotFound("No interest rate found for the specified amount.");
            }

            return Ok(rate);
        }

        [HttpGet("ClsGetLoanItemSetup/{catCode}")   ]
        public async Task<IActionResult> GetLoanItemSetup(string catCode)
        {
			var service = new ClsGetSomething();
			var result = await service.GetLoanItemSetupAsync(catCode);

            if (result == null)
                return NotFound($"Category {catCode} not found.");

            return Ok(result);
        }
        
    }

}

