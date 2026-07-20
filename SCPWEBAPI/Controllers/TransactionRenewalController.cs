using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using SCPWEBAPI.FldrClass;
using System.Data.Common;
using System.Transactions;

namespace SCPWEBAPI.Controllers
{
    [ApiController]
    [Route("API/SCPWEBAPI")]
    public class TransactionRenewalController : Controller
    {
		SqlConnection? myconnection;
		SqlCommand? mycommand;

		[HttpGet]
        [Route("RenewalID")]
        public IActionResult RenewalID(string strCNCode)
        {
            try
            {
                string renewalId = GenerateRSPTAutoNum(strCNCode);
                return Ok(new { RenewalID = renewalId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }


        

        private string GenerateRSPTAutoNum(string strCNCode)
        {
            

            string plsLatesRSPT = string.Empty;
            string plsRSPTNum = string.Empty;

            using (var myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
            {
                myconnection.Open();

                // Check if there is an existing record
                string queryExists = "SELECT TOP 1 RSPawnTicket FROM tblMain1 WHERE CNCode = @CNCode AND Void = 0 ORDER BY RSPawnTicket DESC";
                using (var mycommand = new SqlCommand(queryExists, myconnection))
                {
                    mycommand.Parameters.AddWithValue("@CNCode", strCNCode);
                    var result = mycommand.ExecuteScalar();

                    if (result != null)
                    {
                        int no2 = int.Parse(result.ToString()) + 1;
                        plsLatesRSPT = no2.ToString().PadLeft(6, '0');
                    }
                }

                // Retrieve RSPTNoFrom and RSPTNoTo
                string queryRange = "SELECT RSPTNoFrom, RSPTNoTo FROM tblSetupRSPTNumber WHERE CNCode = @CNCode";
                using (var mycommand = new SqlCommand(queryRange, myconnection))
                {
                    mycommand.Parameters.AddWithValue("@CNCode", strCNCode);
                    using (var dr = mycommand.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            string plsRSPTNoFrom = dr["RSPTNoFrom"].ToString();
                            string plsRSPTNoTo = dr["RSPTNoTo"].ToString();

                            // Compare latest RSPT with the range
                            if (string.IsNullOrEmpty(plsLatesRSPT) ||
                                int.Parse(plsLatesRSPT) > int.Parse(plsRSPTNoTo) ||
                                int.Parse(plsLatesRSPT) < int.Parse(plsRSPTNoFrom))
                            {
                                plsRSPTNum = plsRSPTNoFrom;
                            }
                            else
                            {
                                plsRSPTNum = plsLatesRSPT;
                            }
                        }
                    }
                }
            }

            return plsRSPTNum;
        }
    }
}
