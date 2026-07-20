using Microsoft.Data.SqlClient;
using System.Data;
using System.Diagnostics;

namespace SCPWEBAPI.FldrClass
{
	public class ClsAutoNum
	{
		SqlConnection myconnection;
		SqlCommand mycommand;
		SqlDataReader dr;

		ClsGetSomething ClsGetSomething1 = new ClsGetSomething();

		public string GetCustomersAutoNum(string strCNCode)
		{
			string pristrNumber;
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();

			mycommand = new SqlCommand($"SELECT Top 1 CustCode FROM tblCustomer WHERE CNCode='{strCNCode}' ORDER BY CustCode DESC", myconnection);
			dr = mycommand.ExecuteReader();
			dr.Read();
			if (dr.HasRows)
			{
				int no3;
				no3 = int.Parse(dr["CustCode"].ToString()) + 1;
				pristrNumber = Convert.ToString(no3).PadLeft(5, '0');
			}
			else
			{
				pristrNumber = "00001";
			}
			myconnection.Close();
			return pristrNumber;
		}

		public string GetConditionAutoNum(string strCNCode)
		{
			string pristrNumber;
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();

			mycommand = new SqlCommand($"SELECT Top 1 ConditionCode FROM tblEntryCondition WHERE CNCode='{strCNCode}' ORDER BY ConditionCode DESC", myconnection);
			dr = mycommand.ExecuteReader();
			dr.Read();
			if (dr.HasRows)
			{
				int no3;
				no3 = int.Parse(dr["ConditionCode"].ToString()) + 1;
				pristrNumber = Convert.ToString(no3).PadLeft(2, '0');
			}
			else
			{
				pristrNumber = "01";
			}
			myconnection.Close();
			return pristrNumber;
		}

		public string GetAutoNum(string strCNCode,string strCode,string strtblName)
		{
			string pristrNumber;
			myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
			myconnection.Open();

			mycommand = new SqlCommand($"SELECT Top 1 {strCode} FROM {strtblName} WHERE CNCode='{strCNCode}' ORDER BY {strCode} DESC", myconnection);
			dr = mycommand.ExecuteReader();
			dr.Read();
			if (dr.HasRows)
			{
				int no3;
				no3 = int.Parse(dr[$"{strCode}"].ToString()) + 1;
				pristrNumber = Convert.ToString(no3).PadLeft(2, '0');
			}
			else
			{
				pristrNumber = "01";
			}
			myconnection.Close();
			return pristrNumber;
		}


		public string RSPTAutoNum(string strCNCode)
		{
		    string plsRSPTNum = string.Empty;
		    string plsLatesRSPT = string.Empty;
		    string plsRSPTNoFrom = string.Empty;
		    string plsRSPTNoTo = string.Empty;

		    SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
		    myconnection.Open();
		    
		    try
		    {
		        if (new Clsexist().RecordExists(myconnection, "SELECT Top 1 RSPawnTicket FROM tblMain1 where CNCode='" + strCNCode + "' ORDER BY RSPawnTicket DESC"))
		        {
		            SqlCommand mycommand = new SqlCommand("SELECT Top 1 RSPawnTicket FROM tblMain1 where CNCode='" + strCNCode + "' AND Void = 0 ORDER BY RSPawnTicket DESC", myconnection);
		            SqlDataReader dr = mycommand.ExecuteReader();

		            while (dr.Read())
		            {
		                string no1;
		                int no2;
		                no1 = dr[0].ToString();
		                no2 = (int.Parse(no1)) + 1;
		                plsLatesRSPT = Convert.ToString(no2).PadLeft(6, '0');
		            }
		            dr.Close();

		            mycommand = new SqlCommand("SELECT RSPTNoFrom, RSPTNoTo FROM tblSetupRSPTNumber where CNCode='" + strCNCode + "'", myconnection);
		            dr = mycommand.ExecuteReader();
		            while (dr.Read())
		            {
		                plsRSPTNoFrom = dr["RSPTNoFrom"].ToString();
		                plsRSPTNoTo = dr["RSPTNoTo"].ToString();
		            }
		            dr.Close();

		            if (int.Parse(plsLatesRSPT) > int.Parse(plsRSPTNoTo) || int.Parse(plsLatesRSPT) < int.Parse(plsRSPTNoFrom))
		            {
		                mycommand = new SqlCommand("SELECT RSPTNoFrom FROM tblSetupRSPTNumber where CNCode='" + strCNCode + "'", myconnection);
		                dr = mycommand.ExecuteReader();
		                while (dr.Read())
		                {
		                    plsRSPTNum = dr["RSPTNoFrom"].ToString();
		                }
		                dr.Close();
		            }
		            else
		            {
		                plsRSPTNum = plsLatesRSPT;
		            }
		        }
		        else
		        {
		            SqlCommand mycommand = new SqlCommand("SELECT RSPTNoFrom FROM tblSetupRSPTNumber where CNCode='" + strCNCode + "'", myconnection);
		            SqlDataReader dr = mycommand.ExecuteReader();
		            while (dr.Read())
		            {
		                plsRSPTNum = dr["RSPTNoFrom"].ToString();
		            }
		            dr.Close();
		        }

		        myconnection.Close();
		        return plsRSPTNum;
		    }
		    catch (Exception ex)
		    {
		        Console.WriteLine(ex.ToString());
		        return string.Empty; // Ensure a return value in case of an exception
		    }
		    
		    // Optional: Return a default value if no conditions were met
		    return string.Empty;
		}

