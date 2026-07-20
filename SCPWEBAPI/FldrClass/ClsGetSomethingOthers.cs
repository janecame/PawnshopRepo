using System;
using System.Collections;
using System.Data;
using System.Data.SqlClient;

using SCPWEBAPI.FldrClass;
using static SCPWEBAPI.FldrModels.Models;
using Microsoft.Data.SqlClient;

namespace SCPWEBAPI.FldrClass
{
    class ClsGetSomethingOthers
    {

        public string plsTableDoor, plsVoidIC;
        public bool varFinalize;
        SqlConnection myconnection;
        SqlDataReader dr;
        SqlCommand mycommand;

        private readonly ClsGetConnection ClsGetConnection1 = new ClsGetConnection();


        public void ClsGetTDoor(string varstrVoucher)
        {
            try
            {
                using (var myconnection = new SqlConnection(ClsGetConnection1.PlsConnect()))
                {
                    myconnection.Open();
                    using (var mycommand = new SqlCommand("SELECT TableDoor FROM tblTDoor WHERE Voucher = @Voucher", myconnection))
                    {
                        mycommand.Parameters.AddWithValue("@Voucher", varstrVoucher);
                        using (var dr = mycommand.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                plsTableDoor = dr["TableDoor"].ToString();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ClsGetTDoor: {ex.Message}");
            }
        }

        public void ClsOneTheDoor(string varstrVoucher)
        {
            try
            {
                using (var myconnection = new SqlConnection(ClsGetConnection1.PlsConnect()))
                {
                    myconnection.Open();
                    using (var mycommand = new SqlCommand("UPDATE tblTDoor SET TableDoor = @TableDoor WHERE Voucher = @Voucher", myconnection))
                    {
                        mycommand.Parameters.Add("@TableDoor", SqlDbType.Int).Value = 1;
                        mycommand.Parameters.Add("@Voucher", SqlDbType.VarChar).Value = varstrVoucher;
                        mycommand.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ClsOneTheDoor: {ex.Message}");
            }
        }

        public void ClsZeroTheDoor(string varstrVoucher)
        {
            try
            {
                using (var myconnection = new SqlConnection(ClsGetConnection1.PlsConnect()))
                {
                    myconnection.Open();
                    using (var mycommand = new SqlCommand("UPDATE tblTDoor SET TableDoor = @TableDoor WHERE Voucher = @Voucher", myconnection))
                    {
                        mycommand.Parameters.Add("@TableDoor", SqlDbType.Int).Value = 0;
                        mycommand.Parameters.Add("@Voucher", SqlDbType.VarChar).Value = varstrVoucher;
                        mycommand.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ClsZeroTheDoor: {ex.Message}");
            }
        }



        public void ClsGetVoidRef(string varstrVoucher, string strTransactType, string cnCode, string docNum)
        {
            plsVoidIC = string.Empty; // Reset value
            if (strTransactType == "1")
            {
                try
                {
                    using (var myconnection = new SqlConnection(ClsGetConnection1.PlsConnect()))
                    {
                        myconnection.Open();
                        using (var mycommand = new SqlCommand("SELECT IC FROM tblMain1 WHERE IC = @Voucher + @DocNum + @CnCode", myconnection))
                        {
                            mycommand.Parameters.AddWithValue("@Voucher", varstrVoucher);
                            mycommand.Parameters.AddWithValue("@DocNum", docNum);
                            mycommand.Parameters.AddWithValue("@CnCode", cnCode);

                            using (var dr = mycommand.ExecuteReader())
                            {
                                if (dr.Read())
                                {
                                    plsVoidIC = dr["IC"].ToString(); // Store the value in the property
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error in ClsGetVoidRef: {ex.Message}");
                }
            }
        }


        public int ClsDeleteErrorTransaction(string varstrVoucher, string strTransactType, string cnCode, string docNum)
        {
            int rowsAffected = 0;
            if (strTransactType == "1")
            {
                try
                {
                    using (var myconnection = new SqlConnection(ClsGetConnection1.PlsConnect()))
                    {
                        myconnection.Open();

                        using (var mycommand = new SqlCommand("usp_DelVoid", myconnection))
                        {
                            mycommand.CommandType = CommandType.StoredProcedure;

                            mycommand.Parameters.Add("@ParamVoucher", SqlDbType.VarChar).Value = varstrVoucher;
                            mycommand.Parameters.Add("@ParamUserCode", SqlDbType.VarChar).Value = docNum;
                            mycommand.Parameters.Add("@ParamCNCode", SqlDbType.VarChar).Value = cnCode;

                            rowsAffected = mycommand.ExecuteNonQuery();
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error in ClsDeleteErrorTransaction: {ex.Message}");
                }
            }
            return rowsAffected;
        }


        /*public void ClsFinalize1(string varstrVoucher, string varstrDocNum, string strTransactType, string cnCode)
        {
            try
            {
                if (strTransactType == "1")
                {
                    myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
                    myconnection.Open();

                    string sqlstatement;
                    sqlstatement = "UPDATE ViewOnlineEditNumber SET IC=@_IC, DocNum=@_DocNum, Void=@_Void WHERE Voucher=@_Voucher AND DocNum=@_DocNum AND CNCode=@_CnCode";
                    //sqlstatement = "UPDATE tblMain1 SET IC=@_IC, DocNum=@_DocNum, Void=@_Void WHERE Voucher ='" + varstrVoucher + "' AND DocNum='" + Form1.glbluc.Text + "'";
                    mycommand = new SqlCommand(sqlstatement, myconnection);
                    mycommand.Parameters.Add("_IC", SqlDbType.VarChar).Value = varstrVoucher + varstrDocNum + cnCode;
                    mycommand.Parameters.Add("_DocNum", SqlDbType.VarChar).Value = varstrDocNum;
                    mycommand.Parameters.Add("_Void", SqlDbType.Bit).Value = 0;
                    mycommand.Parameters.Add("_CnCode", SqlDbType.VarChar).Value = cnCode;
                    mycommand.Parameters.Add("_Voucher", SqlDbType.VarChar).Value = varstrVoucher;
                    int n1 = mycommand.ExecuteNonQuery();
                    myconnection.Close();
                    varFinalize = true;
                }
            }
            catch (Exception ex)
            {
                varFinalize = false; 
                Console.WriteLine($"Error in ClsGetVoidRef: {ex.Message}");
                //System.Windows.Forms.MessageBox.Show(ex.Message);
            }
            finally
            {
                //dr.Close();
                myconnection.Close();
            }
        }*/


        public void ClsFinalize1(string varstrVoucher, string varstrDocNum, string strTransactType, string cnCode, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                if (strTransactType == "1")
                {
                    string sqlstatement = @"
                        UPDATE ViewOnlineEditNumber 
                        SET IC=@_IC, DocNum=@_DocNum, Void=@_Void 
                        WHERE Voucher=@_Voucher AND DocNum=@_DocNum AND CNCode=@_CnCode
                    ";

                    using (SqlCommand mycommand = new SqlCommand(sqlstatement, connection, transaction))
                    {
                        mycommand.Parameters.AddWithValue("_IC", varstrVoucher + varstrDocNum + cnCode);
                        mycommand.Parameters.AddWithValue("_DocNum", varstrDocNum);
                        mycommand.Parameters.AddWithValue("_Void", 0);
                        mycommand.Parameters.AddWithValue("_CnCode", cnCode);
                        mycommand.Parameters.AddWithValue("_Voucher", varstrVoucher);

                        int n1 = mycommand.ExecuteNonQuery();
                        varFinalize = n1 > 0; // Set true only if update succeeds
                        
                    }
                }
            }
            catch (Exception ex)
            {
                varFinalize = false;
                Console.WriteLine($"Error in ClsFinalize1: {ex.Message}");
                throw; // Ensure error is propagated for rollback
            }
        }




    }
}
