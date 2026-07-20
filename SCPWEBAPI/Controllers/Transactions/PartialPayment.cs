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
using static SCPWEBAPI.FldrModels.TransactionModel;
using static SCPWEBAPI.FldrModels.PartialPaymentModel;

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
    [Route("API/SCPWEBAPI/PartialPayment")]
    public class PartialPaymentController : ControllerBase
    {   
        int varintTableDoor = 0;
        int number = 0;



        private string privarstrVoidRS;

        private readonly ILogger<PartialPaymentController> _logger;

        public PartialPaymentController(ILogger<PartialPaymentController> logger)
        {
            _logger = logger;
        }

		public class PawnTicketRequest
		{
			public string PawnTicketNo { get; set; }
		}

		public ArrayList SN = new ArrayList();
        string dblPawnTicket, dblVDate, dblVoucher;

        private readonly ClsValidation _clsvalidation = new ClsValidation();
        private readonly ClsGetSomethingOthers _clsGetSomethingOthers = new ClsGetSomethingOthers();
        private readonly ClsAutoNum _clsAutoNum1 = new ClsAutoNum();
        

        [HttpGet("InitialLoad/{cnCode}")]
        public IActionResult InitialLoad(string cnCode)
        {
            try
            {
                // Generate document number
                var txtDocNumRenew = new Utilities().VoucherAutoNum("RS", cnCode);

				// Check for existing void reference
				_clsGetSomethingOthers.ClsGetVoidRef("RS", "1", cnCode, txtDocNumRenew);
                var privarstrVoidIC = _clsGetSomethingOthers.plsVoidIC;

                if (_clsvalidation.emptytxt(privarstrVoidIC))
                {
                    return Ok(new { Message = "No errors found." });
                }

				// Delete error transaction if void reference is found
				_clsGetSomethingOthers.ClsDeleteErrorTransaction("RS", "1", cnCode, txtDocNumRenew);
                return Ok(new { Message = "Error transaction deleted successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString()); // Log exception
                return StatusCode(500, new { Error = "An unexpected error occurred.", Details = ex.Message });
            }
        }



        [HttpGet("PartialPaymentOnload/{strURICNCode}")]
        public IActionResult PartialPaymentOnload(string strURICNCode)
        {
            try
            {
                var today = DateTime.Today;

                var result = new
                {
                    txtRNPTNum = new ClsAutoNum().RSPTAutoNum(strURICNCode),
                    txtPawnticket = new ClsAutoNum().PTAutoNum(strURICNCode),
                    txtDocNumRenew = new Utilities().VoucherAutoNum("RS", strURICNCode),
                    txtReference = new ClsAutoNum().RSPTAutoNum(strURICNCode),
                    txtTDate = today.ToString("yyyy-MM-dd")
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500, new { Error = "An unexpected error occurred." });
            }
        }




        [HttpGet("PartialPaymentDetailsMainFetch")]
        public IActionResult PartialPaymentDetailsMainFetch([FromQuery] SearhDetails values)
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

                if (ticketDetails == null)
                {
                    return NotFound("Pawn ticket not found.");
                }


                if (detailsInfo == null)
                {
                    return BadRequest("Error fetching details contact administrator.");
                }

                var dateValidate = getDateValidate(detailsInfo, vDate.txtPawnDate);
                

                var model = new RenewalMainModel
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



        
        // no need
        [HttpPost("txtMonthValidating")]
        public IActionResult txtMonthValidating(
            [FromQuery] SearhDetails values,
            [FromBody] DetailsModel request,
            [FromQuery] int month, 
            [FromQuery] string pawndate)
        {
            if (month <= 0) 
                return BadRequest("Invalid month value.");

            try
            {
                var dateValidate = getDateValidate(request, pawndate);
                string txtNewPawnDate = NewDLG(pawndate, month);
                var totalPaid = getTotalPaid(values, request.lblMonthIntAmt, month);

                
                return Ok(new DetailsMonthModel
                {
                    txtNewPawnDate = txtNewPawnDate,
                    dateValidate = dateValidate,
                    totalPaid = totalPaid
                    
                });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }




        private string NewDLG(string pawndate, int month)
        {
            DateTime newPawnDate = DateTime.Parse(pawndate).AddMonths(month);
            return newPawnDate.ToString("yyyy-MM-dd");
        }


        private totalPaidModel getTotalPaid(SearhDetails values, string lblMonthIntAmt, int month)
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

                    double txtInterestDue = 0.00;
                    double txtForDiscount = 0.00;

                    while (dr.Read())  // Iterate over each row from the query result
                    {   
                        // Assign values inside the loop

                        string strLoanAmt = double.Parse(dr["LoanAmount"].ToString()).ToString("N2");
  
                        string strIntRate = (double.Parse(dr["IntRate"].ToString()) / 100).ToString("N2");
                        string strInterest = dr["Interest"].ToString();
                        string strItemDesc = dr["ItemDesc"].ToString();
                        string strCatCode = dr["CatCode"].ToString();


                        DateTime DTLatestPawnDate = Convert.ToDateTime(dr["VDate"].ToString());
                 
                        for (int x = 1; x < month + 1; x++)
                        {
                            DateTime dgvDate = DTLatestPawnDate.AddMonths(x);

                            scheduleList.Add(new Rows
                            {
                                
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

                    if (scheduleList.Count > 0)
                    {
                        txtInterestDue = scheduleList.Sum(s => Convert.ToDouble(s.Row7));
                        txtForDiscount = scheduleList.Sum(s => Convert.ToDouble(s.Row5));

                        return new totalPaidModel
                        {
                            txtInterestDue = txtInterestDue.ToString("N2"),
                            txtForDiscount = txtForDiscount.ToString("N2"),
                            txtRSDiscount = (txtInterestDue - txtForDiscount).ToString("N2"),
                            txtRemainingBal = remainingBal(lblMonthIntAmt, values.pawnTicket, values.cnCode),
                            rows = scheduleList
                        };
                    }

                    return null; // Return null if no records were found
                }


            }

            return null;
        }

        /*private string GetTotalPayment(DetailsModel request)
        {
            double interestDue = double.TryParse(request.txtInterestDue, out double tempInterest) ? tempInterest : 0.00;
            double serviceFee = double.TryParse(request.txtServiceFee, out double tempServiceFee) ? tempServiceFee : 0.00;
            double penalty = double.TryParse(request.txtPenalty, out double tempPenalty) ? tempPenalty : 0.00;
            double discount = double.TryParse(request.txtDiscount, out double tempDiscount) ? tempDiscount : 0.00;
            double rsDiscount = double.TryParse(request.txtRSDiscount, out double tempRSDiscount) ? tempRSDiscount : 0.00;

            double amountDue = (interestDue + serviceFee + penalty) - (discount + rsDiscount);
            
            return amountDue.ToString("N2");
        }*/




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

						//months = ClsDateDiff.GetMonths("", "") + 1;

						months = ClsDateDiff.GetMonths(Convert.ToDateTime(txtPawnDate), Convert.ToDateTime(today)) + 1;
                        
                        //_logger.LogInformation("Months: {Months}", );
                        

                        

                        for (int x = 1; x < months; x++)
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
							//txtRenewCAmount = cAmount.ToString("N2"),
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
                            txtServiceFee = "0.00",
                            txtPenalty = "0.00",
							txtDiscount = "0.00",
							//noOfMonths = months,
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




        [HttpGet("GetCustomersName/{strURICNCode}")]  
        public IActionResult GetCustomersName(string strURICNCode) 
        {

            try
            {
                var result = new ClsBuildComboBox().ClsBuildControlnoOR(strURICNCode);
                return Ok(result);
            }
            catch (Exception ex)
            {
            
                return BadRequest(new { Error = ex.Message });
            }
        }



        [HttpGet("GetPawnTickets/{strURICNCode}")]
        public IActionResult GetPawnTickets(string strURICNCode)
        {

            try
            {
                var result = new ClsBuildComboBox().ClsbuildcboCustCode(strURICNCode);
                return Ok(result);
            }
            catch (Exception ex)
            {
            
                return BadRequest(new { Error = ex.Message });
            }
        }


		// Private class definition
		

		[HttpPost("SearchPawnTicket")]
		public IActionResult SearchPawnTicket([FromBody] string request)
		{
			var result = Newtonsoft.Json.JsonConvert.SerializeObject(request);
            var renewalData = new ModelRenewalFormData();

            result = result.Trim();
            
            using (var myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
            {
                myconnection.Open();
                
                using (var mycommand = new SqlCommand(
                    "SELECT PawnTicket, " +
                    "CASE WHEN RSPawnTicket = '0000000' THEN PawnTicket ELSE RSPawnTicket END AS RSPawnTicket, " +
                    "Voucher " + // Make sure to include Voucher in your SELECT
                    "FROM tblMain1 " +
                    "WHERE Void = 0 AND PullOut = 0 AND PartialPayment = 0 AND Redeemed = 0 AND Renewed = 0 AND CNCode = @CnCode " +
                    "GROUP BY PawnTicket, RSPawnTicket, ControlNo, Voucher " + // Include Voucher in GROUP BY
                    "HAVING (PawnTicket = @SearchText OR RSPawnTicket = @SearchText) " +
                    "ORDER BY RSPawnTicket", myconnection))
                {
                    mycommand.Parameters.AddWithValue("@CnCode", "10");
                    mycommand.Parameters.AddWithValue("@SearchText", result.ToString());
                    mycommand.CommandTimeout = 900;

                    

                    using (var dr = mycommand.ExecuteReader())
                    {
                        if (dr.Read()) // Ensure there's data to read
                        {
                            dblPawnTicket = dr["PawnTicket"].ToString();
                            dblVoucher = dr["Voucher"].ToString();

                            // Update the status based on Voucher
                            if (dblVoucher == "PS")
                            {
                                renewalData.txtStatus = "New";
                            }
                            else
                            {
                                renewalData.txtStatus = "Renewed";
                            }
                        }
                        else
                        {
							// Handle case when no records are found
							renewalData.txtStatus = "Not found.";
                        }
                    }

                   

				}
            }

			return Ok(renewalData.txtStatus);

		}

        [HttpPost("GetDetailsInfo/{cnCode}/{pawnTicket}")]
		public IActionResult GetDetailsInfo(string cnCode, string pawnTicket)
        {
            var renewalData = new ModelRenewalFormData();

            using (var connection = new SqlConnection(new ClsGetConnection().PlsConnect()))
            {
                connection.Open();
                string selectSQL = "SELECT * FROM ViewGetStockInfo " +
                                   "WHERE PawnTicket = (SELECT TOP 1 PawnTicket FROM tblMain1 " +
                                   "WHERE PawnTicket = @PawnTicket OR RSPawnTicket = @PawnTicket " +
                                   "ORDER BY VDate DESC) " +
                                   "AND CNCode = @CnCode";

                using (var command = new SqlCommand(selectSQL, connection))
                {
                    command.Parameters.AddWithValue("@PawnTicket", pawnTicket);
                    command.Parameters.AddWithValue("@CnCode", cnCode);

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read()) // Check if there are results
                        {
                            renewalData.txtRenewCAmount = double.Parse(reader["CAmount"].ToString()).ToString("N2");
                            renewalData.txtBox = reader["BoxNo"].ToString();

                            // DateTime pawnDate = DateTime.Parse(txtPawnDate.Text);
                            // DateTime dueDate = pawnDate.AddMonths(int.Parse(reader["Term"].ToString()));
                            // DateTime auctionDate = pawnDate.AddMonths(6);

                            // renewalData.txtDueDate.Text = dueDate.ToString("MM/dd/yyyy");
                            // renewalData.txtAuctionDate.Text = auctionDate.ToString("MM/dd/yyyy");
                            renewalData.txtRemarksRenew = DateTime.Parse(reader["TDate"].ToString()).ToString("MM/dd/yyyy");
                        }
                    }
                }
            }

            return Ok(renewalData);
        }



        [HttpGet("GetPawnerPawnTickets/{cnCode}/{controlNo}")]
        public IActionResult GetPawnerPawnTickets(string cnCode, string controlNo)
        {
            var arrayOfPawntickets = new List<string>();  // Use List instead of an array

            using (var connection = new SqlConnection(new ClsGetConnection().PlsConnect()))
            {
                connection.Open();
                string selectSQL = "SELECT CASE WHEN RSPawnTicket = '0000000' THEN PawnTicket ELSE RSPawnTicket END AS PawnTicket " +
                                   "FROM tblMain1 WHERE ControlNo = @controlNo AND CNCode = @cnCode " +
                                   "GROUP BY PawnTicket, RSPawnTicket;";  // Fix the SQL syntax

                using (var command = new SqlCommand(selectSQL, connection))
                {
                    command.Parameters.AddWithValue("@controlNo", controlNo);
                    command.Parameters.AddWithValue("@cnCode", cnCode);

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())  // Loop through all results
                        {
                            var pawnTicket = reader["PawnTicket"].ToString();
                            arrayOfPawntickets.Add(pawnTicket);  // Add each result to the list
                        }
                    }
                }
            }

            // If no results were found, return a 404 Not Found status code
            if (arrayOfPawntickets.Count == 0)
            {
                return NotFound("No pawn tickets found.");
            }

            return Ok(arrayOfPawntickets);  // Return the list of pawn tickets
        }





        [HttpPost("validate")]
        public IActionResult GetDateValidate([FromBody] ValidateRequest request)
        {
            try
            {
              
                List<Rows> newRow = new List<Rows>();

                int addmonth = 0;
                DateTime VarToday = DateTime.Today;
                int days = (VarToday - DateTime.Parse(request.TxtPawnDate).AddMonths(addmonth)).Days;

                foreach (var row in request.Rows)
                {
                    if (row.Row9 == "001")
                    {
                        using (SqlConnection conn = new SqlConnection(new ClsGetConnection().PlsConnect()))
                        {
                            conn.Open();
                            string selectSQL = "(SELECT CASE " +
                                "WHEN @Days < 31 THEN (SELECT Perc FROM tblIntRate WHERE IntRateCode = '04') " +
                                "WHEN @Days > 30 AND @Days < 34 THEN (SELECT Perc FROM tblIntRate WHERE IntRateCode = '05') " +
                                "WHEN @Days > 33 THEN (SELECT Perc FROM tblIntRate WHERE IntRateCode = '06') ELSE 0 END AS Interest)";

                            using (SqlCommand mycommand = new SqlCommand(selectSQL, conn))
                            {
                                mycommand.Parameters.AddWithValue("@Days", days);
                                using (SqlDataReader dr = mycommand.ExecuteReader())
                                {
                                    if (dr.Read())
                                    {
                                        row.Row6 = (double.Parse(dr["Interest"].ToString()) * 100).ToString() + "%";
                                        row.Row4 = dr["Interest"].ToString();
                                        row.Row5 = (double.Parse(row.Row4) * double.Parse(row.Row8)).ToString("N2");
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
                    txtInterestDue = request.Rows.Where(r => !string.IsNullOrEmpty(r.Row7))
                                                 .Sum(r => Convert.ToDouble(r.Row7)).ToString("N2"),
                    txtForDiscount = request.Rows.Where(r => !string.IsNullOrEmpty(r.Row5))
                                                  .Sum(r => Convert.ToDouble(r.Row5)).ToString("N2"),
                    rows = newRow 
                };

                detailsModel.txtRSDiscount = (double.Parse(detailsModel.txtInterestDue) - double.Parse(detailsModel.txtForDiscount)).ToString("N2");

                return Ok(detailsModel);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }





        [HttpPost("UpdatePartialPayment")]
        public IActionResult UpdatePartialPayment([FromBody] UpdatePP model)
        {
            using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
            {
                string sqlUpdate = @"
                    UPDATE tblMain1 
                    SET PartialPayment = 1, PPAmount = @_PPAmount, Remarks = @_Remarks 
                    WHERE 
                    CNCode = @_CnCode 
                    AND (
                        (PawnTicket = @_PawnTicket AND RSPawnTicket = '0000000') 
                        OR RSPawnTicket = @_PawnTicket
                    );";

                try
                {
                    myconnection.Open();
                    using (SqlTransaction transaction = myconnection.BeginTransaction())
                    {
                        try
                        {
                            using (SqlCommand command = new SqlCommand(sqlUpdate, myconnection, transaction))
                            {
                                command.Parameters.Add("_PPAmount", SqlDbType.Decimal).Value = model.PPAmount;
                                command.Parameters.Add("_Remarks", SqlDbType.VarChar).Value = model.Remarks;
                                command.Parameters.Add("_PawnTicket", SqlDbType.VarChar).Value = model.PawnTicket;
                                command.Parameters.Add("_CnCode", SqlDbType.VarChar).Value = model.CnCode;



                                command.ExecuteNonQuery();
                            }

                            transaction.Commit();
                            return Ok("Data successfully updated.");
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            // log error
                            return StatusCode(500, "Contact your administrator.");
                        }
                    }
                }
                catch (Exception ex)
                {
                    // log error
                    return BadRequest("Unexpected error occurred.");
                }
            }
        }





        


		
	}

}