		public string PTAutoNumRS(string CNCode, string strVoucher)
		{
		    string plsnumber = string.Empty;

		    try
		    {
		        using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
		        {
		            myconnection.Open();

		            string query = @"SELECT Top 1 PawnTicket 
		                             FROM tblMain1 
		                             WHERE DE >= @BeginDate 
		                             AND CNCode = @CNCode 
		                             AND Void = 0 
		                             AND ISNUMERIC(PawnTicket) = 1 
		                             AND Voucher = @Voucher 
		                             AND DirectRenew = 0";

		            if (new Clsexist().RecordExists(myconnection, query))
		            {
		                string query1 = @"SELECT Top 1 PawnTicket 
		                                  FROM tblMain1 
		                                  WHERE DE >= @BeginDate 
		                                  AND CNCode = @CNCode 
		                                  AND Void = 0 
		                                  AND ISNUMERIC(PawnTicket) = 1 
		                                  AND Voucher = @Voucher 
		                                  AND DirectRenew = 0 
		                                  ORDER BY DE DESC, PawnTicket DESC";

		                using (SqlCommand mycommand = new SqlCommand(query1, myconnection))
		                {
		                    mycommand.Parameters.AddWithValue("@BeginDate", ClsGetSomething1.plsvarBeginDateSetup);
		                    mycommand.Parameters.AddWithValue("@CNCode", CNCode);
		                    mycommand.Parameters.AddWithValue("@Voucher", strVoucher);

		                    using (SqlDataReader dr = mycommand.ExecuteReader())
		                    {
		                        if (dr.Read())
		                        {
		                            int no2 = int.Parse(dr["PawnTicket"].ToString()) + 1;
		                            plsnumber = no2.ToString();
		                        }
		                    }
		                }
		            }

		            if (string.IsNullOrEmpty(plsnumber))
		            {
		                plsnumber = ClsGetSomething1.plsvarPTNoSetup;
		            }
		        }
		    }
		    catch (Exception ex)
		    {
		        throw new Exception("Error in PTAutoNumRS method: " + ex.Message);
		    }

		    return plsnumber; // Ensure the value is returned
		}


		public string PTAutoNum(string strCNCode)
		{
		    string plsPTNum = ""; // Declare plsPTNum as a local variable
		    string plsLatesPT = "";
		    string plsPTNoFrom = "";
		    string plsPTNoTo = "";

		    try
		    {
		        myconnection = new SqlConnection(new ClsGetConnection().PlsConnect());
		        myconnection.Open();

		        if (new Clsexist().RecordExists(myconnection, "SELECT Top 1 PawnTicket FROM tblMain1 where Voucher = 'PS' AND CNCode='" + strCNCode + "' ORDER BY PawnTicket DESC"))
		        {
		            mycommand = new SqlCommand("SELECT Top 1 PawnTicket FROM tblMain1 where Voucher = 'PS' AND CNCode='" + strCNCode + "' AND Void=0 ORDER BY PawnTicket DESC", myconnection);
		            dr = mycommand.ExecuteReader();
		            while (dr.Read())
		            {
		                string no1 = dr[0].ToString();
		                int no2 = int.Parse(no1) + 1;
		                plsLatesPT = no2.ToString().PadLeft(6, '0');
		            }
		            dr.Close();

		            mycommand = new SqlCommand("SELECT PTNoFrom, PTNoTo FROM tblSetupPTNumber where CNCode='" + strCNCode + "'", myconnection);
		            dr = mycommand.ExecuteReader();
		            while (dr.Read())
		            {
		                plsPTNoFrom = dr["PTNoFrom"].ToString();
		                plsPTNoTo = dr["PTNoTo"].ToString();
		            }
		            dr.Close();

		            if (int.Parse(plsLatesPT) > int.Parse(plsPTNoTo) || int.Parse(plsLatesPT) < int.Parse(plsPTNoFrom))
		            {
		                plsPTNum = "";
		                //System.Windows.Forms.MessageBox.Show("No Pawn Ticket No. Available", "GL");
		            }
		            else
		            {
		                plsPTNum = plsLatesPT;
		            }
		        }
		        else
		        {
		            mycommand = new SqlCommand("SELECT PTNoFrom FROM tblSetupPTNumber where CNCode='" + strCNCode + "'", myconnection);
		            dr = mycommand.ExecuteReader();
		            while (dr.Read())
		            {
		                plsPTNum = dr["PTNoFrom"].ToString();
		            }
		            dr.Close();
		        }
		    }
		    catch (Exception ex)
		    {
		        //System.Windows.Forms.MessageBox.Show(ex.Message);
		    }
		    finally
		    {
		        if (myconnection != null && myconnection.State == ConnectionState.Open)
		        {
		            myconnection.Close();
		        }
		    }

		    return plsPTNum;
		}


		
		public string UserAutoNum()
		{
		    string plsnumber = "";
		    try
		    {
		        using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
		        {
		            myconnection.Open();
		            string query = "SELECT MAX(RIGHT([UserCode],4)) AS UserCode FROM tblUser";
		            using (SqlCommand mycommand = new SqlCommand(query, myconnection))
		            {
		                object result = mycommand.ExecuteScalar();
		                if (result != DBNull.Value && result != null)
		                {
		                    int no2 = int.Parse(result.ToString()) + 1;
		                    plsnumber = no2.ToString().PadLeft(4, '0');
		                }
		                else
		                {
		                    plsnumber = "0001";
		                }
		            }
		        }
		    }
		    catch (Exception ex)
		    {
		        return "Error: " + ex.Message;
		    }
		    return plsnumber;
		}



