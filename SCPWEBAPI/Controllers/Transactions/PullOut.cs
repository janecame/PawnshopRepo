using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System.Data.Common;
using System.Data.SqlClient;
using System.Data;
using System.Net;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Collections;

using static SCPWEBAPI.FldrModels.Models;
using static SCPWEBAPI.FldrModels.PullOutModel;
using SCPWEBAPI.FldrClass;

namespace SCPWEBAPI.Controllers
{
    // public static string varVoucher;
    // private string privarstrVoidRS;
    // int number = 0;
    //string dblPawnTicket, dblVDate, dblVoucher;
    // string privarstrVoidIC = null;
    // string AmountDue = "0.00";
    // string strInterest1, Address, ContactNo, ID;
    // double AppraisedValue;

   

    [ApiController]
    [Route("API/SCPWEBAPI/PullOut")]
    public class PullOutController : ControllerBase
    {   


        private readonly ILogger<PullOutController> _logger;
        private readonly ClsValidation _clsvalidation = new ClsValidation();


        public PullOutController(ILogger<PullOutController> logger)
        {
            _logger = logger;
        }

	


        /*[HttpGet("PullOut/InitialLoad")]
        public IActionResult InitialLoad(string cnCode)
        {
            
        }*/


        [HttpGet("PullOutDetailsMainFetch")]
        public IActionResult PullOutDetailsMainFetch([FromQuery] SearhDetails values)
        {
            if (string.IsNullOrWhiteSpace(values?.pawnTicket))
            {
                return BadRequest("Pawn ticket number cannot be empty.");
            }

            // Assuming values contains the necessary data for validation
            string pt = values.pawnTicket;
            string cnCode = values.cnCode; // Make sure cnCode exists in SearhDetails

            bool exists = _clsvalidation.PawnTicketExist(pt, cnCode);

            if (!exists)
            {
                return NotFound(new { message = "Does not exist" });
            }

            try
            {
                var ticketDetails = GetPawnTicketDetails(values);
                var vDate = GetVDate(values);
                var detailsInfo = getDetailsInfo(values, vDate.pawnDateCal);
                var dateValidate = getDateValidate(detailsInfo, vDate.txtPawnDate);

                if (ticketDetails == null)
                {
                    return NotFound("Pawn ticket not found.");
                }

                var model = new PullOutMainModel
                {
                    ticketDetails = ticketDetails,
                    vDate = vDate,
                    detailsInfo = detailsInfo,
                    dateValidate = dateValidate
                };

                return Ok(model);
            }
            catch (Exception ex)
            {
                //_logger.LogError(ex, "Error in RenewalPawnticket");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }


        private VDateModel GetVDate(SearhDetails values)
        {
            const string query = @"
                SELECT TDate, VDate 
                FROM tblMain1 
                WHERE (PawnTicket = @PawnTicket OR RSPawnTicket = @PawnTicket) 
                  AND CNCode = @CNCode";

            using var connection = new SqlConnection(new ClsGetConnection().PlsConnect());
            connection.Open();

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@PawnTicket", values.pawnTicket);
            command.Parameters.AddWithValue("@CNCode", values.cnCode);

            using var reader = command.ExecuteReader();
            if (reader.Read())
            {

                DateTime latestPawnDate = Convert.ToDateTime(reader["TDate"]);
                DateTime pawnDate = Convert.ToDateTime(reader["VDate"]);


                return new VDateModel
                {
                    txtLatestPawnDate = latestPawnDate.ToString("yyyy-MM-dd"),
                    txtPawnDate = pawnDate.ToString("yyyy-MM-dd"),
                    pawnDateCal = pawnDate
                };
            }

            return null; // Return null if no matching record is found
        }



        private TicketDetails GetPawnTicketDetails(SearhDetails values)
        {
            const string query = @"
                SELECT PawnTicket, RSPawnTicket, Voucher, ControlNo 
                FROM ViewListOfPawnTicket 
                WHERE (PawnTicket = @PawnTicketNo OR RSPawnTicket = @PawnTicketNo) 
                  AND CNCode = @BranchCode";

            using var connection = new SqlConnection(new ClsGetConnection().PlsConnect());
            connection.Open();

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@PawnTicketNo", values.pawnTicket);
            command.Parameters.AddWithValue("@BranchCode", values.cnCode);

            using var reader = command.ExecuteReader();
            if (reader.Read())
            {
                return new TicketDetails
                {
                    txtOldPawnTicket = values.pawnTicket,
                    dblPawnTicket = values.pawnTicket,
                    Voucher = reader["Voucher"].ToString(),
                    txtStatus = reader["Voucher"].ToString() == "PS" ? "New" : "Renewed",
                    pawner = reader["ControlNo"].ToString()
                };
            }

            return null;
        }



        private DetailsModel getDetailsInfo(SearhDetails values, DateTime txtPawnDate)
        {
            string selectSQL = @"
                SELECT * FROM ViewGetStockInfo 
                WHERE PawnTicket = (SELECT TOP 1 PawnTicket 
                                   FROM tblMain1 
                                   WHERE PawnTicket = @PawnTicket OR RSPawnTicket = @PawnTicket  
                                   ORDER BY VDate DESC) 
                AND CNCode = @CNCode";

            using (SqlConnection conn = new SqlConnection(new ClsGetConnection().PlsConnect()))
            using (SqlCommand command = new SqlCommand(selectSQL, conn))
            {
                command.Parameters.AddWithValue("@PawnTicket", values.pawnTicket);
                command.Parameters.AddWithValue("@CNCode", values.cnCode);

                conn.Open();

                using (SqlDataReader dr = command.ExecuteReader())
                {
                    List<Rows> scheduleList = new List<Rows>(); // Move outside to collect all rows
                    double cAmount = 0.0; // Declare outside the loop
                    string boxNo = ""; // Declare other variables used in DetailsModel
                    string formattedTDate = "N/A";
                    double interestAmount = 0.0;
                    int months = 0;
                    var today = DateTime.Today;

                    DateTime varDueDate = DateTime.MinValue;
                    DateTime varAuctionDate = DateTime.MinValue;

                    while (dr.Read())  // Iterate over each row from the query result
                    {   
                        // Assign values inside the loop
                        cAmount = dr["CAmount"] != DBNull.Value ? Convert.ToDouble(dr["CAmount"]) : 0.0;
                        int term = dr["Term"] != DBNull.Value ? Convert.ToInt32(dr["Term"]) : 0;
                        boxNo = dr["BoxNo"].ToString();
                        formattedTDate = dr["TDate"] != DBNull.Value ? Convert.ToDateTime(dr["TDate"]).ToString("yyyy-MM-dd") : "N/A";

                        // Calculate dates (ensure txtPawnDate is declared somewhere outside)
                        varDueDate = txtPawnDate.AddMonths(term);
                        varAuctionDate = txtPawnDate.AddMonths(6);

                        // Safely parse values
                        double loanAmount = dr["LoanAmount"] != DBNull.Value ? Convert.ToDouble(dr["LoanAmount"]) : 0.0;
                        double intRate = dr["IntRate"] != DBNull.Value ? Convert.ToDouble(dr["IntRate"]) / 100 : 0.0;
                        // double interest = dr["Interest"] != DBNull.Value ? Convert.ToDouble(dr["Interest"]) : 0.0;
                        // string itemDesc = dr["ItemDesc"].ToString();

                        string strLoanAmt = double.Parse(dr["LoanAmount"].ToString()).ToString("N2");
                        string strTotalLoanAmt = dr["TotalLoanAmt"].ToString();
                        string strIntRate = (double.Parse(dr["IntRate"].ToString()) / 100).ToString("N2");
                        string strInterest = dr["Interest"].ToString();
                        string strItemDesc = dr["ItemDesc"].ToString();
                        string strCatCode = dr["CatCode"].ToString();


                        DateTime DTLatestPawnDate = Convert.ToDateTime(dr["VDate"].ToString());
                        interestAmount = loanAmount * intRate;

                        months = ClsDateDiff.GetMonths(Convert.ToDateTime(txtPawnDate), Convert.ToDateTime(today));
                        
                        _logger.LogInformation("Months: {Months}", months);
                        
                        for (int x = 1; x < months + 1; x++)
                        {
                            DateTime dgvDate = DTLatestPawnDate.AddMonths(x);

                            scheduleList.Add(new Rows
                            {
                                /*term = x.ToString(),
                                description = itemDesc, // Correctly adds each item
                                schedule = dgvDate.ToString("MM/dd/yyyy"),
                                total = (loanAmount * interest).ToString("N2"),
                                interest = (interest * 100).ToString("N2") + "%",
                                loanAmount = loanAmount.ToString("N2")*/
                                Row1 = x.ToString(),
                                Row2 = strItemDesc,
                                Row3 = dgvDate.ToString("MM/dd/yyyy"),
                                Row4 = strInterest,
                                Row5 = (double.Parse(strLoanAmt) * double.Parse(strInterest)).ToString("N2"),
                                Row6 = ((double.Parse(strInterest) * 100) + "%").ToString(),
                                Row7 = (double.Parse(strLoanAmt) * double.Parse(strIntRate)).ToString("N2"),
                                Row8 = strLoanAmt,
                                Row9 = strCatCode

                            });
                        }
                    }

                    if (scheduleList.Count > 0)  // If we have data, return it
                    {
                        return new DetailsModel
                        {
                            txtRenewCAmount = cAmount.ToString("N2"),
                            txtBox = boxNo,
                            txtDueDate = varDueDate != DateTime.MinValue ? varDueDate.ToString("yyyy-MM-dd") : "N/A",
                            txtAuctionDate = varAuctionDate != DateTime.MinValue ? varAuctionDate.ToString("yyyy-MM-dd") : "N/A",
                            txtRemarksRenew = $"{formattedTDate} / {values.pawnTicket}",

                            lblMonthIntAmt = interestAmount.ToString("N2"),
                            txtInterestDue = scheduleList.Sum(s => Convert.ToDouble(s.Row5)).ToString("N2"),
                            txtForDiscount = "0.00",
                            txtRSDiscount = "0.00",
                            txtRemainingBal = remainingBal(interestAmount.ToString("N2"), values.pawnTicket, values.cnCode),
                            txtServiceFee = "5.00",
                            txtPenalty = "0.00",
                            txtDiscount = "0.00",
                            noOfMonths = months,
                            txtTDate = today.ToString("yyyy-MM-dd"),
                            rows = scheduleList



                        };
                    }

                    return null; // Return null if no records were found
                }


            }

            return null;
        }

        private DetailsModel getDateValidate(DetailsModel request, string txtPawnDate)
        {
            try
            {
                List<Rows> newRow = new List<Rows>();

                int addmonth = 0;
                DateTime VarToday = DateTime.Today;
                int days = (VarToday - DateTime.Parse(txtPawnDate).AddMonths(addmonth)).Days;

                foreach (var row in request.rows)
                {
                    if (row.Row9 == "001")
                    {
                        using (SqlConnection conn = new SqlConnection(new ClsGetConnection().PlsConnect()))
                        {
                            conn.Open();
                            string selectSQL = @"
                                SELECT CASE 
                                    WHEN @Days < 31 THEN Perc 
                                    WHEN @Days BETWEEN 31 AND 33 THEN Perc 
                                    WHEN @Days > 33 THEN Perc 
                                    ELSE 0 
                                END AS Interest
                                FROM tblIntRate 
                                WHERE IntRateCode = 
                                    CASE 
                                        WHEN @Days < 31 THEN '04' 
                                        WHEN @Days BETWEEN 31 AND 33 THEN '05' 
                                        ELSE '06' 
                                    END";

                            using (SqlCommand mycommand = new SqlCommand(selectSQL, conn))
                            {
                                mycommand.Parameters.AddWithValue("@Days", days);
                                using (SqlDataReader dr = mycommand.ExecuteReader())
                                {
                                    if (dr.Read())
                                    {
                                        double interest = double.Parse(dr["Interest"].ToString());
                                        row.Row6 = (interest * 100).ToString() + "%";
                                        row.Row4 = interest.ToString();
                                        row.Row5 = (interest * double.Parse(row.Row8)).ToString("N2");
                                    }
                                }
                            }
                        }
                        addmonth++;
                    }

                    newRow.Add(row);
                }

                var detailsModel = new DetailsModel
                {
                    txtInterestDue = request.rows.Where(r => !string.IsNullOrEmpty(r.Row7))
                                                 .Sum(r => Convert.ToDouble(r.Row7)).ToString("N2"),
                    txtForDiscount = request.rows.Where(r => !string.IsNullOrEmpty(r.Row5))
                                                  .Sum(r => Convert.ToDouble(r.Row5)).ToString("N2"),

                   

                    rows = newRow
                };

                detailsModel.txtRSDiscount = (double.Parse(detailsModel.txtInterestDue) - double.Parse(detailsModel.txtForDiscount)).ToString("N2");

                return detailsModel;
            }
            catch (Exception ex)
            {
                throw new Exception("Error processing request: " + ex.Message);
            }
        }



        [HttpGet("ListForPullOut/{cnCode}")]
        public IActionResult ListForPullOut(string cnCode)
        {
            List<PullOutItem> items = new List<PullOutItem>();

            //string connectionString = _configuration.GetConnectionString(""); // Replace with your config

            string sql = @"
                SELECT CustName, PawnTicketNew, BoxNo, 
                       FORMAT(TDate, 'yyyy-MM-dd') AS TDate, 
                       '0' AS Post, PawnTicket 
                FROM ViewAuctionItem 
                WHERE DATEDIFF(month, TDate, GETDATE()) > 5 
                  AND ((VoucherNew = 'PS' AND Renewed = 0) OR VoucherNew = 'RS') 
                  AND PullOut = 0 
                  AND CNCode = @CNCode 
                GROUP BY CustName, PawnTicketNew, BoxNo, TDate, PawnTicket";

            using (SqlConnection conn = new SqlConnection(new ClsGetConnection().PlsConnect()))
            using (SqlCommand cmd = new SqlCommand(sql, conn))
            {
                cmd.Parameters.AddWithValue("@CNCode", cnCode);
                conn.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        items.Add(new PullOutItem
                        {
                            CustName = reader["CustName"].ToString(),
                            PawnTicketNew = reader["PawnTicketNew"].ToString(),
                            Box = reader["BoxNo"].ToString(),
                            Post = reader["Post"].ToString(),
                            PawnTicket = reader["PawnTicket"].ToString(),
                            TDate = Convert.ToDateTime(reader["TDate"])
                        });
                    }
                }
            }

            return Ok(items);
        }


        





