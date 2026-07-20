using System;
using System.Collections;
using System.Data.SqlClient;
using SCPWEBAPI.FldrClass;
using static SCPWEBAPI.FldrModels.Models;
using Microsoft.Data.SqlClient;


namespace SCPWEBAPI.FldrClass
{
    class ClsBuildComboBox
    {
        public ArrayList SN = new ArrayList();

        public ArrayList ClsbuildcboCustCode(string strURICNCode)
        {
            SN.Clear(); // Clear previous results

            try
            {
                using (var myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open();
                    using (var mycommand = new SqlCommand(
                        "SELECT ControlNo, " +
                        "(SELECT CASE WHEN RSPawnTicket = '0000000' THEN PawnTicket ELSE RSPawnTicket END) AS RSPawnTicket " +
                        "FROM tblMain1 WHERE Void=0 AND PullOut=0 AND PartialPayment=0 AND Redeemed=0 AND Renewed=0 AND CNCode=@CnCode " +
                        "GROUP BY PawnTicket, RSPawnTicket, ControlNo ORDER BY RSPawnTicket", myconnection))
                    {
                        mycommand.Parameters.AddWithValue("@CnCode", strURICNCode);
                        mycommand.CommandTimeout = 900;

                        using (var reader = mycommand.ExecuteReader())
                        {
                            if (reader.HasRows)
                            {
                                while (reader.Read())
                                {
                                    SN.Add(new Clsaddvalue(reader.GetString(1), reader.GetString(0)));
                                }
                            }
                            else 
                            {
                                SN.Add(new Clsaddvalue("", ""));
                            }

                            return SN; // Return SN here
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception using your logging framework
                Console.WriteLine(ex.ToString());
            }

            return SN; // Return SN in case of an exception
        }


        public List<ModelCustNameControlNo> ClsBuildControlnoOR(string strURICNCode)
        {
            try
            {
                using (var myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                {
                    myconnection.Open(); 
                    using (var mycommand = new SqlCommand("SELECT ControlNo, CustName FROM tblCustomer WHERE Active = 1 AND CNCode=@CnCode ORDER BY CustName", myconnection))
                    {
                        mycommand.Parameters.AddWithValue("@CnCode", strURICNCode);
                        using (var reader = mycommand.ExecuteReader())
                        {
                            var customerList = new List<ModelCustNameControlNo>();

                            while (reader.Read())
                            {
                                var userInfo = new ModelCustNameControlNo
                                {
                                    ControlNo = reader["ControlNo"].ToString(),
                                    CustName = reader["CustName"].ToString()
                                };
                                customerList.Add(userInfo);
                            }

                            return customerList; // Return the list, even if empty
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception using your logging framework
                Console.WriteLine(ex.ToString());
                return new List<ModelCustNameControlNo>(); // Return an empty list on exception
            }
        }




    }
}
