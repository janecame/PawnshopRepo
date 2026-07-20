
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
using System.Security.Cryptography;

using SCPWEBAPI.FldrClass;
using static SCPWEBAPI.FldrModels.SecurityModel;
using System.Text;

namespace SCPWEBAPI.Controllers
{   


    
    [ApiController]
    [Route("API/SCPWEBAPI/Security")]
    public class SecurityController : ControllerBase
    {

        ClsAutoNum ClsAutoNum1 = new ClsAutoNum();

        [HttpPost("GroupAdd")]
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
        }


        [HttpPost("GroupPermissionAdd/{groupcode}")]
        public async Task<IActionResult> GroupPermissionAdd(string groupcode, [FromBody] string objectName)
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
                    const string query = "INSERT INTO tblPermission (Groupcode, ObjectName) VALUES (@Groupcode, @ObjectName)";
                    
                    using (SqlCommand insertCmd = new SqlCommand(query, conn, transaction))
                    {
                        insertCmd.Parameters.Add("@Groupcode", SqlDbType.VarChar).Value = groupcode;
                        insertCmd.Parameters.Add("@ObjectName", SqlDbType.VarChar).Value = objectName;

                        await insertCmd.ExecuteNonQueryAsync();
                    }

                    await transaction.CommitAsync();

                    return Ok(new { message = "Group permissions added successfully." });
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



        [HttpPost("AddUser")]
        public async Task<IActionResult> AddUser([FromBody] UserAddDto user)
        {   
            
            string plsnumber = ClsAutoNum1.UserAutoNum();


            if (user == null)
            {
                return BadRequest("Invalid user data.");
            }

            if (string.IsNullOrEmpty(user.UserName) ||
                string.IsNullOrEmpty(user.Password) ||
                string.IsNullOrEmpty(user.VerifyPassword))
            {
                return BadRequest("Please complete your entry.");
            }

            if (user.Password != user.VerifyPassword)
            {
                return BadRequest("Password does not match.");
            }

            try
            {
                using SqlConnection conn = new SqlConnection(new ClsGetConnection().PlsConnect());
                await conn.OpenAsync();

                // Check if username already exists
                using (SqlCommand checkCmd = new SqlCommand("SELECT COUNT(*) FROM tblUser WHERE UserName = @UserName", conn))
                {
                    checkCmd.Parameters.AddWithValue("@UserName", user.UserName);
                    int count = (int)await checkCmd.ExecuteScalarAsync();
                    if (count > 0)
                    {
                        return BadRequest("Account name already exists.");
                    }
                }

                using SqlTransaction transaction = conn.BeginTransaction();

                try
                {
                    // Insert new user
                    string sql = @"INSERT INTO tblUser (UserCode, PWord, GroupCode, UserName, FullName) 
                                   VALUES (@UserCode, @PWord, @GroupCode, @UserName, @FullName)";

                    using SqlCommand cmd = new SqlCommand(sql, conn, transaction);
                    cmd.Parameters.AddWithValue("@UserCode", "A" + plsnumber);
                    cmd.Parameters.AddWithValue("@PWord", getMd5Hash(user.Password));
                    cmd.Parameters.AddWithValue("@GroupCode", "01");
                    cmd.Parameters.AddWithValue("@UserName", user.UserName);
                    cmd.Parameters.AddWithValue("@FullName", user.FullName);

                    await cmd.ExecuteNonQueryAsync();
                    await transaction.CommitAsync();

                    return Ok("User successfully added.");
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, $"An error occurred while adding the user. Error: {ex.Message}");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database connection error: {ex.Message}");
            }
        }



