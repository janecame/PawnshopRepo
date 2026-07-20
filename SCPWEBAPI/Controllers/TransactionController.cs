using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using SCPWEBAPI.FldrClass;
using System.Data.Common;
using System.Transactions;
using static SCPWEBAPI.FldrModels.TransactionModel;

namespace SCPWEBAPI.Controllers
{

    [ApiController]
    public class TransactionController : Controller
    {
        string connectionString = new ClsGetConnection().PlsConnect();

        Utilities utilities = new Utilities();


        //[HttpGet]
        //[Route("API/SCPWEBAPI/GetPTAutoNum")]
        //public IActionResult PTAutoNum([FromQuery] string strURICNCode)
        //{
        //    if (strURICNCode == null || string.IsNullOrEmpty(strURICNCode))
        //    {
        //        return BadRequest("Request cannot be null or empty");
        //    }

        //    try
        //    {
        //        using (SqlConnection myconnection = new SqlConnection(connectionString))
        //        {
        //            myconnection.Open();
        //            using (SqlTransaction transaction = myconnection.BeginTransaction())
        //            {
        //                try
        //                {
        //                    string queryCheckExists = "SELECT Top 1 PawnTicket FROM tblMain1 WHERE Voucher = 'PS' AND CNCode = @CNCode ORDER BY PawnTicket DESC";

        //                    bool recordExists = utilities.RecordExists(myconnection, transaction, queryCheckExists, strURICNCode);

        //                    if (recordExists)
        //                    {
        //                        string plsLatesPT;
        //                        string queryLatestPT = "SELECT Top 1 PawnTicket FROM tblMain1 WHERE Voucher = 'PS' AND CNCode = @CNCode AND Void = 0 ORDER BY PawnTicket DESC";
        //                        using (SqlCommand mycommand = new SqlCommand(queryLatestPT, myconnection, transaction))
        //                        {
        //                            mycommand.Parameters.AddWithValue("@CNCode", strURICNCode);

        //                            using (SqlDataReader dr = mycommand.ExecuteReader())
        //                            {
        //                                if (dr.Read())
        //                                {
        //                                    int no2 = int.Parse(dr[0].ToString()) + 1;
        //                                    plsLatesPT = no2.ToString().PadLeft(6, '0');
        //                                }
        //                                else
        //                                {
        //                                    return StatusCode(500, "Error fetching the latest pawn ticket.");
        //                                }
        //                            }
        //                        }

        //                        string plsPTNoFrom, plsPTNoTo;
        //                        string queryPTNumberRange = "SELECT PTNoFrom, PTNoTo FROM tblSetupPTNumber WHERE CNCode = @CNCode";
        //                        using (SqlCommand mycommand = new SqlCommand(queryPTNumberRange, myconnection, transaction))
        //                        {
        //                            mycommand.Parameters.AddWithValue("@CNCode", strURICNCode);

        //                            using (SqlDataReader dr = mycommand.ExecuteReader())
        //                            {
        //                                if (dr.Read())
        //                                {
        //                                    plsPTNoFrom = dr["PTNoFrom"].ToString();
        //                                    plsPTNoTo = dr["PTNoTo"].ToString();
        //                                }
        //                                else
        //                                {
        //                                    return StatusCode(500, "Error fetching PT number range.");
        //                                }
        //                            }
        //                        }

        //                        if (int.Parse(plsLatesPT) > int.Parse(plsPTNoTo) || int.Parse(plsLatesPT) < int.Parse(plsPTNoFrom))
        //                        {
        //                            return BadRequest("No Pawn Ticket No. Available");
        //                        }
        //                        else
        //                        {
        //                            return Ok(new { PawnTicketNumber = plsLatesPT });
        //                        }
        //                    }
        //                    else
        //                    {
        //                        string plsPTNum;
        //                        string queryPTNoFrom = "SELECT PTNoFrom FROM tblSetupPTNumber WHERE CNCode = @CNCode";
        //                        using (SqlCommand mycommand = new SqlCommand(queryPTNoFrom, myconnection, transaction))
        //                        {
        //                            mycommand.Parameters.AddWithValue("@CNCode", strURICNCode);
        //                            using (SqlDataReader dr = mycommand.ExecuteReader())
        //                            {
        //                                if (dr.Read())
        //                                {
        //                                    plsPTNum = dr["PTNoFrom"].ToString();
        //                                    return Ok(new { PawnTicketNumber = plsPTNum });
        //                                }
        //                                else
        //                                {
        //                                    return StatusCode(500, "Error fetching PT number from.");
        //                                }
        //                            }
        //                        }
        //                    }
        //                }
        //                catch (Exception)
        //                {
        //                    transaction.Rollback();
        //                    throw;
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, "Internal server error: " + ex.Message);
        //    }
        //}

