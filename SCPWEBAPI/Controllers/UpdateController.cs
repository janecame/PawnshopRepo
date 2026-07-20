using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using SCPWEBAPI.FldrClass;
using System.Data.Common;
using System.Data;
using static SCPWEBAPI.FldrModels.Models;
using Microsoft.SqlServer.Server;
using Azure.Core;

namespace SCPWEBAPI.Controllers
{
    [ApiController]
    public class UpdateController : Controller
    {
        SqlConnection? myconnection;
        SqlCommand? mycommand;

        [HttpPut]
        [Route("API/SCPWEBAPI/UpdateCompany")]
        public string UpdateAccountName(MdlCompany MdlCompany1)
        {
            try
            {
                string SqlStatement = $"UPDATE tblCompany SET Company = @Company, Address = @Address, TIN = @TIN";

                myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
                myconnection.Open();
                mycommand = new SqlCommand(SqlStatement, myconnection);
                mycommand.Parameters.Add("Company", SqlDbType.VarChar).Value = MdlCompany1.Company;
                mycommand.Parameters.Add("Address", SqlDbType.VarChar).Value = MdlCompany1.Address;
                mycommand.Parameters.Add("TIN", SqlDbType.VarChar).Value = MdlCompany1.TIN;
                mycommand.ExecuteNonQuery();
                myconnection.Close();
                return "updated";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [HttpPut]
        [Route("API/SCPWEBAPI/UpdateSecurityDate")]
        public IActionResult UpdateSecurityDate(MdlSecurityDate MdlSecurityDate1)
        {
            try
            {
                // Validate input
                if (MdlSecurityDate1 == null)
                {
                    return BadRequest(new { message = "Invalid input data" });
                }

                if (!MdlSecurityDate1.BeginDate.HasValue || !MdlSecurityDate1.EndDate.HasValue)
                {
                    return BadRequest(new { message = "BeginDate and EndDate are required" });
                }

                // Validate date logic
                if (MdlSecurityDate1.BeginDate > MdlSecurityDate1.EndDate)
                {
                    return BadRequest(new { message = "BeginDate cannot be greater than EndDate" });
                }

                string SqlStatement = "UPDATE tblSecurityDate SET BeginDate = @BeginDate, EndDate = @EndDate";

                using (myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open();

                    using (mycommand = new SqlCommand(SqlStatement, myconnection))
                    {
                        mycommand.Parameters.Add("@BeginDate", SqlDbType.DateTime).Value = MdlSecurityDate1.BeginDate.Value;
                        mycommand.Parameters.Add("@EndDate", SqlDbType.DateTime).Value = MdlSecurityDate1.EndDate.Value;

                        int rowsAffected = mycommand.ExecuteNonQuery();

                        // Check if any rows were actually updated
                        if (rowsAffected > 0)
                        {
                            return Ok(new { message = "Updated successfully", rowsAffected = rowsAffected });
                        }
                        else
                        {
                            return NotFound(new { message = "No records found to update" });
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                // Log the exception (use your logging framework)
                return StatusCode(500, new { message = "Database error", error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                // Log the exception (use your logging framework)
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        [HttpPut]
        [Route("API/SCPWEBAPI/ResetVoucherTDoor")]
        public string ResetVoucherTDoor(string strURIVoucher)
        {
            try
            {
                string SqlStatement = $"UPDATE tblTDoor SET TableDoor = @TableDoor WHERE Voucher = @Voucher";

                myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
                myconnection.Open();
                mycommand = new SqlCommand(SqlStatement, myconnection);
                mycommand.Parameters.Add("TableDoor", SqlDbType.VarChar).Value = 0;
                mycommand.Parameters.Add("Voucher", SqlDbType.VarChar).Value = strURIVoucher;
                mycommand.ExecuteNonQuery();
                myconnection.Close();
                return "updated";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [HttpPut]
        [Route("API/SCPWEBAPI/UpdateSetupEarlyRenewal")]
        public IActionResult UpdateSetupEarlyRenewal([FromBody] Payload request)
        {
            if (request == null)
            {
                return BadRequest("Request cannot be null");
            }

            try
            {
                using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open();
                    using (SqlTransaction transaction = myconnection.BeginTransaction())
                    {
                        try
                        {
                            // Update existing entries
                            if (request.UpdateData != null)
                            {
                                foreach (var item in request.UpdateData)
                                {
                                    if (item != null)
                                    {
                                        string updateSql = "UPDATE tblEntrySetupEarlyRenewal SET NumDays = @NumDays, InterestRate = @InterestRate WHERE Num = @Num AND CNCode = @CNCode";
                                        using (SqlCommand command = new SqlCommand(updateSql, myconnection, transaction))
                                        {
                                            command.Parameters.Add("NumDays", SqlDbType.Int).Value = item.NumDays;
                                            command.Parameters.Add("InterestRate", SqlDbType.Money).Value = item.InterestRate;
                                            command.Parameters.Add("Num", SqlDbType.Int).Value = item.Num;
                                            command.Parameters.Add("CNCode", SqlDbType.Char).Value = item.CNCode;
                                            command.ExecuteNonQuery();
                                        }
                                    }
                                }
                            }

                            // Insert new entries
                            if (request.NewEntries != null)
                            {
                                foreach (var item in request.NewEntries)
                                {
                                    if (item != null)
                                    {
                                        string insertSql = "INSERT INTO tblEntrySetupEarlyRenewal (NumDays, InterestRate, CNCode) VALUES (@NumDays, @InterestRate, @CNCode)";
                                        using (SqlCommand command = new SqlCommand(insertSql, myconnection, transaction))
                                        {
                                            command.Parameters.Add("NumDays", SqlDbType.Int).Value = item.NumDays;
                                            command.Parameters.Add("InterestRate", SqlDbType.Money).Value = item.InterestRate;
                                            command.Parameters.Add("CNCode", SqlDbType.Char).Value = item.CNCode;
                                            command.ExecuteNonQuery();
                                        }
                                    }
                                }
                            }

                            // Delete marked entries
                            if (request.DeleteEntries != null) // Updated here
                            {
                                foreach (var item in request.DeleteEntries)
                                {
                                    if (item != null)
                                    {
                                        string deleteSql = "DELETE FROM tblEntrySetupEarlyRenewal WHERE Num = @Num";
                                        using (SqlCommand command = new SqlCommand(deleteSql, myconnection, transaction))
                                        {
                                            command.Parameters.Add("Num", SqlDbType.Int).Value = item.Num;
                                            command.ExecuteNonQuery();
                                        }
                                    }
                                }
                            }

                            transaction.Commit();
                        }
                        catch (Exception)
                        {
                            transaction.Rollback();
                            throw;
                        }
                    }
                }

                return Ok("OK");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpPut]
        [Route("API/SCPWEBAPI/UpdateSetupInterestRate")]
        public IActionResult UpdateSetupInterestRate([FromBody] List<InterestRate> request)
        {
            if (request == null)
            {
                return BadRequest("Request cannot be null");
            }

            try
            {
                using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open();
                    {
                        try
                        {
                            foreach (var item in request)
                            {
                                if (item != null)
                                {
                                    string updateSql = "UPDATE tblInterestRate SET Rate = @Rate WHERE RateCode = @RateCode";
                                    using (SqlCommand command = new SqlCommand(updateSql, myconnection))
                                    {
                                        command.Parameters.Add("RateCode", SqlDbType.Char).Value = item.RateCode;
                                        command.Parameters.Add("Rate", SqlDbType.Money).Value = item.Rate;
                                        command.ExecuteNonQuery();
                                    }
                                }
                            }
                        }
                        catch (Exception)
                        {
                            throw;
                        }
                    }
                }

                return Ok("OK");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut]
        [Route("API/SCPWEBAPI/UpdateSetupInterestRateGold")]
        public IActionResult UpdateSetupInterestRateGold([FromBody] List<InterestRateGold> request)
        {
            if (request == null)
            {
                return BadRequest("Request cannot be null");
            }

            try
            {
                using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open();
                    {
                        try
                        {
                            foreach (var item in request)
                            {
                                if (item != null)
                                {
                                    string updateSql = "UPDATE tblIntRate SET Perc = @Perc WHERE IntRateCode = @IntRateCode";
                                    using (SqlCommand command = new SqlCommand(updateSql, myconnection))
                                    {
                                        command.Parameters.Add("IntRateCode", SqlDbType.Char).Value = item.IntRateCode;
                                        command.Parameters.Add("Perc", SqlDbType.Money).Value = item.Perc;
                                        command.ExecuteNonQuery();
                                    }
                                }
                            }
                        }
                        catch (Exception)
                        {
                            throw;
                        }
                    }
                }

                return Ok("OK");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpPut]
        [Route("API/SCPWEBAPI/UpdatePTNoSetup")]
        public IActionResult UpdatePTNoSetup([FromBody] PTNoSetup request)
        {
            if (request == null)
            {
                return BadRequest("Request cannot be null");
            }

            try
            {
                using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open();
                    using (SqlTransaction transaction = myconnection.BeginTransaction())
                    {
                        try
                        {
                            // Update existing entries
                            if (request.UpdatePTData != null)
                            {
                                foreach (var item in request.UpdatePTData)
                                {
                                    if (item != null)
                                    {
                                        string updateSql = "UPDATE tblSetupPTNumber SET PTNoFrom = @PTNoFrom, CNCode = @CNCode, PTNoTo = @PTNoTo WHERE RowNum = @RowNum";
                                        using (SqlCommand command = new SqlCommand(updateSql, myconnection, transaction))
                                        {
                                            command.Parameters.Add("RowNum", SqlDbType.Int).Value = item.RowNum;
                                            command.Parameters.Add("CNCode", SqlDbType.VarChar).Value = item.CNCode; // Adjust the type as needed
                                            command.Parameters.Add("PTNoFrom", SqlDbType.VarChar).Value = item.PTNoFrom; // Adjust the type as needed
                                            command.Parameters.Add("PTNoTo", SqlDbType.VarChar).Value = item.PTNoTo; // Adjust the type as needed
                                            command.ExecuteNonQuery();
                                        }
                                    }
                                }
                            }

                            // Insert new entries
                            if (request.NewPTEntries != null)
                            {
                                foreach (var item in request.NewPTEntries)
                                {
                                    if (item != null)
                                    {
                                        string insertSql = "INSERT INTO tblSetupPTNumber (CNCode, PTNoFrom, PTNoTo) VALUES (@CNCode, @PTNoFrom, @PTNoTo)";
                                        using (SqlCommand command = new SqlCommand(insertSql, myconnection, transaction))
                                        {
                                            command.Parameters.Add("CNCode", SqlDbType.VarChar).Value = item.CNCode; // Adjust the type as needed
                                            command.Parameters.Add("PTNoFrom", SqlDbType.VarChar).Value = item.PTNoFrom; // Adjust the type as needed
                                            command.Parameters.Add("PTNoTo", SqlDbType.VarChar).Value = item.PTNoTo; // Adjust the type as needed
                                            command.ExecuteNonQuery();
                                        }
                                    }
                                }
                            }

                            transaction.Commit();
                        }
                        catch (Exception)
                        {
                            transaction.Rollback();
                            throw;
                        }
                    }
                }

                return Ok("OK");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut]
        [Route("API/SCPWEBAPI/UpdateRSPTNoSetup")]
        public IActionResult UpdateRSPTNoSetup([FromBody] RSPTNoSetup request)
        {
            if (request == null)
            {
                return BadRequest("Request cannot be null");
            }

            Console.WriteLine("Received request: " + Newtonsoft.Json.JsonConvert.SerializeObject(request));

            try
            {
                using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open();
                    using (SqlTransaction transaction = myconnection.BeginTransaction())
                    {
                        try
                        {
                            // Update existing entries
                            if (request.UpdateRSPTData != null)
                            {
                                foreach (var item in request.UpdateRSPTData)
                                {
                                    if (item != null)
                                    {
                                        string updateSql = "UPDATE tblSetupRSPTNumber SET CNCode = @CNCode, RSPTNoFrom = @RSPTNoFrom, RSPTNoTo = @RSPTNoTo WHERE RowNum1 = @RowNum1";
                                        using (SqlCommand command = new SqlCommand(updateSql, myconnection, transaction))
                                        {
                                            command.Parameters.Add("RowNum1", SqlDbType.Int).Value = item.RowNum;
                                            command.Parameters.Add("CNCode", SqlDbType.VarChar).Value = item.CNCode; // Adjust the type as needed
                                            command.Parameters.Add("RSPTNoFrom", SqlDbType.VarChar).Value = item.RSPTNoFrom; // Adjust the type as needed
                                            command.Parameters.Add("RSPTNoTo", SqlDbType.VarChar).Value = item.RSPTNoTo; // Adjust the type as needed
                                            command.ExecuteNonQuery();
                                        }
                                    }
                                }
                            }

                            // Insert new entries
                            if (request.NewRSPTEntries != null)
                            {
                                foreach (var item in request.NewRSPTEntries)
                                {
                                    if (item != null)
                                    {
                                        string insertSql = "INSERT INTO tblSetupRSPTNumber (CNCode, RSPTNoFrom, RSPTNoTo) VALUES (@CNCode, @RSPTNoFrom, @RSPTNoTo)";
                                        using (SqlCommand command = new SqlCommand(insertSql, myconnection, transaction))
                                        {
                                            command.Parameters.Add("CNCode", SqlDbType.VarChar).Value = item.CNCode; // Adjust the type as needed
                                            command.Parameters.Add("RSPTNoFrom", SqlDbType.VarChar).Value = item.RSPTNoFrom; // Adjust the type as needed
                                            command.Parameters.Add("RSPTNoTo", SqlDbType.VarChar).Value = item.RSPTNoTo; // Adjust the type as needed
                                            command.ExecuteNonQuery();
                                        }
                                    }
                                }
                            }

                            transaction.Commit();
                        }
                        catch (Exception)
                        {
                            transaction.Rollback();
                            throw;
                        }
                    }
                }

                return Ok("OK");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut]
        [Route("API/SCPWEBAPI/UpdateSetupEarlyRedemption")]
        public IActionResult UpdateSetupEarlyRedemption([FromBody] EarlyRedemptionPayload request)
        {
            if (request == null)
            {
                return BadRequest("Request cannot be null");
            }


            Console.WriteLine("Received request: " + Newtonsoft.Json.JsonConvert.SerializeObject(request));

            try
            {
                using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open();
                    using (SqlTransaction transaction = myconnection.BeginTransaction())
                    {
                        try
                        {
                            // Update existing entries
                            if (request.EarlyRedemptionUpdateData != null)
                            {
                                foreach (var item in request.EarlyRedemptionUpdateData)
                                {
                                    if (item != null)
                                    {
                                        string updateSql = "UPDATE tblEntrySetupEarlyRedemption SET NumDays = @NumDays, InterestRate = @InterestRate WHERE Num = @Num AND CNCode = @CNCode";
                                        using (SqlCommand command = new SqlCommand(updateSql, myconnection, transaction))
                                        {
                                            command.Parameters.Add("NumDays", SqlDbType.Int).Value = item.NumDays;
                                            command.Parameters.Add("InterestRate", SqlDbType.Money).Value = item.InterestRate;
                                            command.Parameters.Add("Num", SqlDbType.Int).Value = item.Num;
                                            command.Parameters.Add("CNCode", SqlDbType.Char).Value = item.CNCode;
                                            command.ExecuteNonQuery();
                                        }
                                    }
                                }
                            }

                            // Insert new entries
                            if (request.EarlyRedemptionNewEntries != null)
                            {
                                foreach (var item in request.EarlyRedemptionNewEntries)
                                {
                                    if (item != null)
                                    {
                                        string insertSql = "INSERT INTO tblEntrySetupEarlyRedemption (NumDays, InterestRate, CNCode) VALUES (@NumDays, @InterestRate, @CNCode)";
                                        using (SqlCommand command = new SqlCommand(insertSql, myconnection, transaction))
                                        {
                                            command.Parameters.Add("NumDays", SqlDbType.Int).Value = item.NumDays;
                                            command.Parameters.Add("InterestRate", SqlDbType.Money).Value = item.InterestRate;
                                            command.Parameters.Add("CNCode", SqlDbType.Char).Value = item.CNCode;
                                            command.ExecuteNonQuery();
                                        }
                                    }
                                }
                            }

                            // Delete marked entries
                            if (request.EarlyRedemptionDeleteEntries != null) // Updated here
                            {
                                foreach (var item in request.EarlyRedemptionDeleteEntries)
                                {
                                    if (item != null)
                                    {
                                        string deleteSql = "DELETE FROM tblEntrySetupEarlyRedemption WHERE Num = @Num";
                                        using (SqlCommand command = new SqlCommand(deleteSql, myconnection, transaction))
                                        {
                                            command.Parameters.Add("Num", SqlDbType.Int).Value = item.Num;
                                            command.ExecuteNonQuery();
                                        }
                                    }
                                }
                            }

                            transaction.Commit();
                        }
                        catch (Exception)
                        {
                            transaction.Rollback();
                            throw;
                        }
                    }
                }

                return Ok("OK");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

    }
}
