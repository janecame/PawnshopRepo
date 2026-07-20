
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
using static SCPWEBAPI.FldrModels.SearchModel;
using System.Text;

namespace SCPWEBAPI.Controllers
{   


    
    [ApiController]
    [Route("API/SCPWEBAPI/Search")]
    public class SearchController : ControllerBase
    {

		//ClsAutoNum ClsAutoNum1 = new ClsAutoNum();




		[HttpGet("SearchReadyForAuction")]
        public IActionResult SearchReadyForAuction(string cnCode)
        {
            var results = new List<SearchReadyForAuction>();

            string query = @"
                SELECT 
                    CustName, 
                    PawnTicketNew, 
                    BoxNo, 
                    DLGDate, 
                    ItemDesc, 
                    Weight, 
                    KaratDesc, 
                    CAmount 
                FROM ViewAuctionItem 
                WHERE CNCode = @CnCode 
                ORDER BY TDate ASC";

            try
            {
                using (SqlConnection con = new SqlConnection(new ClsGetConnection().PlsConnect()))
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@CnCode", cnCode ?? (object)DBNull.Value);
                    
                    con.Open();                                    
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            results.Add(new SearchReadyForAuction
                            {
                                CustName = reader["CustName"]?.ToString(),
                                PawnTicketNew = reader["PawnTicketNew"]?.ToString(),
                                BoxNo = reader["BoxNo"]?.ToString(),
                                // Convert Date to string or format it as needed
                                DLGDate = reader["DLGDate"] != DBNull.Value ? 
                                          Convert.ToDateTime(reader["DLGDate"]).ToString("yyyy-MM-dd") : null,
                                ItemDesc = reader["ItemDesc"]?.ToString(),
                                Weight = reader["Weight"]?.ToString(),
                                KaratDesc = reader["KaratDesc"]?.ToString(),
                                // Map money type to decimal
                                CAmount = reader["CAmount"] != DBNull.Value ? 
                                          Convert.ToDecimal(reader["CAmount"]) : 0
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


        [HttpGet("SearchPawnTicketVoucher")]
        public IActionResult SearchPawnTicketVoucher(string cnCode, string strVoucher)
        { 

            var results = new List<object>();

            string query = @"
                SELECT 
                    MAX(IC) AS IC, 
                    CAST(PawnTicket AS Varchar(50)) AS Pawnticket 
                FROM 
                    ViewListCustomerPT 
                WHERE CNCode = @CNCode 
                GROUP BY CAST(PawnTicket AS Varchar(50)) 
                HAVING (SUBSTRING(MAX(IC), 1, 2) = @strVoucher)  
                ORDER BY Pawnticket, MAX(IC) DESC";

            try
            {
                using (SqlConnection con = new SqlConnection(new ClsGetConnection().PlsConnect()))
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    // Fix 2: Consistent parameter naming
                    cmd.Parameters.AddWithValue("@CNCode", cnCode ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@strVoucher", strVoucher ?? (object)DBNull.Value);

                    con.Open();                                     
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            // Fix 3: Proper anonymous object syntax
                            results.Add(new 
                            {
                                IC = reader["IC"]?.ToString(),
                                Pawnticket = reader["Pawnticket"]?.ToString()
                            });
                        }
                    }
                }

                return Ok(results);
            }
            catch (Exception ex)
            {
                // Log the error here in a real production app
                return StatusCode(500, new { message = "An error occurred while processing your request.", details = ex.Message });
            }
        }


        [HttpGet("PawnticketTransactions")]
        public IActionResult PawnticketTransactions([FromQuery] GetRequestTransaction req)
        {
            var results = new List<object>();

            string query = @"
                SELECT DLGDate AS TDate, Voucher, PawnTicket, IC 
                FROM ViewListCustomerPT 
                WHERE Voucher = @Voucher
                AND (
                    (@VarPTNo = 1 AND IC = @ControlNo AND (@Voucher = 'PS' OR PawnTicket = @PTNo))
                    OR
                    (@VarPTNo = 0 AND (@Voucher = 'PS' AND ControlNo = @ControlNo) OR (@Voucher = 'RS' AND ControlNo = @ControlNo))
                )";


            try
            {
                using (SqlConnection con = new SqlConnection(new ClsGetConnection().PlsConnect()))
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    
                    cmd.Parameters.AddWithValue("@VarPTNo", req.VarPTNo);
                    cmd.Parameters.AddWithValue("@PTNo", req.StrPTNo ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@ControlNo", req.StrControlNo ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Voucher", req.StrVoucher ?? (object)DBNull.Value);

                    con.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            results.Add(new
                            {
                                IC = reader["IC"]?.ToString(),
                                Pawnticket = reader["PawnTicket"]?.ToString(),
                                TDate = reader["TDate"] != DBNull.Value ? Convert.ToDateTime(reader["TDate"]).ToString("yyyy-MM-dd") : null,
                                Voucher = reader["Voucher"]?.ToString(),
                            });
                        }
                    }
                }

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Database Error", details = ex.Message });
            }
        }

