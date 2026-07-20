using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using SCPWEBAPI.FldrClass;
using System.Data.Common;
using System.Net;
using static SCPWEBAPI.FldrModels.Models;

namespace SCPWEBAPI.Controllers
{
    [ApiController]
    public class ListController : Controller
    {
        SqlConnection? myconnection;
        SqlCommand? mycommand;
        SqlDataReader? dr;

        [HttpGet]
        [Route("API/SCPWEBAPU/GetBranchName")]
        public string GetBranchName(string strURICNCode)
        {
            try
            {
                using (var myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open();
                    using (var mycommand = new SqlCommand("SELECT CNCode, CName, CAddress FROM tblCompanyName WHERE CNCode = @CnCode", myconnection))
                    {
                        mycommand.Parameters.AddWithValue("@CnCode", strURICNCode);
                        using (var reader = mycommand.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var userInfo = new MdltblCompanyName
                                {
                                    CNCode = reader["CNCode"].ToString(),
                                    CName = reader["CName"].ToString(),
                                    CAddress = reader["CAddress"].ToString()
                                };

                                return JsonConvert.SerializeObject(userInfo);
                            }
                            else
                            {
                                return JsonConvert.SerializeObject(new { Error = "No data found" });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { Error = ex.Message });
            }
        }

        [HttpGet("API/SCPWEBAPI/GetCustomersName/{strURICNCode}")]  
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


        [HttpGet]
        [Route("API/MRMS/GetCompany")]
        public string GetListCompany()
        {
            try
            {
                using (var connection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    connection.Open();
                    using (var command = new SqlCommand("SELECT * FROM tblCompany", connection))
                    {
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var company = new MdlCompany
                                {
                                    Company = reader["Company"].ToString(),
                                    Address = reader["Address"].ToString(),
                                    TIN = reader["TIN"].ToString()
                                };
                                return JsonConvert.SerializeObject(company);
                            }
                            else
                            {
                                return JsonConvert.SerializeObject(new { Error = "No data found" });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { Error = ex.Message });
            }
        }

        [HttpGet]
        [Route("API/MRMS/GetSecurityDate")]
        public string GetSecurityDate()
        {
            try
            {
                using (var connection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    connection.Open();
                    using (var command = new SqlCommand("SELECT * FROM tblSecurityDate", connection))
                    {
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var company = new MdlSecurityDate
                                {
                                    BeginDate = DateTime.Parse(reader["BeginDate"].ToString()),
                                    EndDate = DateTime.Parse(reader["EndDate"].ToString())
                                };
                                return JsonConvert.SerializeObject(company);
                            }
                            else
                            {
                                return JsonConvert.SerializeObject(new { Error = "No data found" });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { Error = ex.Message });
            }
        }

        [HttpGet]
        [Route("API/SCPWEBAPI/GetTDoorVoucher")]
        public IEnumerable<MdlTDoor> GetTDoorVoucher()
        {
            List<MdlTDoor> MdlTDoor1 = new List<MdlTDoor>();
            string sqlQuery = @"SELECT * FROM tblTDoor";

            using (SqlConnection connection = new SqlConnection(new ClsGetConnection().PlsConnect()))
            {
                SqlCommand command = new SqlCommand(sqlQuery, connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    MdlTDoor MdlTDoor2 = new MdlTDoor
                    {
                        TableDoor = int.Parse(reader["TableDoor"].ToString()),
                        Voucher = reader["Voucher"].ToString()
                    };
                    MdlTDoor1.Add(MdlTDoor2);
                }
                connection.Close();
            }

            return MdlTDoor1;
        }

        [HttpGet]
        [Route("API/SCPWEBAPI/GetCompanyName")]
        public IEnumerable<MdlCompanyName> GetCompanyName()
        {
            List<MdlCompanyName> MdlCompanyName1 = new List<MdlCompanyName>();
            string sqlQuery = @"SELECT * FROM tblCompanyName";

            using (SqlConnection connection = new SqlConnection(new ClsGetConnection().PlsConnect()))
            {
                SqlCommand command = new SqlCommand(sqlQuery, connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    MdlCompanyName MdlCompanyName2 = new MdlCompanyName
                    {
                        CNCode = reader["CNCode"].ToString(),
                        CName = reader["CName"].ToString(),
                        CAddress = reader["CAddress"].ToString()
                    };
                    MdlCompanyName1.Add(MdlCompanyName2);
                }
                connection.Close();
            }

            return MdlCompanyName1;
        }

        [HttpGet]
        [Route("API/SCPWEBAPI/GetSetupEarlyRenewal")]
        public IEnumerable<MdlEntrySetupEarlyRenewal> GetSetupEarlyRenewal(string strURICNCode)
        {
            List<MdlEntrySetupEarlyRenewal> MdlEntrySetupEarlyRenewal1 = new List<MdlEntrySetupEarlyRenewal>();
            string sqlQuery = @"SELECT Num, NumDays, InterestRate, CNCode FROM tblEntrySetupEarlyRenewal WHERE CNCode = @CNCode ORDER BY NumDays, CNCode";

            using (SqlConnection connection = new SqlConnection(new ClsGetConnection().PlsConnect()))
            {
                SqlCommand command = new SqlCommand(sqlQuery, connection);

                connection.Open();
                command.Parameters.AddWithValue("@CNCode", strURICNCode);
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    MdlEntrySetupEarlyRenewal MdlEntrySetupEarlyRenewal2 = new MdlEntrySetupEarlyRenewal
                    {
                        Num = int.Parse(reader["Num"].ToString()),
                        NumDays = int.Parse(reader["NumDays"].ToString()),
                        InterestRate = double.Parse(reader["InterestRate"].ToString()),
                        CNCode = reader["CNCode"].ToString(),
                    };
                    MdlEntrySetupEarlyRenewal1.Add(MdlEntrySetupEarlyRenewal2);
                }
                connection.Close();
            }

            return MdlEntrySetupEarlyRenewal1;
        }

        [HttpGet]
        [Route("API/SCPWEBAPI/GetInterestRate")]
        public IEnumerable<InterestRate> GetInterestRate()
        {
            List<InterestRate> InterestRate1 = new List<InterestRate>();
            string sqlQuery = @"SELECT RateCode, CatCode, RateDesc, Rate FROM tblInterestRate WHERE CatCode<>'001' ORDER BY RateCode";

            using (SqlConnection connection = new SqlConnection(new ClsGetConnection().PlsConnect()))
            {
                SqlCommand command = new SqlCommand(sqlQuery, connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    InterestRate InterestRate2 = new InterestRate
                    {
                        RateCode = reader["RateCode"].ToString(),
                        CatCode = reader["CatCode"].ToString(),
                        Rate = double.Parse(reader["Rate"].ToString()),
                        RateDesc = reader["RateDesc"].ToString(),
                    };
                    InterestRate1.Add(InterestRate2);
                }
                connection.Close();
            }

            return InterestRate1;
        }

        [HttpGet]
        [Route("API/SCPWEBAPI/GetInterestRateGold")]
        public IEnumerable<InterestRateGold> GetInterestRateGold()
        {
            List<InterestRateGold> InterestRateGold1 = new List<InterestRateGold>();
            string sqlQuery = @"SELECT * FROM tblIntRate ORDER BY IntRateCode";

            using (SqlConnection connection = new SqlConnection(new ClsGetConnection().PlsConnect()))
            {
                SqlCommand command = new SqlCommand(sqlQuery, connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    InterestRateGold InterestRateGold2 = new InterestRateGold
                    {
                        IntRateCode = reader["IntRateCode"].ToString(),
                        BDays = reader["BDays"].ToString(),
                        EDays = reader["EDays"].ToString(),
                        Perc = double.Parse(reader["Perc"].ToString()),
                        Partial = bool.Parse(reader["Partial"].ToString()),
                    };
                    InterestRateGold1.Add(InterestRateGold2);
                }
                connection.Close();
            }

            return InterestRateGold1;
        }

        [HttpGet]
        [Route("API/SCPWEBAPI/GetSetupPTNumber")]
        public IEnumerable<SetupPTNumber> GetSetupPTNumber()
        {
            List<SetupPTNumber> SetupPTNumber1 = new List<SetupPTNumber>();
            string sqlQuery = @"SELECT * FROM tblSetupPTNumber ORDER BY RowNum";

            using (SqlConnection connection = new SqlConnection(new ClsGetConnection().PlsConnect()))
            {
                SqlCommand command = new SqlCommand(sqlQuery, connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    SetupPTNumber SetupPTNumber2 = new SetupPTNumber
                    {
                        RowNum = int.Parse(reader["RowNum"].ToString()),
                        CNCode = reader["CNCode"].ToString(),
                        PTNoFrom = reader["PTNoFrom"].ToString(),
                        PTNoTo = reader["PTNoTo"].ToString(),
                    };
                    SetupPTNumber1.Add(SetupPTNumber2);
                }
                connection.Close();
            }

            return SetupPTNumber1;
        }

        [HttpGet]
        [Route("API/SCPWEBAPI/GetSetupRSNumber")]
        public IEnumerable<SetupRSNumber> GetSetupRSNumber()
        {
            List<SetupRSNumber> SetupPTNumber1 = new List<SetupRSNumber>();
            string sqlQuery = @"SELECT * FROM tblSetupRSPTNumber ORDER BY RowNum1";

            using (SqlConnection connection = new SqlConnection(new ClsGetConnection().PlsConnect()))
            {
                SqlCommand command = new SqlCommand(sqlQuery, connection);

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    SetupRSNumber SetupRSNumber2 = new SetupRSNumber
                    {
                        RowNum = int.Parse(reader["RowNum1"].ToString()),
                        CNCode = reader["CNCode"].ToString(),
                        RSPTNoFrom = reader["RSPTNoFrom"].ToString(),
                        RSPTNoTo = reader["RSPTNoTo"].ToString(),
                    };
                    SetupPTNumber1.Add(SetupRSNumber2);
                }
                connection.Close();
            }

            return SetupPTNumber1;
        }

        [HttpGet]
        [Route("API/SCPWEBAPI/GetSetupEarlyRedemption")]
        public IEnumerable<MdlEntrySetupEarlyRedemption> GetSetupEarlyRedemption(string strURICNCode)
        {
            List<MdlEntrySetupEarlyRedemption> MdlEntrySetupEarlyRedemption1 = new List<MdlEntrySetupEarlyRedemption>();
            string sqlQuery = @"SELECT Num, NumDays, InterestRate, CNCode FROM tblEntrySetupEarlyRedemption WHERE CNCode = @CNCode ORDER BY NumDays, CNCode";

            using (SqlConnection connection = new SqlConnection(new ClsGetConnection().PlsConnect()))
            {
                SqlCommand command = new SqlCommand(sqlQuery, connection);

                connection.Open();
                command.Parameters.AddWithValue("@CNCode", strURICNCode);
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    MdlEntrySetupEarlyRedemption MdlEntrySetupEarlyRedemption2 = new MdlEntrySetupEarlyRedemption
                    {
                        Num = int.Parse(reader["Num"].ToString()),
                        NumDays = int.Parse(reader["NumDays"].ToString()),
                        InterestRate = double.Parse(reader["InterestRate"].ToString()),
                        CNCode = reader["CNCode"].ToString(),
                    };
                    MdlEntrySetupEarlyRedemption1.Add(MdlEntrySetupEarlyRedemption2);
                }
                connection.Close();
            }

            return MdlEntrySetupEarlyRedemption1;
        }


        [HttpPost]
        [Route("API/SCPWEBAPI/CheckDuplicate")]
        public IActionResult CheckDuplicate([FromBody] CheckDuplicateRequest request)
        {
            if (string.IsNullOrEmpty(request.strURITable) || string.IsNullOrEmpty(request.strURIRow) || request.request == null || request.request.Count == 0)
            {
                return BadRequest("Invalid input parameters");
            }

            try
            {
                using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open();

                    foreach (var item in request.request)
                    {
                        if (item != null)
                        {
                            // Fetch data from the database
                            string fetchQuery = $"SELECT {request.strURIRow} FROM {request.strURITable} WHERE CNCode = @CNCode";

                            using (SqlCommand fetchCmd = new SqlCommand(fetchQuery, myconnection))
                            {
                                fetchCmd.Parameters.AddWithValue("@CNCode", item.CNCode);
                                using (SqlDataReader reader = fetchCmd.ExecuteReader())
                                {
                                    bool isDuplicate = false;

                                    while (reader.Read())
                                    {
                                        string dbBoxNo = reader.GetString(0);
                                        string dbExtractedValue = ExtractValueBeforeB(dbBoxNo);

                                        if (item.BoxNo.Equals(dbExtractedValue, StringComparison.OrdinalIgnoreCase))
                                        {
                                            isDuplicate = true;
                                            break;
                                        }
                                    }

                                    if (isDuplicate)
                                    {
                                        return Ok(new { Duplicate = true });
                                    }
                                }
                            }
                        }
                    }
                }

                return Ok(new { Duplicate = false });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        private string ExtractValueBeforeB(string boxNo)
        {
            int index = boxNo.IndexOf('B');
            if (index > 0)
            {
                return boxNo.Substring(0, index);  // Return substring before 'B'
            }
            return string.Empty;  // Return empty if 'B' not found or 'B' is the first character
        }

        [HttpGet]
        [Route("API/SCPWEBAPU/GetBoxNo")]
        public IEnumerable<tblBoxNo> GetBoxNo(string strURICNCode)
        {
            List<tblBoxNo> tblBoxNoList = new List<tblBoxNo>();
            string sqlQuery = @"SELECT BoxNo, RowNum, CNCode, Available FROM tblSetupBoxNo WHERE Available = @Available AND CNCode = @CNCode ORDER BY RowNum ASC";

            try
            {
                using (var myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open();
                    using (var mycommand = new SqlCommand(sqlQuery, myconnection))
                    {
                        mycommand.Parameters.AddWithValue("@Available", true);
                        mycommand.Parameters.AddWithValue("@CNCode", strURICNCode);

                        using (var reader = mycommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var boxNo = new tblBoxNo
                                {
                                    RowNum = int.Parse(reader["RowNum"].ToString()),
                                    CNCode = reader["CNCode"].ToString(),
                                    BoxNo = reader["BoxNo"].ToString(),
                                    Available = bool.Parse(reader["Available"].ToString())
                                };
                                tblBoxNoList.Add(boxNo);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
            }

            return tblBoxNoList;
        }

        [HttpGet]
        [Route("API/SCPWEBAPU/GetDisplayBoxNo")]
        public string GetDisplayBoxNo(string strURICNCode)
        {
            try
            {
                using (var myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open();
                    using (var mycommand = new SqlCommand("SELECT Top 1 BoxNo FROM tblSetupBoxNo WHERE CNCode=@CNCode AND Available = @Available ORDER BY RowNum ASC", myconnection))
                    {
                        mycommand.Parameters.AddWithValue("@Available", strURICNCode);
                        mycommand.Parameters.AddWithValue("@CNCode", strURICNCode);
                        using (var reader = mycommand.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var DisplayBoxNo = new tblBoxNo
                                {
                                    BoxNo = reader["BoxNo"].ToString(),
                                };

                                return JsonConvert.SerializeObject(DisplayBoxNo);
                            }
                            else
                            {
                                return JsonConvert.SerializeObject(new { Error = "No data found" });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { Error = ex.Message });
            }
        }

        [HttpGet]
        [Route("API/SCPWEBAPU/GetLoanCategory")]
        public IEnumerable<LoanCategory> GetLoanCategory()
        {
            List<LoanCategory> LoanCategory1 = new List<LoanCategory>();
            string sqlQuery = @"SELECT CatCode, CatDesc FROM tblCategory WHERE CatCode <> '000' ORDER by CatCode";

            try
            {
                using (var myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open();
                    using (var mycommand = new SqlCommand(sqlQuery, myconnection))
                    {

                        using (var reader = mycommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var LoanCategory2 = new LoanCategory
                                {
                                    CatCode = reader["CatCode"].ToString(),
                                    CatDesc = reader["CatDesc"].ToString()
                                };
                                LoanCategory1.Add(LoanCategory2);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
            }

            return LoanCategory1;
        }

        [HttpGet]
        [Route("API/MRMS/GetRate")]
        public string GetRate(string strURICatCode)
        {
            try
            {
                using (var connection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    connection.Open();
                    using (var command = new SqlCommand("SELECT Rate FROM tblInterestRate WHERE CatCode = @CatCode", connection))
                    {
                        command.Parameters.AddWithValue("@CatCode", strURICatCode);

                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var rate = new InterestRate
                                {
                                    Rate = double.Parse(reader["Rate"].ToString()) * 100
                                };
                                return JsonConvert.SerializeObject(rate.Rate);
                            }
                            else
                            {
                                return JsonConvert.SerializeObject(new { Error = "No data found" });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new { Error = ex.Message });
            }
        }

        //[HttpGet]
        //[Route("API/SCPWEBAPU/PartialPaymentBoxNo")]
        //public IEnumerable<PartialPayment> PartialPaymentBoxNo(string strURIPawner)
        //{
        //    List<PartialPayment> PartialPayment1 = new List<PartialPayment>();
        //    string sqlQuery = @"SELECT TDate, BoxNo, Reference, CNCode, IC FROM ViewListofPartialPayment WHERE ControlNo = @Pawner GROUP BY TDate, BoxNo, Reference, CNCode, IC ORDER BY TDate DESC";

        //    try
        //    {
        //        using (var myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
        //        {
        //            myconnection.Open();
        //            using (var mycommand = new SqlCommand(sqlQuery, myconnection))
        //            {
        //                // Add the parameter for ControlNo (Pawner)
        //                mycommand.Parameters.AddWithValue("@Pawner", strURIPawner);

        //                using (var reader = mycommand.ExecuteReader())
        //                {
        //                    while (reader.Read())
        //                    {
        //                        var PartialPayment2 = new PartialPayment
        //                        {
        //                            IC = reader["IC"].ToString(),
        //                            TDate = DateTime.Parse(reader["TDate"].ToString()),
        //                            BoxNo = reader["BoxNo"].ToString(),
        //                            Reference = reader["Reference"].ToString(),
        //                            CNCode = reader["CNCode"].ToString()
        //                        };
        //                        PartialPayment1.Add(PartialPayment2);
        //                    }
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex.Message.ToString());
        //    }

        //    return PartialPayment1;
        //}


        [HttpGet]
        [Route("API/SCPWEBAPU/GetPartialPaymenbt")]
        public IActionResult GetPartialPaymenbt(string strURIPawner)
        {
            List<PartialPayment> PartialPayment1 = new List<PartialPayment>();
            string sqlQuery = @"SELECT TDate, BoxNo, ControlNo, Reference, CNCode, IC, DocNum, ItemCode, MadeCode, ConditionCode, ColorCode, 
                        BirthStoneCode, DiamondSize, DiamondShapeCode, DiamondPrice, KaratCode, Weight, SerialNo, BSWeight, 
                        BSPcs, CatCode, CAmount, PlateNo, ProdQty, IntRate
                        FROM ViewListofPartialPayment 
                        WHERE ControlNo = @Pawner
                        ORDER BY TDate DESC";

            try
            {
                using (var myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open();
                    using (var mycommand = new SqlCommand(sqlQuery, myconnection))
                    {
                        mycommand.Parameters.AddWithValue("@Pawner", strURIPawner);

                        using (var reader = mycommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var PartialPayment2 = new PartialPayment
                                {
                                    IC = reader["IC"].ToString(),
                                    DocNum = reader["DocNum"].ToString(),
                                    TDate = reader["TDate"] != DBNull.Value ? DateTime.Parse(reader["TDate"].ToString()) : (DateTime?)null,
                                    ControlNo = reader["ControlNo"].ToString(),
                                    CNCode = reader["CNCode"].ToString(),
                                    Reference = reader["Reference"].ToString(),
                                    BoxNo = reader["BoxNo"].ToString(),
                                    ItemCode = reader["ItemCode"].ToString(),
                                    MadeCode = reader["MadeCode"].ToString(),
                                    ConditionCode = reader["ConditionCode"].ToString(),
                                    ColorCode = reader["ColorCode"].ToString(),
                                    BirthStoneCode = reader["BirthStoneCode"].ToString(),
                                    DiamondSize = reader["DiamondSize"].ToString(),
                                    DiamondShapeCode = reader["DiamondShapeCode"].ToString(),
                                    DiamondPrice = reader["DiamondPrice"] != DBNull.Value ? double.Parse(reader["DiamondPrice"].ToString()) : (double?)null,
                                    KaratCode = reader["KaratCode"].ToString(),
                                    Weight = reader["Weight"].ToString(),
                                    SerialNo = reader["SerialNo"].ToString(),
                                    BSWeight = reader["BSWeight"] != DBNull.Value ? double.Parse(reader["BSWeight"].ToString()) : (double?)null,
                                    BSPcs = reader["BSPcs"] != DBNull.Value ? double.Parse(reader["BSPcs"].ToString()) : (double?)null,
                                    CatCode = reader["CatCode"].ToString(),
                                    CAmount = reader["CAmount"].ToString(),
                                    PlateNo = reader["PlateNo"].ToString(),
                                    ProdQty = int.Parse(reader["ProdQty"].ToString()),
                                    IntRate = double.Parse(reader["IntRate"].ToString()),
                                };
                                PartialPayment1.Add(PartialPayment2);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return Ok(PartialPayment1);
        }
    }
}
