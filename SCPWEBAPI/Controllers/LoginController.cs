using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using SCPWEBAPI.FldrClass;
using System.Security.Cryptography;
using System.Text;
using static SCPWEBAPI.FldrModels.Models;

namespace SCPWEBAPI.Controllers
{
    [ApiController]
    public class LoginController : Controller
    {
        SqlConnection myconnection;
        SqlCommand mycommand;
        SqlDataReader dr;

        [HttpGet]
        [Route("API/SCPWEBAPI/UserAuthentication")]
        public string GetPWordResult(string strURILogInName, string strURIPWordLog)
        {
            using (SqlConnection myconnection = new SqlConnection(new ClsGetConnection().PlsConnect()))
            {
                myconnection.Open();

                string CheckNoTransact = "SELECT COUNT(*) FROM tblUser WHERE UserName = @UserName";
                using (SqlCommand com = new SqlCommand(CheckNoTransact, myconnection))
                {
                    com.Parameters.AddWithValue("@UserName", strURILogInName);
                    int CountData = (int)com.ExecuteScalar();

                    if (CountData > 0)
                    {
                        string strDBPasswordQuery = "SELECT PWord FROM tblUser WHERE UserName = @UserName";
                        using (SqlCommand comPWord = new SqlCommand(strDBPasswordQuery, myconnection))
                        {
                            comPWord.Parameters.AddWithValue("@UserName", strURILogInName);
                            string GetPWord = comPWord.ExecuteScalar()?.ToString();

                            if (GetPWord == null)
                            {
                                return "5"; // wrong password
                            }

                            string computedHash = getMd5Hash(strURIPWordLog);
                            //Console.WriteLine($"Stored Hash: {GetPWord}");
                            //Console.WriteLine($"Computed Hash: {computedHash}");

                            if (!verifyMd5Hash(strURIPWordLog, GetPWord))
                            {
                                return "2"; // Wrong Password
                            }

                            string sqlQuery = "SELECT * FROM tblUser WHERE UserName = @UserName";
                            using (SqlCommand command = new SqlCommand(sqlQuery, myconnection))
                            {
                                command.Parameters.AddWithValue("@UserName", strURILogInName);
                                using (SqlDataReader reader = command.ExecuteReader())
                                {
                                    if (reader.Read())
                                    {
                                        MdltblUsers userInfo = new MdltblUsers
                                        {
                                            UserCode = reader["UserCode"].ToString(),
                                            UserName = reader["UserName"].ToString(),
                                            FullName = reader["FullName"].ToString(),
                                            PWord = reader["PWord"].ToString(),
                                            CNCode = reader["CNCode"].ToString(),
                                            GroupCode = reader["GroupCode"].ToString()
                                        };

                                        return JsonConvert.SerializeObject(userInfo);
                                    }
                                    else
                                    {
                                        return "4"; // No data fetched
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        return "3"; // User doesn't exist
                    }
                }
            }
        }

        static bool verifyMd5Hash(string input, string hash)
        {
            string hashOfInput = getMd5Hash(input);

            StringComparer comparer = StringComparer.OrdinalIgnoreCase;

            return comparer.Compare(hashOfInput, hash) == 0;
        }

        static string getMd5Hash(string input)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] data = md5.ComputeHash(Encoding.UTF8.GetBytes(input));

                StringBuilder sBuilder = new StringBuilder();

                for (int i = 0; i < data.Length; i++)
                {
                    sBuilder.Append(data[i].ToString("x2"));
                }

                return sBuilder.ToString();
            }
        }
    }
}
