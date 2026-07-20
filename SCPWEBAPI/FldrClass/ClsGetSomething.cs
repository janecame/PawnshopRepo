using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Data.SqlClient;

using SCPWEBAPI.FldrClass;
using static SCPWEBAPI.FldrModels.Models;

namespace SCPWEBAPI.FldrClass
{
    public class ClsGetSomething
    {
        public string plsvarPTNoSetup, plsvarBeginDateSetup;
        private readonly ClsGetConnection ClsGetConnection1 = new ClsGetConnection();

        public TermSetupDto GetTermSetup()
        {
            var result = new TermSetupDto();

            try
            {
                
                ClsGetConnection1.PlsConnect();
                
                using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open();
                    string query = "SELECT TermExpiration, AdditionalInterest, TermMaturity, TermAuction FROM tblEntrySetupTerm";
                    
                    using (SqlCommand mycommand = new SqlCommand(query, myconnection))
                    {
                        using (SqlDataReader dr = mycommand.ExecuteReader())
                        {
                            if (dr.Read()) 
                            {
                                result.TermExpiration = dr["TermExpiration"] != DBNull.Value ? Convert.ToInt32(dr["TermExpiration"]) : 0;
                                result.AdditionalInterest = dr["AdditionalInterest"] != DBNull.Value ? Convert.ToDecimal(dr["AdditionalInterest"]) : 0m;
                                result.TermMaturity = dr["TermMaturity"] != DBNull.Value ? Convert.ToDecimal(dr["TermMaturity"]) : 0m;
                                result.TermAuction = dr["TermAuction"] != DBNull.Value ? Convert.ToDecimal(dr["TermAuction"]) : 0m;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                
                throw new Exception("Database error: " + ex.Message);
            }

            return result;
        }

        

        public async Task<string> GetSilverIntRateAsync(decimal strPrincipalAmt)
        {
            string silverIntRate = string.Empty;

            using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
            {
                string query = "SELECT TOP (1) SilverIntRate FROM tblEntrySilverRange WHERE (SilverAmtRange <= @Amt) ORDER BY SilverAmtRange DESC";

                using (SqlCommand mycommand = new SqlCommand(query, myconnection))
                {
                    mycommand.Parameters.Add("@Amt", SqlDbType.Decimal).Value = strPrincipalAmt;
                    
                    try
                    {
                        await myconnection.OpenAsync();
                        object result = await mycommand.ExecuteScalarAsync();

                        if (result != null && result != DBNull.Value)
                        {
                            silverIntRate = result.ToString();
                        }
                    }
                    catch (SqlException ex)
                    {
                        throw new Exception("Database access error occurred.", ex);
                    }
                }
            }
            return silverIntRate;
        }



        public async Task<LoanItemSetupDto> GetLoanItemSetupAsync(string catCode)
        {
            using var connection = new SqlConnection(new ClsGetConnection().PlsConnect());
            string query = @"
                SELECT InterestRate, SerialNoPawnStatus, MotorNoPawnStatus, 
                       ChasesNoPawnStatus, ItemCodeStatus, ColorCodeStatus, BirthStoneCodeStatus, 
                       ConditionCodeStatus, DiamondCodeStatus, KaratCodeStatus, BSWeightStatus, 
                       BSPieceStatus, DiamondSizeStatus, DiamondShapeCodeStatus, DiamondPriceStatus 
                FROM tblEntrySetupLoanItem WHERE CatCode = @CatCode

            ";

            using var command = new SqlCommand(query, connection);
            command.Parameters.Add("@CatCode", SqlDbType.Char, 3).Value = catCode;

            await connection.OpenAsync();
            using var dr = await command.ExecuteReaderAsync();

            if (await dr.ReadAsync())
            {
                return new LoanItemSetupDto
                {
                    
                    InterestRate = Convert.ToDecimal(dr["InterestRate"]),
                    SerialNoPawnStatus = Convert.ToBoolean(dr["SerialNoPawnStatus"]),
                    MotorNoPawnStatus = Convert.ToBoolean(dr["MotorNoPawnStatus"]),
                    ChasesNoPawnStatus = Convert.ToBoolean(dr["ChasesNoPawnStatus"]),
                    ItemCodeStatus = Convert.ToBoolean(dr["ItemCodeStatus"]),
                    ColorCodeStatus = Convert.ToBoolean(dr["ColorCodeStatus"]),
                    BirthStoneCodeStatus = Convert.ToBoolean(dr["BirthStoneCodeStatus"]),
                    ConditionCodeStatus = Convert.ToBoolean(dr["ConditionCodeStatus"]),
                    DiamondCodeStatus = Convert.ToBoolean(dr["DiamondCodeStatus"]),
                    KaratCodeStatus = Convert.ToBoolean(dr["KaratCodeStatus"]),
                    BSWeightStatus = Convert.ToBoolean(dr["BSWeightStatus"]),
                    BSPieceStatus = Convert.ToBoolean(dr["BSPieceStatus"]),
                    DiamondSizeStatus = Convert.ToBoolean(dr["DiamondSizeStatus"]),
                    DiamondShapeCodeStatus = Convert.ToBoolean(dr["DiamondShapeCodeStatus"]),
                    DiamondPriceStatus = Convert.ToBoolean(dr["DiamondPriceStatus"])
                };
            }
            return null;
        }










	}
}
