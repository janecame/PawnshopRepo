using System.Data;
using System.Data.Common;
using System.Data.SqlClient;

using System.Net;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Collections;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;

using System.ComponentModel.DataAnnotations;



using SCPWEBAPI.FldrClass;

namespace SCPWEBAPI.Controllers
{   
    [ApiController]
    [Route("API/SCPWEBAPI/Voucher")]
    public class Voucher : ControllerBase
    {


        [HttpGet("NewLoan")]
        public IActionResult GetNewLoans(
            [FromQuery][Required] string cnCode,
            [FromQuery][Required] string beginDate,
            [FromQuery][Required] string endDate)
        {
            // Validate and parse dates
            if (!DateTime.TryParse(beginDate, out DateTime startDate) || !DateTime.TryParse(endDate, out DateTime endDateParsed))
            {
                return BadRequest(new { message = "Invalid date format. Use YYYY-MM-DD." });
            }

            if (startDate > endDateParsed)
            {
                return BadRequest(new { message = "Begin date cannot be later than end date." });
            }

            var results = new List<object>();

            decimal totalPrincipal = 0;
            decimal totalAmount = 0;

            string query = @"
                SELECT 
                    m1.IC,
                    m1.BoxNo,
                    m1.PawnTicket,
                    m1.DLGDate,
                    c.CustName,
                    m2.PIn,
                    i.ItemDesc + '-' + md.MadeDesc AS Item,
                    m2.LoanAmount,
                    k.KaratDesc,
                    s.Weight,
                    m1.Remarks
                FROM tblMain1 m1
                INNER JOIN tblCustomer c 
                    ON m1.ControlNo = c.ControlNo   -- adjust actual PK/FK
                INNER JOIN tblMain2 m2 
                    ON m1.IC = m2.IC
                LEFT JOIN tblStocks s 
                    ON m2.PKProdNumber = s.PKProdNumber AND s.CNCode = m1.CNCode
                LEFT JOIN tblEntryItem i 
                    ON s.ItemCode = i.ItemCode AND i.CNCode = m1.CNCode
                LEFT JOIN tblEntryMade md 
                    ON s.MadeCode = md.MadeCode AND md.CNCode = m1.CNCode
                LEFT JOIN tblEntryKarat k 
                    ON s.KaratCode = k.KaratCode AND k.CNCode = m1.CNCode
                LEFT JOIN tblEntryDiamondShape ds 
                    ON s.DiamondShapeCode = ds.DiamondShapeCode AND ds.CNCode = m1.CNCode
                LEFT JOIN tblEntryColor clr 
                    ON s.ColorCode = clr.ColorCode AND clr.CNCode = m1.CNCode
                LEFT JOIN tblEntryBirthStone bs 
                    ON s.BirthStoneCode = bs.BirthStoneCode AND bs.CNCode = m1.CNCode
                WHERE m1.CNCode = @CnCode 
                  AND m1.TDate BETWEEN @BeginDate AND @EndDate
                  AND m1.Voucher = 'PS' 
                  AND m1.Void = 0 
                  --AND m1.PartialPayment = 0
                  --AND m1.PartialPayment = 1
                  
                ORDER BY m1.DLGDate, m1.PawnTicket ASC;";



            /*string query = @"
                SELECT BoxNo, PawnTicket, OldDLG AS DLGDate, CustName, PIn, Item, LoanAmount, KaratDesc, Weight, LoanAmount, Remarks
                FROM ViewJhed 
                WHERE CNCode = @CnCode AND TDate BETWEEN @BeginDate AND @EndDate  
                ORDER BY OldDLG, PawnTicket ASC";*/





            
            try
            {
                using (SqlConnection con = new SqlConnection(new ClsGetConnection().PlsConnect()))
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@CnCode", cnCode);
                    cmd.Parameters.AddWithValue("@BeginDate", startDate);
                    cmd.Parameters.AddWithValue("@EndDate", endDateParsed);

                    con.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        int counter = 1;

                        while (reader.Read())
                        {

                            decimal loanAmount = reader["LoanAmount"] != DBNull.Value ? Convert.ToDecimal(reader["LoanAmount"]) : 0;

                            results.Add(new
                            {
                                No = counter++,
                                BoxNo = reader["BoxNo"],
                                PawnTicket = reader["PawnTicket"],
                                DLGDate = reader["DLGDate"],
                                CustName = reader["CustName"],
                                PIn = reader["PIn"],
                                Item = reader["Item"],
                                PrincipalAmount = reader["LoanAmount"], //principal
                                KaratDesc = reader["KaratDesc"] != DBNull.Value ? reader["KaratDesc"].ToString() : string.Empty,
                                Weight = reader["Weight"],
                                Amount = reader["LoanAmount"], //Amount
                                Remarks = reader["Remarks"]
                            });

                            totalPrincipal += loanAmount;
                            totalAmount += loanAmount;

                        }
                    }
                }