        [HttpGet]
        [Route("API/SCPWEBAPI/GetPTAutoNum")]
        public IActionResult PTAutoNum([FromQuery] string strURICNCode)
        {
            if (string.IsNullOrEmpty(strURICNCode))
            {
                return BadRequest("Request cannot be null or empty");
            }

            try
            {
                using (SqlConnection myconnection = new SqlConnection(connectionString))
                {
                    myconnection.Open();
                    using (SqlTransaction transaction = myconnection.BeginTransaction())
                    {
                        try
                        {
                            string latestPawnTicket = GetLatestPawnTicket(myconnection, transaction, strURICNCode);

                            if (latestPawnTicket != null)
                            {
                                string nextPawnTicket = GenerateNextPawnTicket(latestPawnTicket);
                                (string ptNoFrom, string ptNoTo) = GetPTNumberRange(myconnection, transaction, strURICNCode);

                                if (int.Parse(nextPawnTicket) > int.Parse(ptNoTo) || int.Parse(nextPawnTicket) < int.Parse(ptNoFrom))
                                {
                                    return BadRequest("No Pawn Ticket No. Available");
                                }

                                return Ok(new { PawnTicketNumber = nextPawnTicket });
                            }
                            else
                            {
                                string ptNoFrom = GetPTNoFrom(myconnection, transaction, strURICNCode);
                                return Ok(new { PawnTicketNumber = ptNoFrom });
                            }
                        }
                        catch (Exception)
                        {
                            transaction.Rollback();
                            throw;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Consider logging the exception here
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        private string GetLatestPawnTicket(SqlConnection connection, SqlTransaction transaction, string cnCode)
        {
            string query = "SELECT Top 1 PawnTicket FROM tblMain1 WHERE Voucher = 'PS' AND CNCode = @CNCode AND Void = 0 ORDER BY PawnTicket DESC";
            using (SqlCommand command = new SqlCommand(query, connection, transaction))
            {
                command.Parameters.AddWithValue("@CNCode", cnCode);

                using (SqlDataReader dr = command.ExecuteReader())
                {
                    return dr.Read() ? dr[0].ToString() : null;
                }
            }
        }

        private (string, string) GetPTNumberRange(SqlConnection connection, SqlTransaction transaction, string cnCode)
        {
            string query = "SELECT PTNoFrom, PTNoTo FROM tblSetupPTNumber WHERE CNCode = @CNCode";
            using (SqlCommand command = new SqlCommand(query, connection, transaction))
            {
                command.Parameters.AddWithValue("@CNCode", cnCode);

                using (SqlDataReader dr = command.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        return (dr["PTNoFrom"].ToString(), dr["PTNoTo"].ToString());
                    }

                    throw new InvalidOperationException("Error fetching PT number range.");
                }
            }
        }

        private string GetPTNoFrom(SqlConnection connection, SqlTransaction transaction, string cnCode)
        {
            string query = "SELECT PTNoFrom FROM tblSetupPTNumber WHERE CNCode = @CNCode";
            using (SqlCommand command = new SqlCommand(query, connection, transaction))
            {
                command.Parameters.AddWithValue("@CNCode", cnCode);

                using (SqlDataReader dr = command.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        return dr["PTNoFrom"].ToString();
                    }

                    throw new InvalidOperationException("Error fetching PT number from.");
                }
            }
        }

        private string GenerateNextPawnTicket(string currentTicket)
        {
            int ticketNumber = int.Parse(currentTicket) + 1;
            return ticketNumber.ToString().PadLeft(6, '0');
        }

        [HttpGet]
        [Route("API/SCPWEBAPI/CheckDuplicatePT")]
        public bool CheckDuplicate(string strTableName, string strFieldName, string strValueName, string CNCode, string strVoucher)
        {
            try
            {
                using (var myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open();
                    string CheckNoTransact = string.Format("SELECT Count(*) FROM {0} WHERE {1}=@strValueName AND CNCode=@CNCode AND Void = 0 AND Voucher=@strVoucher", strTableName, strFieldName);
                    using (var com = new SqlCommand(CheckNoTransact, myconnection))
                    {
                        com.Parameters.AddWithValue("@strValueName", strValueName);
                        com.Parameters.AddWithValue("@CNCode", CNCode);
                        com.Parameters.AddWithValue("@strVoucher", strVoucher);

                        int CountData = int.Parse(com.ExecuteScalar().ToString());

                        return CountData > 0;
                    }
                }
            }
            catch
            {
                return false; // Return false in case of an exception
            }
        }

    }
}
