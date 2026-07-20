
using Azure.Core;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Diagnostics;


using static SCPWEBAPI.FldrModels.RenewalModel;


namespace SCPWEBAPI.FldrClass
{
    public class ClsNewRenewal
    {



		public async Task tblStockInsert(PawnTransactionRequest request, SqlConnection connection, SqlTransaction transaction)
		{
			string sql = @"INSERT INTO tblStocks (
                        PKProdNumber, CNCode, ProdNumber, ItemCode, MadeCode, ColorCode, ConditionCode, 
                        BirthStoneCode, DiamondSize, DiamondShapeCode, DiamondPrice, KaratCode, Weight, 
                        SerialNo, MotorNo, ChasisNo, MaturityDate, ExpDate, BSWeight, BSPcs, intrate
                    ) 
                    VALUES (
                        @PKProdNumber, @CNCode, @ProdNumber, @ItemCode, @MadeCode, @ColorCode, @ConditionCode, 
                        @BirthStoneCode, @DiamondSize, @DiamondShapeCode, @DiamondPrice, @KaratCode, @Weight, 
                        @SerialNo, @MotorNo, @ChasisNo, @MaturityDate, @ExpDate, @BSWeight, @BSPcs, @intrate
                    )";

			foreach (var item in request.DataList)
			{
				var autoNum = new ClsAutoNum();
				// Use request.CnCode from the parent object
				string prodNumber = await autoNum.GetNextProductNumberAsync(request.CnCode);

				using (SqlCommand cmd = new SqlCommand(sql, connection, transaction))
				{
					// Identity/Header Info
					cmd.Parameters.Add("@PKProdNumber", SqlDbType.Char).Value = prodNumber + request.CnCode;
					cmd.Parameters.Add("@CNCode", SqlDbType.Char).Value = request.CnCode;
					cmd.Parameters.Add("@ProdNumber", SqlDbType.Char).Value = prodNumber;

					// Item Specifics (using your new property names)
					cmd.Parameters.Add("@ItemCode", SqlDbType.Char).Value = item.Item ?? (object)DBNull.Value;
					cmd.Parameters.Add("@MadeCode", SqlDbType.Char).Value = item.Made ?? (object)DBNull.Value;
					cmd.Parameters.Add("@ColorCode", SqlDbType.Char).Value = item.Color ?? (object)DBNull.Value;
					cmd.Parameters.Add("@ConditionCode", SqlDbType.Char).Value = item.Condition ?? (object)DBNull.Value;
					cmd.Parameters.Add("@BirthStoneCode", SqlDbType.Char).Value = item.Birthstone ?? (object)DBNull.Value;
					cmd.Parameters.Add("@DiamondSize", SqlDbType.SmallMoney).Value = item.DiamondSize;
					cmd.Parameters.Add("@DiamondShapeCode", SqlDbType.Char).Value = item.DiamondShape ?? (object)DBNull.Value;
					cmd.Parameters.Add("@DiamondPrice", SqlDbType.Money).Value = item.DiamondPrice;
					cmd.Parameters.Add("@KaratCode", SqlDbType.Char).Value = item.Karat ?? (object)DBNull.Value;
					cmd.Parameters.Add("@Weight", SqlDbType.VarChar).Value = item.Weight ?? (object)DBNull.Value;
					cmd.Parameters.Add("@SerialNo", SqlDbType.VarChar).Value = item.SerialNo ?? (object)DBNull.Value;
					cmd.Parameters.Add("@MotorNo", SqlDbType.VarChar).Value = item.MotorNo ?? (object)DBNull.Value;
					cmd.Parameters.Add("@ChasisNo", SqlDbType.VarChar).Value = item.ChassisNo ?? (object)DBNull.Value;

					// Dates from Parent Request
					cmd.Parameters.Add("@MaturityDate", SqlDbType.VarChar).Value = string.IsNullOrEmpty(request.MaturityDate) ? (object)DBNull.Value : request.MaturityDate;
					cmd.Parameters.Add("@ExpDate", SqlDbType.DateTime).Value = request.ExpDate;

					// Gemstone/Interest Info
					cmd.Parameters.Add("@BSWeight", SqlDbType.VarChar).Value = item.BirthstoneWeight ?? (object)DBNull.Value;
					cmd.Parameters.Add("@BSPcs", SqlDbType.SmallMoney).Value = item.BirthstonePcs;
					cmd.Parameters.Add("@intrate", SqlDbType.Int).Value = Convert.ToInt32(item.InterestPercent);

					await cmd.ExecuteNonQueryAsync();
				}
			}
		}




	}
}



