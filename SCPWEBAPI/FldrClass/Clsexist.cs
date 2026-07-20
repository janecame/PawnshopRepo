using System;
using System.Data.SqlClient; // Use Microsoft.Data.SqlClient if needed
using Microsoft.Data.SqlClient;


namespace SCPWEBAPI.FldrClass
{
    class Clsexist
    {
        public bool RecordExists(SqlConnection _SqlConnection, string _Sql) // Removed 'ref'
        {
            SqlDataReader _SqlDataReader = null;
            try
            {
                using (SqlCommand _SqlCommand = new SqlCommand(_Sql, _SqlConnection))
                {
                    _SqlDataReader = _SqlCommand.ExecuteReader();

                    if (_SqlDataReader.Read())
                    {
                        return true; // Record found
                    }
                }
            }
            catch (Exception)
            {
                return false; // Exception occurred
            }
            finally
            {
                // Ensure the reader is closed and disposed
                _SqlDataReader?.Close();
                _SqlDataReader?.Dispose();
            }

            return false; // No record found
        }
    }
}
