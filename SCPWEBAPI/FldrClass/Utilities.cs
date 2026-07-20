using Microsoft.Data.SqlClient;
using System.Data.Common;
using System.Windows.Input;

namespace SCPWEBAPI.FldrClass
{
    public class Utilities
    {
        private readonly string connectionString = new ClsGetConnection().PlsConnect();

        public bool RecordExists(SqlConnection connection, SqlTransaction transaction, string query, string strCNCode)
        {
            using (SqlCommand command = new SqlCommand(query, connection, transaction))
            {
                command.Parameters.AddWithValue("@CNCode", strCNCode);
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    return reader.Read();
                }
            }
        }

        public string ProductAdd(string cnCode)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    string checkNoTransact = "SELECT COUNT(*) FROM tblStocks WHERE CNCode = @CNCode";
                    using (var command = new SqlCommand(checkNoTransact, connection))
                    {
                        command.Parameters.AddWithValue("@CNCode", cnCode);
                        int countData = Convert.ToInt32(command.ExecuteScalar());

                        if (countData > 0)
                        {
                            string getLastProdNumberQuery = "SELECT TOP 1 ProdNumber FROM tblStocks WHERE CNCode = @CNCode ORDER BY ProdNumber DESC";
                            using (var getLastProdNumberCommand = new SqlCommand(getLastProdNumberQuery, connection))
                            {
                                getLastProdNumberCommand.Parameters.AddWithValue("@CNCode", cnCode);
                                using (var reader = getLastProdNumberCommand.ExecuteReader())
                                {
                                    Console.WriteLine($"CNCode: {cnCode}, countData: {countData}");
                                    if (reader.Read())
                                    {
                                        string lastProdNumber = reader["ProdNumber"].ToString();
                                        int nextProdNumber = int.Parse(lastProdNumber);
                                        Console.WriteLine($"Last ProdNumber: {lastProdNumber}, Next ProdNumber: {nextProdNumber}");
                                        return nextProdNumber.ToString("D6");
                                    }
                                }
                            }
                        }
                        else
                        {
                            return "000001";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
            return null;
        }

        public string GetLatestPKNumber(string cnCode)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    string checkNoTransact = "SELECT COUNT(*) FROM tblStocks WHERE CNCode = @CNCode";
                    using (var command = new SqlCommand(checkNoTransact, connection))
                    {
                        command.Parameters.AddWithValue("@CNCode", cnCode);
                        int countData = Convert.ToInt32(command.ExecuteScalar());

                        if (countData > 0)
                        {
                            string getLastProdNumberQuery = "SELECT TOP 1 PKProdNumber FROM tblStocks WHERE CNCode = @CNCode ORDER BY PKProdNumber DESC";
                            using (var getLastProdNumberCommand = new SqlCommand(getLastProdNumberQuery, connection))
                            {
                                getLastProdNumberCommand.Parameters.AddWithValue("@CNCode", cnCode);
                                using (var reader = getLastProdNumberCommand.ExecuteReader())
                                {
                                    if (reader.Read())
                                    {
                                        string lastProdNumber = reader["PKProdNumber"].ToString();
                                        int LatestProdNumber = int.Parse(lastProdNumber);
                                        return LatestProdNumber.ToString("D8");
                                    }
                                }
                            }
                        }
                        else
                        {
                            return "000001";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
            return null;
        }

        public string VoucherAutoNum(string argvoucher, string cnCode)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();


                    // First query to check if records exist
                    string checkQuery = "SELECT TOP 1 DocNum FROM tblMain1 WHERE CNCode = @CNCode AND Voucher = @Voucher AND (ISNUMERIC(DocNum) = 1)";

                    using (var checkCommand = new SqlCommand(checkQuery, connection))
                    {
                        checkCommand.Parameters.AddWithValue("@CNCode", cnCode);
                        checkCommand.Parameters.AddWithValue("@Voucher", argvoucher);

                        object result = checkCommand.ExecuteScalar();
                        if (result != null)
                        {
                            Console.WriteLine("Records exist.");

                            // Records exist, now fetch the highest DocNum
                            string fetchQuery = "SELECT TOP 1 DocNum FROM tblMain1 WHERE CNCode = @CNCode AND Voucher = @Voucher AND (ISNUMERIC(DocNum) = 1) ORDER BY DocNum DESC";

                            using (var fetchCommand = new SqlCommand(fetchQuery, connection))
                            {
                                fetchCommand.Parameters.AddWithValue("@CNCode", cnCode);
                                fetchCommand.Parameters.AddWithValue("@Voucher", argvoucher);

                                using (var dr = fetchCommand.ExecuteReader())
                                {
                                    if (dr.Read())
                                    {
                                        string no1 = dr["DocNum"].ToString();
                                        int no2 = int.Parse(no1);
                                        string newDocNum = (no2 + 1).ToString().PadLeft(7, '0');
                                        Console.WriteLine($"Next DocNum: {newDocNum}");
                                        return newDocNum;
                                    }
                                }
                            }
                        }
                        else
                        {
                            Console.WriteLine("No records found.");
                        }
                    }
                }

                return "0000001";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                return null;
            }
        }



    }
}
