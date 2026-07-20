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
using static SCPWEBAPI.FldrModels.RedemptionModel;
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
    [Route("API/SCPWEBAPI")]
    public class RedemptionController : ControllerBase
    {   
        int varintTableDoor = 0;
        int number = 0;
        private string privarstrVoidRS;
        public ArrayList SN = new ArrayList();
        string dblPawnTicket, dblVDate, dblVoucher;

        private readonly ILogger<RedemptionController> _logger;

        SqlCommand mycommand;
        SqlConnection myconnection;
        SqlDataReader dr;
        public RedemptionController(ILogger<RedemptionController> logger)
        {
            _logger = logger;
        }

		

        private readonly ClsValidation _clsvalidation = new ClsValidation();
        private readonly ClsGetSomethingOthers _clsGetSomethingOthers = new ClsGetSomethingOthers();
        private readonly ClsAutoNum _clsAutoNum1 = new ClsAutoNum();
        

        [HttpGet("Redemption/InitialLoad")]
        public IActionResult InitialLoad(string cnCode)
        {
            try
            {
                // Generate document number
                var txtDocNumRenew = new Utilities().VoucherAutoNum("RD", cnCode);

				// Check for existing void reference
				_clsGetSomethingOthers.ClsGetVoidRef("RD", "1", cnCode, txtDocNumRenew);
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



        [HttpGet("Redemption/redemptionOnload")]
        public IActionResult redemptionOnload(string strURICNCode)
        {
            try
            {
                var redemptionDataOnLoad = new RedemptionOnLoad();

                var docNum = new Utilities().VoucherAutoNum("RD", strURICNCode);

                redemptionDataOnLoad.txtDocNumRenew = docNum;
                redemptionDataOnLoad.txtReference = "RD" + docNum;         
                
                DateTime VarToday = DateTime.Today;
                redemptionDataOnLoad.txtTDate = Convert.ToDateTime(VarToday).ToString("yyyy-MM-dd"); // Fixed typo

                return Ok(redemptionDataOnLoad);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString()); // Log exception
                return StatusCode(500, new { Error = "An unexpected error occurred." });
            }
        }


        [HttpPost("Renewal/TDateValidation")]
        public IActionResult TDateValidation([FromBody] TDateValidationModel request)
        {
            if (request?.items == null || !request.items.Any())
            {
                return BadRequest(new { error = "Items cannot be null or empty." });
            }

            try
            {
                var tDate = request.txtTDate;

                if (new ClsValidation().errordate(tDate))
                {
                    return BadRequest(new { error = "Invalid Date: " + tDate });
                }

                if (tDate == "  /  /")
                {
                    return BadRequest(new { error = "Date cannot be empty." });
                }

                List<Items> newRow = new List<Items>();

                foreach (var row in request.items)
                {
                    if (row.Row9 == "001")
                    {
                        using (SqlConnection conn = new SqlConnection(new ClsGetConnection().PlsConnect()))
                        {
                            conn.Open();

                            int days = (int)(DateTime.Parse(tDate) - DateTime.Parse(request.txtLatestPawnDate)).TotalDays;

                            string query = @"
                                SELECT Perc FROM tblIntRate
                                WHERE IntRateCode = 
                                CASE 
                                    WHEN @days < 4 THEN '01'
                                    WHEN @days BETWEEN 4 AND 11 THEN '02'
                                    WHEN @days BETWEEN 12 AND 22 THEN '03'
                                    WHEN @days BETWEEN 23 AND 30 THEN '04'
                                    WHEN @days BETWEEN 31 AND 33 THEN '05'
                                    ELSE '06'
                                END";

                            using (SqlCommand mycommand = new SqlCommand(query, conn))
                            {
                                mycommand.Parameters.AddWithValue("@days", days);

                                using (SqlDataReader dr = mycommand.ExecuteReader())
                                {
                                    if (dr.Read())
                                    {
                                        double interest = double.Parse(dr["Perc"].ToString());
                                        row.Row4 = (interest * 100).ToString("N2") + "%";
                                        row.Row8 = (interest * double.Parse(row.Row5)).ToString("N2");
                                    }
                                }
                            }
                        }
                    }

                    newRow.Add(row);
                }

                var totalDiscount = newRow.Where(r => !string.IsNullOrEmpty(r.Row8))
                                          .Sum(r => Convert.ToDouble(r.Row8));

                var amountDue = strAmountDue(request.strPawnTicket, request.strCNCode,
                                             request.lblMonthIntAmt, request.txtPawnDate, 
                                             request.txtRenewCAmount);

                var redempDiscount = (Convert.ToDouble(amountDue) - 
                                     (Convert.ToDouble(request.txtRenewCAmount) + 
                                     (totalDiscount * ClsDateDiff.GetMonths(Convert.ToDateTime(request.txtLatestPawnDate), Convert.ToDateTime(tDate))))).ToString("N2");

                var newData = new TDateValidatedModel
                {
                    txtForDiscount = totalDiscount.ToString("N2"),
                    txtAmountDue = amountDue,
                    txtRedempDiscount = redempDiscount,
                    items = newRow
                };

                return Ok(newData);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }



        [HttpGet("Redemption/RedemptionSearchTicketDetails")]
        public IActionResult RedemptionSearchTicketDetails([FromQuery] SearhDetails values)
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
                // var dateValidate = getDateValidate(detailsInfo, vDate.txtPawnDate);

                if (ticketDetails == null)
                {
                    return NotFound("Pawn ticket not found.");
                }

                var model = new RedemptionMainModel
                {
                    ticketDetails = ticketDetails,
                    vDate = vDate,
                    detailsInfo = detailsInfo,
                    // dateValidate = dateValidate
                };

                return Ok(model);
            }
            catch (Exception ex)
            {
                //_logger.LogError(ex, "Error in RenewalPawnticket");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }



        private string strAmountDue(
                                    string strPawnTicket, 
                                    string strCNCode,
                                    string lblMonthIntAmt,
                                    DateTime txtPawnDate,
                                    string txtRenewCAmount
                                )
        {

            DateTime txtTDate = DateTime.Today;
            double dblTotalPayment = 0;
            int intNoMonth = 0;
            double dblTotalInt = 0;

            myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
            myconnection.Open();
            string CheckNoTransact = string.Format("SELECT Count(*) FROM ViewTotalPaymentRS WHERE PawnTicket = '" + strPawnTicket + "' AND CNCode='" + strCNCode + "'");
            SqlCommand com = new SqlCommand(CheckNoTransact, myconnection);
            int CountData = int.Parse(com.ExecuteScalar().ToString());
            myconnection.Close();
            if (CountData > 0)
            {
                myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
                myconnection.Open();
                mycommand = new SqlCommand("SELECT SumTotalPayment, SumNoMonth, SumDiscount FROM ViewTotalPaymentRS WHERE PawnTicket = '" + dblPawnTicket + "' AND CNCode='" + strCNCode + "'", myconnection);
                dr = mycommand.ExecuteReader();
                dr.Read();
                dblTotalPayment = double.Parse(dr["SumTotalPayment"].ToString())+ double.Parse(dr["SumDiscount"].ToString());
                intNoMonth = int.Parse(dr["SumNoMonth"].ToString());
                dr.Close();
                myconnection.Close();
            }
            else
            {
                intNoMonth = 0;
                dblTotalPayment=0;
            }
            
            dblTotalInt = double.Parse(lblMonthIntAmt) * (ClsDateDiff.GetMonths(Convert.ToDateTime(txtPawnDate), Convert.ToDateTime(txtTDate)));
            
            return (double.Parse(txtRenewCAmount)+(dblTotalInt - dblTotalPayment)).ToString("N2");
        }


        private DetailsModel getDetailsInfo(SearhDetails values, DateTime txtPawnDate)
        {
			/*string selectSQL = @"
                SELECT * FROM ViewGetStockInfo 
                WHERE PawnTicket = (SELECT TOP 1 PawnTicket 
                                   FROM tblMain1 
                                   WHERE PawnTicket = @PawnTicket OR RSPawnTicket = @PawnTicket  
                                   ORDER BY VDate DESC) 
                AND CNCode = @CNCode";*/

			string selectSQL = @"SELECT
                                    CAmount,
                                    Term,
                                    BoxNo,
                                    TDate,
                                    LoanAmount,
                                    IntRate,
                                    TotalLoanAmt,
                                    Interest,
                                    ItemDesc,
                                    CatCode,
                                    RedeemInt,
                                    VDate,
                                    ProductDesc,
                                    KaratDesc,
                                    Weight,
                                    PKProdNumber
                                FROM ViewGetStockInfo2
                                WHERE PawnTicket = (SELECT TOP 1 PawnTicket
				                                   FROM tblMain1
				                                   WHERE PawnTicket = @PawnTicket OR RSPawnTicket = @PawnTicket
				                                   ORDER BY VDate DESC) 
                                AND CNCode = @CNCode";
            /*AND Expr1 = '02'*/

		

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
                    int term = 0;
                    var today = DateTime.Today;

                    double loanAmount, redeemInt;

                    DateTime varDueDate = DateTime.MinValue;
                    DateTime varAuctionDate = DateTime.MinValue;

                    while (dr.Read())  // Iterate over each row from the query result
                    {   
                        // Assign values inside the loop
                        cAmount = dr["CAmount"] != DBNull.Value ? Convert.ToDouble(dr["CAmount"]) : 0.0;
                        term = dr["Term"] != DBNull.Value ? Convert.ToInt32(dr["Term"]) : 0;
                        boxNo = dr["BoxNo"].ToString();
                        formattedTDate = dr["TDate"] != DBNull.Value ? Convert.ToDateTime(dr["TDate"]).ToString("yyyy-MM-dd") : "N/A";

                        // Calculate dates (ensure txtPawnDate is declared somewhere outside)
                        varDueDate = txtPawnDate.AddMonths(term);
                        varAuctionDate = txtPawnDate.AddMonths(6);

                        // Safely parse values
                        loanAmount = dr["LoanAmount"] != DBNull.Value ? Convert.ToDouble(dr["LoanAmount"]) : 0.0;
                        double intRate = dr["IntRate"] != DBNull.Value ? Convert.ToDouble(dr["IntRate"]) / 100 : 0.0;
                        // double interest = dr["Interest"] != DBNull.Value ? Convert.ToDouble(dr["Interest"]) : 0.0;
                        // string itemDesc = dr["ItemDesc"].ToString();

                        string strLoanAmt = double.Parse(dr["LoanAmount"].ToString()).ToString("N2");
                        string strTotalLoanAmt = dr["TotalLoanAmt"].ToString();
                        string strIntRate = (double.Parse(dr["IntRate"].ToString()) / 100).ToString("N2");
                        string strInterest = dr["Interest"].ToString();
                        string strItemDesc = dr["ItemDesc"].ToString();
                        string strCatCode = dr["CatCode"].ToString();
                        //string strIntAmt = (double.Parse(strLoanAmt) * double.Parse(strIntRate)).ToString("N2");
                        string strIntAmt = (double.Parse(strLoanAmt) * double.Parse(dr["RedeemInt"].ToString()) / 100).ToString("N2");



                        DateTime DTLatestPawnDate = Convert.ToDateTime(dr["VDate"].ToString());
                        interestAmount = loanAmount * intRate;

                        months = ClsDateDiff.GetMonths(Convert.ToDateTime(txtPawnDate), Convert.ToDateTime(today)) + 1;
                        
                        _logger.LogInformation("Months: {Months}", months);
                        

                        //DateTime dgvDate = DTLatestPawnDate.AddMonths(x);

                        if (double.TryParse(dr["LoanAmount"].ToString(), out loanAmount) && double.TryParse(dr["RedeemInt"].ToString(), out redeemInt))
                        {
                            scheduleList.Add(new Rows
                            {
                                
                                Row1 = dr["ProductDesc"].ToString(),
                                Row2 = dr["KaratDesc"].ToString(),
                                Row3 = double.Parse(dr["Weight"].ToString()).ToString("N2"),
                                Row4 = (double.Parse(dr["RedeemInt"].ToString())*100).ToString("N2"),
                                Row5 = strLoanAmt,
                                Row6 = strIntAmt,
                                Row7 = dr["PKProdNumber"].ToString(),
								Row8 = ((loanAmount * redeemInt).ToString()),

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
                            //txtInterestDue = scheduleList.Sum(s => Convert.ToDouble(s.Row5)).ToString("N2"),
                            txtForDiscount = "0.00",
                            //txtRSDiscount = "0.00",
                            //txtRemainingBal = remainingBal(interestAmount.ToString("N2"), values.pawnTicket, values.cnCode),
                            // txtServiceFee = "5.00",
                            // txtPenalty = "0.00",
                            // txtDiscount = "0.00",
                            // noOfMonths = months,
                            txtPawnDate = txtPawnDate.ToString("yyyy-MM-dd"),
                            txtNoMonth = (term*30).ToString(),

                            txtAmountDue = strAmountDue(values.pawnTicket, values.cnCode, interestAmount.ToString("N2"), txtPawnDate, cAmount.ToString("N2")),

                            rows = scheduleList

                        };
                    }

                    return null; // Return null if no records were found
                }


            }

            return null;
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




        [HttpPost("Redemption/SaveRedemption")]
        public IActionResult SaveRedemption([FromBody] RedemptionSaveModel model)
        {
            

            using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
            {
                string insertQuery = @"
                   INSERT INTO tblMain1 (IC, DocNum, Voucher, UserCode, TDate, Reference, ControlNo, Remarks, CheckNo, CAmount, 
                   DE, CNCode, Term, PawnTicket, BoxNo, Appraiser) 
                   Values (@_IC, @_DocNum, @_Voucher, @_UserCode, @_TDate, @_Reference, @_ControlNo, @_Remarks,  @_CheckNo,
                    @_CAmount, @_DE, @_CNCode, @_Term, @_PawnTicket, @_BoxNo, @_Appraiser);

                   "; 

                try
                {
                    myconnection.Open();
                    using (SqlTransaction transaction = myconnection.BeginTransaction())
                    {
                        try
                        {
                            using (SqlCommand command = new SqlCommand(insertQuery, myconnection, transaction))
                            {
                                var tbl1 = model.main1;
                            

                                command.Parameters.Add("_IC", SqlDbType.VarChar).Value = tbl1.IC;
                                command.Parameters.Add("_DocNum", SqlDbType.VarChar).Value = tbl1.DocNum;
                                command.Parameters.Add("_Voucher", SqlDbType.VarChar).Value = "RD";
                                command.Parameters.Add("_UserCode", SqlDbType.VarChar).Value = tbl1.UserCode;
                                command.Parameters.Add("_TDate", SqlDbType.DateTime).Value = tbl1.TDate;
                                command.Parameters.Add("_Reference", SqlDbType.VarChar).Value = tbl1.Reference;
                                command.Parameters.Add("_ControlNo", SqlDbType.VarChar).Value = tbl1.ControlNo;
                                command.Parameters.Add("_Remarks", SqlDbType.VarChar).Value = tbl1.Remarks;
                                command.Parameters.Add("_CheckNo", SqlDbType.VarChar).Value = "NA";
                                command.Parameters.Add("_CAmount", SqlDbType.Decimal).Value = tbl1.CAmount;
                                command.Parameters.Add("_DE", SqlDbType.DateTime).Value = DateTime.Now;
                                command.Parameters.Add("_CNCode", SqlDbType.Char).Value = tbl1.CNCode;
                                command.Parameters.Add("_Term", SqlDbType.Int).Value = 0;
                                command.Parameters.Add("_PawnTicket", SqlDbType.VarChar).Value = tbl1.PawnTicket;
                                command.Parameters.Add("_BoxNo", SqlDbType.VarChar).Value = tbl1.BoxNo;
                                command.Parameters.Add("_Appraiser", SqlDbType.VarChar).Value = "NA";

                                command.ExecuteNonQuery();
                            }

                            
                            string insertTblMain3 = @"
                                    INSERT INTO tblMain3 (IC, RowNum, PaymentAmt, PenaltyFee, ServiceFee, Discount, Discount1) 
                                    Values (@_IC, @_RowNum, @_PaymentAmt, @_PenaltyFee, @_ServiceFee, @_Discount, @_Discount1);
                               ";

                            using (SqlCommand cmd = new SqlCommand(insertTblMain3, myconnection, transaction))
                            {
                                var tbl3 = model.main3;


                                cmd.Parameters.Add("_IC", SqlDbType.VarChar).Value = tbl3.IC;
                                cmd.Parameters.Add("_RowNum", SqlDbType.Int).Value = 1;
                                cmd.Parameters.Add("_PaymentAmt", SqlDbType.Money).Value = tbl3.PaymentAmt;
                                cmd.Parameters.Add("_PenaltyFee", SqlDbType.Money).Value = tbl3.PenaltyFee;
                                cmd.Parameters.Add("_ServiceFee", SqlDbType.Money).Value = tbl3.ServiceFee;
                                cmd.Parameters.Add("_Discount", SqlDbType.Money).Value = tbl3.Discount;
                                cmd.Parameters.Add("_Discount1", SqlDbType.Money).Value = tbl3.Discount1;


                                cmd.ExecuteNonQuery();
                            }


                            string insertTblMain2 = @"INSERT INTO tblMain2 (IC, PKProdNumber, RowNum, PIn, POut) Values (@_IC, @_PKProdNumber, @_RowNum, @_PIn, @_POut);";
                            var tbl2 = model.main2;
                            int intRowNum = 1;

                                //Loop through each activity and insert
                            foreach (var rowData in tbl2.items)
                            {
                                using (SqlCommand cmd2 = new SqlCommand(insertTblMain2, myconnection, transaction))
                                {
                                    // Add parameters with the appropriate data types
                                    cmd2.Parameters.Add("_IC", SqlDbType.VarChar).Value = tbl2.IC;
                                    cmd2.Parameters.Add("_PKProdNumber", SqlDbType.VarChar).Value = rowData.Row7;
                                    cmd2.Parameters.Add("_RowNum", SqlDbType.Int).Value = intRowNum++;
                                    cmd2.Parameters.Add("_PIn", SqlDbType.Int).Value = 0;
                                    cmd2.Parameters.Add("_POut", SqlDbType.Int).Value = 1;

                                    cmd2.ExecuteNonQuery();

                                }
                            }



                             _clsGetSomethingOthers.ClsFinalize1("RD", model.main1.DocNum, "1", model.main1.CNCode, myconnection, transaction);

                            if (_clsGetSomethingOthers.varFinalize)
                            {
                                string redeemThis = @"
                                    UPDATE tblMain1 
                                    SET Redeemed = 1 
                                    WHERE PawnTicket = @pawnTicket OR RSPawnTicket = @pawnTicket;
                                ";

                                using (SqlCommand cmd = new SqlCommand(redeemThis, myconnection, transaction))
                                {
                                    cmd.Parameters.AddWithValue("@pawnTicket", model.main1.PawnTicket);
                                    cmd.ExecuteNonQuery();
                                }
                            }
                            

                            transaction.Commit();
                            Console.WriteLine("Transaction committed successfully");
                            return Ok("Data successfully inserted.");


                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            Console.WriteLine($"Transaction rolled back: {ex.Message}");
                            return StatusCode(500, "Contact your administrator.");
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"General Exception: {ex.Message}");
                    return BadRequest("Unexpected error occurred.");
                }
            }


        }

        /*[HttpPost("Redemption/RedeemThis")]
        public IActionResult SaveRedemption([FromQuery] )
        {
           


        }*/


       

                            

        /*private void RedeemThis(string strPawnTicket)
        {
            ConnectionOpen();
            string sqlUpdate = ";
            mycommand = new SqlCommand(sqlUpdate, myconnection);
            mycommand.ExecuteNonQuery();
            myconnection.Close();
        }*/




        
        


		
	}

}


