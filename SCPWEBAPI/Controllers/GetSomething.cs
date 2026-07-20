using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

using SCPWEBAPI.FldrClass;

namespace SCPWEBAPI.Controllers
{
    [ApiController]
    [Route("API/SCPWEBAPI/Security")]
    public class GetSomethingController : ControllerBase
    {
        
        [HttpGet("get-doc-num")]
        public IActionResult GetDocNum(
            string strIC,
            string strVoucher,
            string strCNCode)
        {
            try
            {
                using SqlConnection connection = new SqlConnection(new ClsGetConnection().PlsConnect());

                string query = @"
                    SELECT DocNum, BoxNo, Redeemed, ControlNo
                    FROM tblMain1
                    WHERE IC = @IC
                      AND Voucher = @Voucher
                      AND CNCode = @CNCode
                      AND Void = 0";

                using SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@IC", strIC);
                command.Parameters.AddWithValue("@Voucher", strVoucher);
                command.Parameters.AddWithValue("@CNCode", strCNCode);

                connection.Open();
                using SqlDataReader dr = command.ExecuteReader();

                if (!dr.Read())
                {
                    return NotFound("No record found.");
                }

                var result = new
                {
                    DocNum = dr["DocNum"].ToString(),
                    BoxNo = dr["BoxNo"].ToString(),
                    RedeemStatus = Convert.ToBoolean(dr["Redeemed"])
                        ? "Claimed"
                        : "Unclaim",
                    ControlNo = dr["ControlNo"].ToString()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