		public string GroupAutoNum()
		{
		    string plsnumber = "01"; // Default if no records exist

		    try
		    {
		        using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
		        {
		            myconnection.Open();

		            if (new Clsexist().RecordExists(myconnection, "SELECT TOP 1 GroupCode FROM tblGroup"))
		            {
		                using (SqlCommand mycommand = new SqlCommand("SELECT MAX(GroupCode) AS GroupCode FROM tblGroup", myconnection))
		                using (SqlDataReader dr = mycommand.ExecuteReader())
		                {
		                    if (dr.Read())
		                    {
		                        string no1 = dr[0].ToString();
		                        int no2 = int.Parse(no1) + 1;
		                        plsnumber = no2.ToString().PadLeft(2, '0');
		                    }
		                }
		            }
		        }
		    }
		    catch (Exception ex)
		    {
		        return ex.Message; // Return exception message instead of showing MessageBox
		    }

		    return plsnumber;
		}


		/*public void ProductAdd(string strCNCode)
         {
             try
             {
                 ClsGetConnection1.ClsGetConMSSQL();
                 myconnection = new SqlConnection(ClsGetConnection1.plsMyConMSSQL);
                 myconnection.Open();

                 string CheckNoTransact = string.Format("SELECT Count(*) FROM tblStocks WHERE CNCode='" + strCNCode + "'");
                 SqlCommand com = new SqlCommand(CheckNoTransact, myconnection);
                 int CountData = int.Parse(com.ExecuteScalar().ToString());

                 if (CountData > 0)
                 {
                     mycommand = new SqlCommand("SELECT Top 1 ProdNumber FROM tblStocks WHERE CNCode='" + (strCNCode) + "' ORDER BY ProdNumber DESC", myconnection);
                     dr = mycommand.ExecuteReader();
                     while (dr.Read())
                     {
                         string no1;
                         int no2;
                         no1 = dr[0].ToString();
                         no2 = (int.Parse(no1)) + 1;
                         plsnumber = Convert.ToString(no2).PadLeft(6, '0');
                     }
                     dr.Close();
                 }
                 else
                 {
                     plsnumber = "000001";
                 }
                     myconnection.Close();
             }
             catch (Exception ex)
             {
                 System.Windows.Forms.MessageBox.Show(ex.Message);
             }
         }*/



        public async Task<string> GetNextProductNumberAsync(string strCNCode)
		{
		    
		    string nextProductNumber = "000001";

		    try
		    {
		        using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
		        {
		            await myconnection.OpenAsync();

		            string sqlQuery = @"
		                SELECT TOP 1 ProdNumber 
		                FROM tblStocks 
		                WHERE CNCode = @CNCode 
		                ORDER BY ProdNumber DESC";

		            using (SqlCommand cmd = new SqlCommand(sqlQuery, myconnection))
		            {
		                cmd.Parameters.AddWithValue("@CNCode", strCNCode);

		                object result = await cmd.ExecuteScalarAsync();

		                if (result != null && result != DBNull.Value)
		                {
		                    int currentNo = int.Parse(result.ToString());
		                    nextProductNumber = (currentNo + 1).ToString().PadLeft(6, '0');
		                }
		            }
		        }
		    }
		    catch (Exception ex)
		    {
		        throw new Exception("Database error while generating product number", ex);
		    }

		    return nextProductNumber;
		}






	}
}
