using System;
using System.Collections;
using System.Data;
using System.Data.SqlClient;

using SCPWEBAPI.FldrClass;
using static SCPWEBAPI.FldrModels.Models;
using Microsoft.Data.SqlClient;

namespace SCP.FldrClass
{
    public class ClsPermission
    {
        public string plstxtObject;
        private readonly ClsGetConnection ClsGetConnection1 = new ClsGetConnection();
        
        public void CheckPermission(string objectName, string groupCode)
        {
            plstxtObject = "";

            try
            {
                if (groupCode == "01")
                {
                    plstxtObject = "01";
                }
                else
                {
                    using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
                    {
                        myconnection.Open();
                        using (SqlCommand mycommand = new SqlCommand(
                            "SELECT ObjectName FROM tblPermission WHERE GroupCode = @groupCode AND ObjectName = @objectName", 
                            myconnection))
                        {
                            mycommand.Parameters.AddWithValue("@groupCode", groupCode);
                            mycommand.Parameters.AddWithValue("@objectName", objectName);

                            using (SqlDataReader dr = mycommand.ExecuteReader())
                            {
                                while (dr.Read())
                                {
                                    plstxtObject = dr["ObjectName"].ToString();
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // You can log the error, show a message, or rethrow depending on your app
                Console.WriteLine("Error: " + ex.Message);
            }
        }
    }
}
