using System;
using System.Collections;
using System.Data.SqlClient;
using SCPWEBAPI.FldrClass;
using static SCPWEBAPI.FldrModels.Models;
using Microsoft.Data.SqlClient;

namespace SCPWEBAPI.FldrClass

{
    /*public class ClsValidation
    {
        SqlConnection myconnection;
        SqlDataReader dr;
        SqlCommand mycommand;

        string CheckNoTransact;
        int CountData;
        ClsGetConnection ClsGetConnection1 = new ClsGetConnection();


        public bool PawnTicketExist(string strPawnticket, string strCNCode)
        {
            myconnection = new SqlConnection(new ClsGetConnection().PlsConnectDatabase());
            myconnection.Open();
            CheckNoTransact = string.Format("SELECT Count(*) FROM ViewListOfPawnTicket WHERE (PawnTicket='" + strPawnticket + "' OR RSPawnTicket='" + strPawnticket + "') AND CNCode='" + strCNCode + "'");
            SqlCommand com = new SqlCommand(CheckNoTransact, myconnection);
            CountData = int.Parse(com.ExecuteScalar().ToString());
            myconnection.Close();
            if (CountData > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }*/

    public class ClsValidation
    {

        SqlConnection? myconnection;
        SqlCommand? mycommand;
        SqlDataReader? dr;

        public bool PawnTicketExist(string strPawnticket, string strCNCode)
        {
            using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
            {
                myconnection.Open();
                string CheckNoTransact = "SELECT Count(*) FROM ViewListOfPawnTicket WHERE (PawnTicket=@PawnTicket OR RSPawnTicket=@PawnTicket) AND CNCode=@CNCode";

                using (SqlCommand com = new SqlCommand(CheckNoTransact, myconnection))
                {
                    com.Parameters.AddWithValue("@PawnTicket", strPawnticket);
                    com.Parameters.AddWithValue("@CNCode", strCNCode);

                    int CountData = (int)com.ExecuteScalar();
                    return CountData > 0;
                }
            }
        }


        public bool emptytxt(string val)
        {
            if (String.IsNullOrEmpty(val))
                return true;
            else
                return false;
        }
        
        public bool errordate(string val)
        {
            DateTime num;
            if (val == "  /  /")
                return false;
            if (Convert.ToInt16(val.Length) < 10)
                return true;
            else if (!DateTime.TryParse(val, out num))
                return true;
            else
                return false;
        }
        
    }

    

}