                //return Ok(result);
                return Ok(new
                {
                    list = results,
                    grandTotal = new
                    {
                        PrincipalAmount = totalPrincipal,
                        Amount = totalAmount
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }



        [HttpGet("Renewal")]
        public IActionResult GetRenewals(
            [FromQuery][Required] string cnCode,
            [FromQuery][Required] string beginDate,
            [FromQuery][Required] string endDate)
        {
            // Validate and parse dates
            if (!DateTime.TryParse(beginDate, out DateTime startDate) || !DateTime.TryParse(endDate, out DateTime endDateParsed))
            {
                return BadRequest(new { message = "Invalid date format. Use YYYY-MM-DD." });
            }

            if (startDate > endDateParsed)
            {
                return BadRequest(new { message = "Begin date cannot be later than end date." });
            }

            var results = new List<object>();


            decimal totalPrincipal = 0;
            decimal totalAmountIntPaid = 0;
            decimal totalService = 0;
            decimal totalDiscount = 0;
            decimal totalAllAmtPaid = 0;


            string query = @"
                SELECT BoxNo, OldDLG, NewPT, NewDLG, PrincipalAmt, Interest, ServiceFee, Discount, TotalAmtPaid, CustName, Remarks, 
                (SELECT CASE WHEN OldTicket IS NULL THEN PawnTicket ELSE OldTicket END AS OldPT) as OldPT, PawnTicket FROM ViewDailyRenewal 
                WHERE CNCode=@CnCode AND TDate BETWEEN @BeginDate AND @EndDate ORDER BY NewPT
                ";

            try
            {
                using (SqlConnection con = new SqlConnection(new ClsGetConnection().PlsConnect()))
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@CnCode", cnCode);
                    cmd.Parameters.AddWithValue("@BeginDate", startDate);
                    cmd.Parameters.AddWithValue("@EndDate", endDateParsed);

                    con.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        int counter = 1;

                        while (reader.Read())
                        {

                            decimal pAmount = reader["PrincipalAmt"] != DBNull.Value ? Convert.ToDecimal(reader["PrincipalAmt"]) : 0;
                            decimal amtPaidPercentage = (reader["PrincipalAmt"] != DBNull.Value && reader["Interest"] != DBNull.Value)
                                            ? (decimal)reader["PrincipalAmt"] * ((decimal)reader["Interest"] / 100)
                                            : 0;
                            decimal discount = reader["Discount"] != DBNull.Value ? Convert.ToDecimal(reader["Discount"]) : 0;
                            decimal serviceFee = reader["ServiceFee"] != DBNull.Value ? Convert.ToDecimal(reader["ServiceFee"]) : 0;
                            decimal totalAmt = reader["TotalAmtPaid"] != DBNull.Value ? Convert.ToDecimal(reader["TotalAmtPaid"]) : 0;


                            results.Add(new
                            {
                                No = counter++,
                                BoxNo = reader["BoxNo"],
                                OldDLG = reader["OldDLG"],
                                NewPT = reader["NewPT"],
                                NewDLG = reader["NewDLG"],
                                PrincipalAmt = pAmount,
                                Interest = reader["Interest"],
								AmtPaid = amtPaidPercentage,
                                OldPtNo = reader["OldPT"].ToString() == "0000000" ? reader["PawnTicket"] : reader["OldPT"],


								ServiceFee = serviceFee,
                                Discount = discount,
                                TotalAmtPaid = totalAmt,
                                CustName = reader["CustName"],
                                Remarks = reader["Remarks"]
                            });


                            totalPrincipal += pAmount;
                            totalAmountIntPaid += amtPaidPercentage;
                            totalService += serviceFee;
                            totalDiscount += discount;
                            totalAllAmtPaid += totalAmt;
                        }
                    }
                }

                return Ok(new
                {
                    list = results,
                    grandTotal = new
                    {
                        PrincipalAmount = totalPrincipal,
                        AmtPercentage = totalAmountIntPaid,
                        Discount =  totalDiscount,
                        ServiceFee = totalService,
                        TotalAmtPaid = totalAllAmtPaid
                        
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpGet("Redemption")]
        public IActionResult GetRedemption(
            [FromQuery][Required] string cnCode,
            [FromQuery][Required] string beginDate,
            [FromQuery][Required] string endDate)
        {
            // Validate and parse dates
            if (!DateTime.TryParse(beginDate, out DateTime startDate) || !DateTime.TryParse(endDate, out DateTime endDateParsed))
            {
                return BadRequest(new { message = "Invalid date format. Use YYYY-MM-DD." });
            }

            if (startDate > endDateParsed)
            {
                return BadRequest(new { message = "Begin date cannot be later than end date." });
            }

            var results = new List<object>();


            decimal totalPrincipal = 0;
            decimal totalAmountPaid = 0;
            decimal totalService = 0;
            decimal totalDicount = 0;
            decimal totalAllAmtPaid = 0;



           /* string query = @"
                    SELECT Remarks, BoxNo, PawnTicket, Month, CAmount, ServiceFee, Discount, Discount1, TotalAmt, CustName, Time, Payment, TotalIntPaid,
                    (SELECT MAX(VDate) FROM tblMain1 WHERE (PawnTicket = ViewDailyRedemption.PawnTicket OR RSPawnTicket = ViewDailyRedemption.PawnTicket) AND 
                    (Voucher = 'PS' OR Voucher = 'RS') AND Void=0 AND ControlNo = ViewDailyRedemption.ControlNo AND CNCode=@CnCode) AS DLGDate,
                    (SELECT CAmount FROM tblMain1 WHERE BoxNo = ViewDailyRedemption.BoxNo AND Voucher = 'PS' AND Void=0 AND ControlNo = ViewDailyRedemption.ControlNo AND CNCode=@CnCode) AS LoanAmount, MAX(RowNum) AS RowNum, ControlNo
                    FROM ViewDailyRedemption WHERE CNCode= @CnCode AND TDate BETWEEN @BeginDate AND @EndDate
                    GROUP BY Remarks, BoxNo, PawnTicket, Month, CAmount, ServiceFee, Discount, Discount1, TotalAmt, CustName, Time, Payment, TotalIntPaid, ControlNo
                ";*/

            string query = @"
                SELECT 
                    Remarks, BoxNo, PawnTicket, Month, CAmount, ServiceFee, 
                    Discount, Discount1, TotalAmt, CustName, Time, Payment, TotalIntPaid, 
                    (SELECT MAX(VDate) FROM tblMain1 
                     WHERE (PawnTicket = ViewDailyRedemption.PawnTicket OR RSPawnTicket = ViewDailyRedemption.PawnTicket) 
                     AND (Voucher = 'PS' OR Voucher = 'RS') 
                     AND Void=0 AND ControlNo = ViewDailyRedemption.ControlNo AND CNCode= @CnCode) AS DLGDate, 
                    (SELECT MAX(CAmount) FROM tblMain1 
                     WHERE BoxNo = ViewDailyRedemption.BoxNo 
                     AND Voucher = 'PS' AND Void=0 
                     AND ControlNo = ViewDailyRedemption.ControlNo AND CNCode= @CnCode) AS LoanAmount, 
                    MAX(RowNum) AS RowNum, 
                    ControlNo 
                FROM ViewDailyRedemption 
                WHERE CNCode= @CnCode AND TDate BETWEEN @BeginDate AND @EndDate
                GROUP BY Remarks, BoxNo, PawnTicket, Month, CAmount, ServiceFee, 
                         Discount, Discount1, TotalAmt, CustName, Time, Payment, TotalIntPaid, ControlNo
            ";
            
            try
            {
                using (SqlConnection con = new SqlConnection(new ClsGetConnection().PlsConnect()))
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@CnCode", cnCode);
                    cmd.Parameters.AddWithValue("@BeginDate", startDate);
                    cmd.Parameters.AddWithValue("@EndDate", endDateParsed);

                    con.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        int counter = 1;

                        while (reader.Read())
                        {

                            decimal pAmount = reader["LoanAmount"] != DBNull.Value ? Convert.ToDecimal(reader["LoanAmount"]) : 0;
                            decimal amtPaidPercentage = Convert.ToDecimal(reader["TotalIntPaid"]) - Convert.ToDecimal(reader["LoanAmount"]);
                            decimal discount = Convert.ToDecimal(reader["Discount"]) + Convert.ToDecimal(reader["Discount1"]);
                            decimal serviceFee = reader["ServiceFee"] != DBNull.Value ? Convert.ToDecimal(reader["ServiceFee"]) : 0;
                            decimal totalAmt = reader["TotalAmt"] != DBNull.Value ? Convert.ToDecimal(reader["TotalAmt"]) : 0;


                            results.Add(new
                            {
                                No = counter++,
                                BoxNo = reader["BoxNo"],
                                PawnTicket = reader["PawnTicket"],
                                DLGDate = reader["DLGDate"],
                                PrincipalAmount = pAmount,
                                Month = reader["Month"],
                                AmtPaidPercentage = amtPaidPercentage,
                                Discount = discount,
                                ServiceFee = serviceFee,
                                TotalAmt = totalAmt,
                                CustName = reader["CustName"],
                                Time = reader["Time"],
                                Remarks = reader["Remarks"]
                            });

                            totalPrincipal += pAmount;
                            totalAmountPaid += amtPaidPercentage;
                            totalService += discount;
                            totalDicount += serviceFee;
                            totalAllAmtPaid += totalAmt;
                        }
                    }
                }

                return Ok(new
                {
                    list = results,
                    grandTotal = new
                    {
                        PrincipalAmount = totalPrincipal,
                        AmtPercentage = totalAmountPaid,
                        Discount =  totalService,
                        ServiceFee = totalDicount,
                        TotalAmtPaid = totalAllAmtPaid
                        
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }



        [HttpGet("ReadyForAuction")]
        public IActionResult GetReadyForAuction(
            [FromQuery][Required] string cnCode,
            [FromQuery][Required] string beginDate,
            [FromQuery][Required] string endDate,
            [FromQuery][Required] string dateAsOf)
        {
            // Validate and parse dates
            if (!DateTime.TryParse(beginDate, out DateTime startDate) || !DateTime.TryParse(endDate, out DateTime endDateParsed))
            {
                return BadRequest(new { message = "Invalid date format. Use YYYY-MM-DD." });
            }

            if (startDate > endDateParsed)
            {
                return BadRequest(new { message = "Begin date cannot be later than end date." });
            }

            var results = new List<object>();


            decimal totalCAmount = 0;



            string query = @"
                    SELECT CustName, PawnTicketNew, BoxNo, DLGDate, ItemDesc, Weight, KaratDesc, CAmount FROM ViewAuctionItem 
                    WHERE CNCode=@CnCode AND DLGDate <= @DateAsOf AND 
                    TDate  <= @BeginDate AND TDate  >= @EndDate ORDER BY TDate ASC
                ";

            try
            {
                using (SqlConnection con = new SqlConnection(new ClsGetConnection().PlsConnect()))
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@CnCode", cnCode);
                    cmd.Parameters.AddWithValue("@BeginDate", startDate);
                    cmd.Parameters.AddWithValue("@EndDate", endDateParsed);
                    cmd.Parameters.AddWithValue("@DateAsOf", dateAsOf);

                    con.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        int counter = 1;

                        while (reader.Read())
                        {

                            decimal cAmount = reader["CAmount"] != DBNull.Value ? Convert.ToDecimal(reader["CAmount"]) : 0;
                            


                            results.Add(new
                            {
                                No = counter++,
                                BoxNo = reader["BoxNo"],
                                PawnTicketNew = reader["PawnTicketNew"],
                                DLGDate = reader["DLGDate"],
                                ItemDesc = reader["ItemDesc"],
                                Weight = reader["Weight"],
                                KaratDesc = reader["KaratDesc"],
                                CAmount = cAmount,
                                CustName = reader["CustName"]
                            });

                            totalCAmount += cAmount;
                        }
                    }
                }

                return Ok(new
                {
                    list = results,
                    grandTotal = new
                    {
                        CAmount = totalCAmount
                        
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpGet("GetPullOut")]
        public IActionResult GetPullOut(
            [FromQuery][Required] string cnCode)
        {
            // Validate and parse dates


            var results = new List<object>();


            decimal totalBal = 0;



            string query = @"
                    SELECT CustName, PawnTicket, BoxNo, ItemDesc, KaratDesc, Weight, TDate, DLGDate, 
                    SUM(InterestAmount*(DATEDIFF(month, TDate, getdate())))AS Bal FROM ViewPOItem 
                    WHERE CNCode=@CnCode GROUP BY CustName, PawnTicket, BoxNo, ItemDesc, KaratDesc, Weight, TDate, DLGDate
                ";

            try
            {
                using (SqlConnection con = new SqlConnection(new ClsGetConnection().PlsConnect()))
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@CnCode", cnCode);

                    con.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        int counter = 1;

                        while (reader.Read())
                        {

                            decimal bal = reader["bal"] != DBNull.Value ? Convert.ToDecimal(reader["bal"]) : 0;
                            


                            results.Add(new
                            {
                                No = counter++,
                                BoxNo = reader["BoxNo"],
                                PawnTicket = reader["PawnTicket"],
                                DLGDate = reader["DLGDate"],
                                ItemDesc = reader["ItemDesc"],
                                Weight = reader["Weight"],
                                KaratDesc = reader["KaratDesc"],
                                Bal = bal,
                                CustName = reader["CustName"],
                                TDate = reader["TDate"]

                            });

                            totalBal += bal;
                        }
                    }
                }

                return Ok(new
                {
                    list = results,
                    grandTotal = new
                    {
                        bal = totalBal
                        
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        
        [HttpGet("Individual")]
        public IActionResult GetIndividual(
            [FromQuery][Required] string cnCode,
            [FromQuery][Required] string controlNo)
        {
            var results = new List<object>();
            string query = @"
                SELECT Voucher, Remarks, BoxNo, PawnTicket, 
                (SELECT CASE WHEN Voucher='PS' THEN DLGDate ELSE TDate END) AS DLGDate,
                MAX(LoanAmount) AS LoanAmount, 
                SUM(Interest) AS Interest, 
                (SELECT SUM(amt) FROM dbo.ViewIndRD WHERE (BoxNo = ViewIndLed.BoxNo)) AS RDAmt
                FROM ViewIndLed 
                WHERE CNCode = @CnCode AND ControlNo = @controlNo 
                GROUP BY Remarks, BoxNo, PawnTicket, DLGDate, Voucher, TDate 
                ORDER BY PawnTicket, Voucher";

            try
            {
                using (SqlConnection con = new SqlConnection(new ClsGetConnection().PlsConnect()))
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@CnCode", cnCode);
                    cmd.Parameters.AddWithValue("@controlNo", controlNo);

                    con.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        int counter = 1;

                        while (reader.Read())
                        {
                            decimal loanAmount = reader["LoanAmount"] != DBNull.Value ? Convert.ToDecimal(reader["LoanAmount"]) : 0;
                            decimal interest = reader["Interest"] != DBNull.Value ? Convert.ToDecimal(reader["Interest"]) : 0;
                            decimal rdAmt = reader["RDAmt"] != DBNull.Value ? Convert.ToDecimal(reader["RDAmt"]) : 0;

                            results.Add(new
                            {
                                No = counter++,
                                BoxNo = reader["BoxNo"],
                                Interest = interest,
                                DLGDate = reader["DLGDate"],
                                PawnTicket = reader["PawnTicket"],
                                Payment = reader["Voucher"].ToString() == "RD"
                                    ? (rdAmt - interest + 5)
                                    : 0,
                                PrincipalAmount = loanAmount,
                                Remarks = reader["Remarks"]
                            });
                        }
                    }
                }

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }




    }
}