        [HttpGet("DetailsInfo")]
        public IActionResult GetDetailsInfo(
            string ic,
            string voucherType,
			string CnCode
		)
        {
            var result = new List<PawnDetailsDto>();

        
            string sql;

            if (voucherType == "PS")
            {
                sql = @"
                    SELECT 
                        TDate,
                        NewDLG,
                        DATEADD(month, 1, NewDLG) AS EDate,
                        CAmount AS PrincipalAmt,
                        InterestAmt,
                        Appraiser AS PaidBy,
                        OldDLG,
                        Remarks
                    FROM ViewDailyNewLoan
                    WHERE IC = @IC AND CNCode = @CNCode
                ";
            }
            else
            {
                sql = @"
                    SELECT 
                        TDate,
                        NewDLG,
                        DATEADD(month, 1, NewDLG) AS EDate,
                        PrincipalAmt,
                        InterestAmt,
                        PaidBy,
                        OldDLG,
                        Remarks
                    FROM ViewDailyRenewal
                    WHERE IC = @IC AND CNCode = @CNCode
                ";
            }

            using (SqlConnection conn = new SqlConnection(new ClsGetConnection().PlsConnect()))
            using (SqlCommand cmd = new SqlCommand(sql, conn))
            {
                cmd.Parameters.AddWithValue("@IC", ic);
                cmd.Parameters.AddWithValue("@CNCode", CnCode);

                conn.Open();
                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        result.Add(new PawnDetailsDto
                        {
                            dlg = Convert.ToDateTime(dr["NewDLG"]),
                            expDate = Convert.ToDateTime(dr["EDate"]),
                            OriginalPawnDate = Convert.ToDateTime(dr["OldDLG"]),
                            principalAmount = Convert.ToDecimal(dr["PrincipalAmt"]),
                            interestAmount = Convert.ToDecimal(dr["InterestAmt"]),
                            appraiser = dr["PaidBy"].ToString(),
                            remarks = dr["Remarks"].ToString(),
                            status = voucherType == "PS" ? "New Loan" : "Renew"
                        });
                    }
                }
            }

            return Ok(result);
        }


          


        [HttpGet("getItems")]
        public IActionResult getItems(
            string Pawnticket,
            string CNCode
        )
        {
            var result = new List<ItemsDto>();

        
            string sql = @"SELECT 
                PawnTicket, 
                ItemCode, 
                MadeCode, 
                KaratCode, 
                Weight, 
                intrate, 
                PKProdNumber, 
                IC, 
                CAmount, 
                ProdNumber, 
                ColorCode, 
                ConditionCode, 
                BirthStoneCode, 
                DiamondSize,
                DiamondShapeCode, 
                DiamondPrice, 
                SerialNo, 
                ChasisNo, 
                MotorNo, 
                MDate,  
                EDate,  
                BSPcs, 
                BSWeight, 
                RowNum,
                BoxNo, 
                TDate,  
                DLGDate
                FROM ViewGetStockInfo 
                WHERE PawnTicket = @Pawnticket AND CNCode = @CNCode;";


            using (SqlConnection conn = new SqlConnection(new ClsGetConnection().PlsConnect()))
            using (SqlCommand cmd = new SqlCommand(sql, conn))
            {
                cmd.Parameters.AddWithValue("@Pawnticket", Pawnticket);
                cmd.Parameters.AddWithValue("@CNCode", CNCode);

                conn.Open();
                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        result.Add(new ItemsDto
                        {
                            PawnTicket = dr["PawnTicket"].ToString(),
                            ItemCode = dr["ItemCode"].ToString(),
                            MadeCode = dr["MadeCode"].ToString(),
                            KaratCode = dr["KaratCode"].ToString(),
                            intrate = (dr["intrate"] as decimal?) ?? 0m,
							Weight = Math.Round(dr["Weight"] as decimal? ?? 0m, 2),
							

							PKProdNumber = dr["PKProdNumber"].ToString(),
                            IC = dr["IC"].ToString(),
                            CAmount = (dr["CAmount"] as decimal?) ?? 0m,
                            ProdNumber = dr["ProdNumber"].ToString(),
                            ColorCode = dr["ColorCode"].ToString(),
                            ConditionCode = dr["ConditionCode"].ToString(),
                            BirthStoneCode = dr["BirthStoneCode"].ToString(),
                            DiamondSize = dr["DiamondSize"].ToString(),
                            DiamondShapeCode = dr["DiamondShapeCode"].ToString(),
							DiamondPrice = Math.Round(dr["DiamondPrice"] as decimal? ?? 0m, 2),

							SerialNo = dr["SerialNo"].ToString(),
                            ChasisNo = dr["ChasisNo"].ToString(),
                            MotorNo = dr["MotorNo"].ToString(),

                            MDate = dr["MDate"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(dr["MDate"]),
                            EDate = dr["EDate"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(dr["EDate"]),
                            TDate = dr["TDate"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(dr["TDate"]),
                            DLGDate = dr["DLGDate"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(dr["DLGDate"]),

                            BSPcs = dr["BSPcs"] == DBNull.Value ? 0 : Convert.ToInt32(dr["BSPcs"]),
							BSWeight = Math.Round(dr["BSWeight"] as decimal? ?? 0m, 2),
							RowNum = dr["RowNum"] == DBNull.Value ? 0 : Convert.ToInt32(dr["RowNum"]),
                            BoxNo = dr["BoxNo"].ToString()
                        });
                    }
                }
            }

            return Ok(result);
        }

        /*[HttpPost("GroupAdd")]
        public async Task<IActionResult> GroupAdd([FromQuery][Required] string groupName)
        {
            
            string plsnumber = ClsAutoNum1.GroupAutoNum();

            try
            {
                using SqlConnection conn = new SqlConnection(new ClsGetConnection().PlsConnect());
                await conn.OpenAsync();

                
                using (SqlCommand checkCmd = new SqlCommand("SELECT COUNT(*) FROM tblGroup WHERE GroupName = @groupName", conn))
                {
                    checkCmd.Parameters.AddWithValue("@groupName", groupName);
                    int count = (int)await checkCmd.ExecuteScalarAsync();
                    if (count > 0)
                    {
                        return BadRequest("Duplicate entry");
                    }
                }


                using SqlTransaction transaction = conn.BeginTransaction();

                try
                {
                    using SqlCommand cmd = new SqlCommand("INSERT INTO tblgroup (Groupcode, GroupName) VALUES (@Groupcode, @GroupName)", conn, transaction);
                    cmd.Parameters.AddWithValue("@Groupcode", plsnumber);
                    cmd.Parameters.AddWithValue("@GroupName", groupName);

                    await cmd.ExecuteNonQueryAsync();
                    await transaction.CommitAsync();

                    return Ok("Group added successfully.");
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, $"An error occurred while adding the group. Error: {ex.Message}");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database connection error: {ex.Message}");
            }
        }*/


      




		/*[HttpDelete("GroupPermissionRemove/{groupcode}")]
		public async Task<IActionResult> GroupPermissionRemove(string groupcode, [FromBody] string objectName)
		{
			if (string.IsNullOrEmpty(groupcode))
				return BadRequest("Group code is required.");

			if (string.IsNullOrEmpty(objectName))
				return BadRequest("Object name is required.");

			try
			{
				using SqlConnection conn = new SqlConnection(new ClsGetConnection().PlsConnect());
				await conn.OpenAsync();

				using SqlTransaction transaction = (SqlTransaction)await conn.BeginTransactionAsync();

				try
				{
					const string query = "DELETE tblPermission WHERE GroupCode = @GroupCode AND ObjectName = @ObjectName";

					using (SqlCommand insertCmd = new SqlCommand(query, conn, transaction))
					{
						insertCmd.Parameters.Add("@Groupcode", SqlDbType.VarChar).Value = groupcode;
						insertCmd.Parameters.Add("@ObjectName", SqlDbType.VarChar).Value = objectName;

						await insertCmd.ExecuteNonQueryAsync();
					}

					await transaction.CommitAsync();

					return Ok(new { message = "Group permissions removed successfully." });
				}
				catch (Exception ex)
				{
					await transaction.RollbackAsync();
					return StatusCode(500, $"An error occurred: {ex.Message}");
				}
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Database connection error: {ex.Message}");
			}
		}
*/








		[HttpPost("UpdateTransaction")]
		public async Task<IActionResult> UpdateTransaction([FromBody] SearchEditModel model)
		{
			if (model == null || string.IsNullOrEmpty(model.IC))
				return BadRequest("Invalid payload.");

			using SqlConnection conn = new SqlConnection(new ClsGetConnection().PlsConnect());
			await conn.OpenAsync();
			using SqlTransaction transaction = conn.BeginTransaction();

			try
			{
				// 1) Header — tblMain1 (keyed by IC + CNCode)
				const string headerSql = @"
					UPDATE tblMain1
					SET Appraiser = @Appraiser,
						Remarks   = @Remarks,
						CAmount   = @CAmount,
						DLGDate   = @DLGDate,
						EDate     = @EDate,
						BoxNo     = @BoxNo
					WHERE IC = @IC AND CNCode = @CNCode";

				using (SqlCommand cmd = new SqlCommand(headerSql, conn, transaction))
				{
					cmd.Parameters.Add("@Appraiser", SqlDbType.VarChar, 255).Value = model.Appraiser ?? "";
					cmd.Parameters.Add("@Remarks",   SqlDbType.VarChar, 255).Value = model.Remarks   ?? "";
					cmd.Parameters.Add("@CAmount",   SqlDbType.Money       ).Value = (object)model.CAmount ?? DBNull.Value;
					cmd.Parameters.Add("@DLGDate",   SqlDbType.SmallDateTime).Value = (object)model.DLGDate ?? DBNull.Value;
					cmd.Parameters.Add("@EDate",     SqlDbType.SmallDateTime).Value = (object)model.EDate   ?? DBNull.Value;
					cmd.Parameters.Add("@BoxNo",     SqlDbType.VarChar, 10 ).Value = model.BoxNo ?? "";
					cmd.Parameters.Add("@IC",        SqlDbType.VarChar, 15 ).Value = model.IC;
					cmd.Parameters.Add("@CNCode",    SqlDbType.Char,    2  ).Value = model.CNCode;

					int rows = await cmd.ExecuteNonQueryAsync();
					if (rows == 0)
					{
						await transaction.RollbackAsync();
						return NotFound("Record not found.");
					}
				}

				// 2) Item — tblStocks (keyed by PKProdNumber); only when a PK is supplied
				if (!string.IsNullOrEmpty(model.PKProdNumber))
				{
					const string itemSql = @"
						UPDATE tblStocks
						SET ItemCode         = @ItemCode,
							MadeCode         = @MadeCode,
							KaratCode        = @KaratCode,
							ColorCode        = @ColorCode,
							ConditionCode    = @ConditionCode,
							BirthStoneCode   = @BirthStoneCode,
							DiamondShapeCode = @DiamondShapeCode,
							DiamondSize      = @DiamondSize,
							DiamondPrice     = @DiamondPrice,
							Weight           = @Weight,
							BSWeight         = @BSWeight,
							BSPcs            = @BSPcs,
							SerialNo         = @SerialNo,
							MotorNo          = @MotorNo,
							ChasisNo         = @ChasisNo
						WHERE PKProdNumber = @PKProdNumber AND CNCode = @CNCode";

					using (SqlCommand cmd = new SqlCommand(itemSql, conn, transaction))
					{
						cmd.Parameters.Add("@ItemCode",         SqlDbType.Char,    2  ).Value = model.ItemCode ?? "";
						cmd.Parameters.Add("@MadeCode",         SqlDbType.Char,    2  ).Value = model.MadeCode ?? "";
						cmd.Parameters.Add("@KaratCode",        SqlDbType.Char,    2  ).Value = model.KaratCode ?? "";
						cmd.Parameters.Add("@ColorCode",        SqlDbType.Char,    2  ).Value = model.ColorCode ?? "";
						cmd.Parameters.Add("@ConditionCode",    SqlDbType.Char,    2  ).Value = model.ConditionCode ?? "";
						cmd.Parameters.Add("@BirthStoneCode",   SqlDbType.Char,    2  ).Value = model.BirthStoneCode ?? "";
						cmd.Parameters.Add("@DiamondShapeCode", SqlDbType.Char,    2  ).Value = model.DiamondShapeCode ?? "";
						cmd.Parameters.Add("@DiamondSize",      SqlDbType.SmallMoney ).Value = (object)model.DiamondSize  ?? DBNull.Value;
						cmd.Parameters.Add("@DiamondPrice",     SqlDbType.Money      ).Value = (object)model.DiamondPrice ?? DBNull.Value;
						cmd.Parameters.Add("@Weight",           SqlDbType.SmallMoney ).Value = (object)model.Weight       ?? DBNull.Value;
						cmd.Parameters.Add("@BSWeight",         SqlDbType.SmallMoney ).Value = (object)model.BSWeight     ?? DBNull.Value;
						cmd.Parameters.Add("@BSPcs",            SqlDbType.SmallMoney ).Value = (object)model.BSPcs        ?? DBNull.Value;
						cmd.Parameters.Add("@SerialNo",         SqlDbType.VarChar, 50 ).Value = model.SerialNo ?? "";
						cmd.Parameters.Add("@MotorNo",          SqlDbType.VarChar, 50 ).Value = model.MotorNo ?? "";
						cmd.Parameters.Add("@ChasisNo",         SqlDbType.VarChar, 50 ).Value = model.ChasisNo ?? "";
						cmd.Parameters.Add("@PKProdNumber",     SqlDbType.Char,    8  ).Value = model.PKProdNumber;
						cmd.Parameters.Add("@CNCode",           SqlDbType.Char,    2  ).Value = model.CNCode;

						await cmd.ExecuteNonQueryAsync();
					}
				}

				await transaction.CommitAsync();
				return Ok(new { message = "Transaction updated successfully." });
			}
			catch (Exception ex)
			{
				await transaction.RollbackAsync();
				return StatusCode(500, ex.Message);
			}
		}

	}

}