        [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUser([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest("Invalid user data.");
            }

            if (string.IsNullOrEmpty(user.UserName) || string.IsNullOrEmpty(user.FullName))
            {
                return BadRequest("Please complete your entry.");
            }

            try
            {
                using SqlConnection conn = new SqlConnection(new ClsGetConnection().PlsConnect());
                await conn.OpenAsync();

                // Check if username already exists for another user
                using (SqlCommand checkCmd = new SqlCommand("SELECT COUNT(*) FROM tblUser WHERE UserName = @UserName AND UserCode != @UserCode", conn))
                {
                    checkCmd.Parameters.AddWithValue("@UserName", user.UserName);
                    checkCmd.Parameters.AddWithValue("@UserCode", user.UserCode);
                    int count = (int)await checkCmd.ExecuteScalarAsync();
                    if (count > 0)
                    {
                        return BadRequest("Account name already exists.");
                    }
                }

                using SqlTransaction transaction = conn.BeginTransaction();

                try
                {
                    string sql = @"
                        UPDATE tblUser
                        SET CNCode = @CNCode,
                            GroupCode = @GroupCode,
                            UserName = @UserName,
                            FullName = @FullName
                        WHERE UserCode = @UserCode;
                    ";

                    using SqlCommand cmd = new SqlCommand(sql, conn, transaction);
                    cmd.Parameters.AddWithValue("@UserCode", user.UserCode);
                    cmd.Parameters.AddWithValue("@GroupCode", user.GroupCode);
                    cmd.Parameters.AddWithValue("@CNCode", user.CNCode);
                    cmd.Parameters.AddWithValue("@UserName", user.UserName);
                    cmd.Parameters.AddWithValue("@FullName", user.FullName);

                    int rowsAffected = await cmd.ExecuteNonQueryAsync();

                    if (rowsAffected == 0)
                    {
                        await transaction.RollbackAsync();
                        return NotFound("User not found.");
                    }

                    await transaction.CommitAsync();

                    return Ok("User successfully updated.");
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, $"An error occurred while updating the user. Error: {ex.Message}");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database connection error: {ex.Message}");
            }
        }


        //list of group SELECT GroupCode, GroupName from tblGroup

        [HttpGet("GetGroups")]
        public IActionResult GetGroups()
        {
            var results = new List<object>();

            string query = @"SELECT GroupCode, GroupName FROM tblGroup";

            try
            {
                using (SqlConnection con = new SqlConnection(new ClsGetConnection().PlsConnect()))
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    con.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            results.Add(new
                            {
                                GroupCode = reader["GroupCode"].ToString(),
                                GroupName = reader["GroupName"].ToString()
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


        [HttpGet("GetGroupPermission")]
        public IActionResult GetGroupPermission(string groupCode)
        {
            var results = new List<object>();

            //string query = @"SELECT ObjectName FROM tblPermission WHERE GroupCode=@GroupCode AND ObjectName=@VarObjectName";
            string query = @"SELECT ObjectName FROM tblPermission WHERE GroupCode=@GroupCode";

            try
            {
                using (SqlConnection con = new SqlConnection(new ClsGetConnection().PlsConnect()))
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    // ✅ Add missing parameters
                    cmd.Parameters.AddWithValue("@GroupCode", groupCode);
                    //cmd.Parameters.AddWithValue("@VarObjectName", varObjectName);

                    con.Open();

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            // Assuming ObjectName is a string in your table
                            results.Add(reader["ObjectName"].ToString());
                        }
                    }
                }

                return Ok(results.ToArray()); // return as array
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("GetObjects")]
        public IActionResult GetObjects()
        {
            var results = new List<string>();

            string query = @"SELECT ObjectName FROM tblObjects";

            try
            {
                using (SqlConnection con = new SqlConnection(new ClsGetConnection().PlsConnect()))
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    con.Open();

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            results.Add(reader["ObjectName"].ToString());
                        }
                    }
                }

                return Ok(results.ToArray()); // ✅ return as string array instead of object list
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpGet("GetUsers")]
        public IActionResult GetUsers()
        {
            var results = new List<User>();

            string query = @"SELECT UserCode, GroupCode, UserName, CNCode, FullName FROM tblUser";

            try
            {
                using (SqlConnection con = new SqlConnection(new ClsGetConnection().PlsConnect()))
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    con.Open();

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            results.Add(new User
                            {
                                UserCode = reader["UserCode"].ToString(),
                                GroupCode = reader["GroupCode"].ToString(),
                                UserName = reader["UserName"].ToString(),
                                CNCode = reader["CNCode"].ToString(),
                                FullName = reader["FullName"].ToString()
                            });
                        }
                    }
                }

                return Ok(results); // returns as List<obj>
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }








        static string getMd5Hash(string input)
        {
            
            MD5 md5Hasher = MD5.Create();
            byte[] data = md5Hasher.ComputeHash(Encoding.Default.GetBytes(input));
            StringBuilder sBuilder = new StringBuilder();
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }
            return sBuilder.ToString();
        }


		[HttpDelete("GroupPermissionRemove/{groupcode}")]
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









	}
    
}