        [HttpGet("PullOutPawnTickets/{cnCode}/{pt}")]
        public IActionResult PullOutPawnTickets(string cnCode, string pt)
        {
            List<string> pawnTickets = new List<string>();

            string sql = @"
                SELECT PawnTicketNew, 
                       FORMAT(TDate, 'yyyy-MM-dd') AS TDate 
                FROM ViewAuctionItem 
                WHERE DATEDIFF(month, TDate, GETDATE()) > 5 
                  AND ((VoucherNew = 'PS' AND Renewed = 0) OR VoucherNew = 'RS') 
                  AND PullOut = 0 
                  AND CNCode = @CNCode 
                GROUP BY PawnTicketNew, TDate";

            using (SqlConnection conn = new SqlConnection(new ClsGetConnection().PlsConnect()))
            using (SqlCommand cmd = new SqlCommand(sql, conn))
            {
                cmd.Parameters.AddWithValue("@CNCode", cnCode);
                conn.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        pawnTickets.Add(reader["PawnTicketNew"].ToString());
                    }
                }
            }

            bool exists = pawnTickets.Contains(pt);

            if (exists)
            {
                return Ok(new { success = true, message = "Pawn ticket found." });
            }
            else
            {
                return NotFound(new { success = false, message = "Pawn ticket not found." });
            }
        }


        private string remainingBal(string lblMonthIntAmt, string strPawnTicket, string strCNCode)
        {
            double dblTotalPayment = 0;
            double dblTotalInt = 0;
            int dblTotalMonth = 0;

            string connectionString = new ClsGetConnection().PlsConnect();

            using (SqlConnection myconnection = new SqlConnection(connectionString))
            {
                myconnection.Open();
                
                // Check if transaction exists
                string queryCount = "SELECT COUNT(*) FROM ViewTotalPaymentRS WHERE PawnTicket = @PawnTicket AND CNCode = @CNCode";
                using (SqlCommand com = new SqlCommand(queryCount, myconnection))
                {
                    com.Parameters.AddWithValue("@PawnTicket", strPawnTicket);
                    com.Parameters.AddWithValue("@CNCode", strCNCode);
                    int CountData = (int)com.ExecuteScalar();

                    if (CountData > 0)
                    {
                        // Retrieve total payment and total months
                        string querySum = "SELECT SumTotalPayment, SumNoMonth FROM ViewTotalPaymentRS WHERE PawnTicket = @PawnTicket AND CNCode = @CNCode";
                        using (SqlCommand mycommand = new SqlCommand(querySum, myconnection))
                        {
                            mycommand.Parameters.AddWithValue("@PawnTicket", strPawnTicket);
                            mycommand.Parameters.AddWithValue("@CNCode", strCNCode);
                            
                            using (SqlDataReader dr = mycommand.ExecuteReader())
                            {
                                if (dr.Read())
                                {
                                    dblTotalPayment = dr["SumTotalPayment"] != DBNull.Value ? Convert.ToDouble(dr["SumTotalPayment"]) : 0;
                                    dblTotalMonth = dr["SumNoMonth"] != DBNull.Value ? Convert.ToInt32(dr["SumNoMonth"]) : 0;
                                }
                            }
                        }
                    }
                }
            }

            // Ensure lblMonthIntAmt.Text is a valid number before parsing
            if (double.TryParse(lblMonthIntAmt, out double monthIntAmt))
            {
                dblTotalInt = monthIntAmt * dblTotalMonth;
            }
            else
            {
                dblTotalInt = 0; // Default to zero if conversion fails
            }

            return (dblTotalInt - dblTotalPayment).ToString("N2");
        }


        [HttpPost("Items")]
        public async Task<IActionResult> PullOutTickets([FromBody] List<string> pawnTickets)
        {
            if (pawnTickets == null || pawnTickets.Count == 0)
                return BadRequest("No pawn tickets provided.");

            //string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using SqlConnection conn = new SqlConnection(new ClsGetConnection().PlsConnect());
            await conn.OpenAsync();

            using SqlTransaction transaction = conn.BeginTransaction();

            try
            {
                foreach (var ticket in pawnTickets)
                {
                    using SqlCommand cmd = new SqlCommand("UPDATE tblMain1 SET PullOut = 1 WHERE PawnTicket = @PawnTicket", conn, transaction);
                    cmd.Parameters.AddWithValue("@PawnTicket", ticket);
                    await cmd.ExecuteNonQueryAsync();
                }

                await transaction.CommitAsync();
                return Ok("PullOut status updated successfully.");
            }
            catch
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "An error occurred while updating tickets.");
            }
        }



		
	}

}

