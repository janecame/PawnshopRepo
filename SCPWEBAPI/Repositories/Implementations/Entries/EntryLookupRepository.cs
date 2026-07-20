using System.Data;
using Microsoft.Data.SqlClient;
using SCPWEBAPI.FldrClass;
using SCPWEBAPI.Repositories.Interfaces.Entries;

namespace SCPWEBAPI.Repositories.Implementations.Entries
{
    // Base for the "code + description" lookup tables. All SQL here is parameterized,
    // including the UPDATE ... WHERE clause, which the legacy FilipUpdateController
    // built via raw string interpolation.
    public abstract class EntryLookupRepository<T> : IEntryLookupRepository<T>
    {
        protected abstract string TableName { get; }
        protected abstract string CodeColumn { get; }
        protected abstract string SelectColumns { get; }
        protected abstract string InsertColumns { get; }
        protected abstract string InsertParameterNames { get; }
        protected abstract string UpdateSetClause { get; }

        protected abstract T MapRow(SqlDataReader reader);
        protected abstract void AddInsertParameters(SqlCommand command, T entity);
        protected abstract void AddUpdateParameters(SqlCommand command, T entity);

        public IEnumerable<T> GetAll(string cnCode)
        {
            var results = new List<T>();
            var sql = $"SELECT {SelectColumns} FROM {TableName} WHERE CNCode = @CNCode ORDER BY {CodeColumn}";

            using var connection = new SqlConnection(new ClsGetConnection().PlsConnect());
            using var command = new SqlCommand(sql, connection);
            command.Parameters.Add("@CNCode", SqlDbType.VarChar).Value = cnCode;

            connection.Open();
            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                results.Add(MapRow(reader));
            }

            return results;
        }

        public void Insert(T entity)
        {
            var sql = $"INSERT INTO {TableName} ({InsertColumns}) VALUES ({InsertParameterNames})";

            using var connection = new SqlConnection(new ClsGetConnection().PlsConnect());
            using var command = new SqlCommand(sql, connection);
            AddInsertParameters(command, entity);

            connection.Open();
            command.ExecuteNonQuery();
        }

        public void Update(string cnCode, string code, T entity)
        {
            var sql = $"UPDATE {TableName} SET {UpdateSetClause} WHERE CNCode = @CNCode AND {CodeColumn} = @Code";

            using var connection = new SqlConnection(new ClsGetConnection().PlsConnect());
            using var command = new SqlCommand(sql, connection);
            AddUpdateParameters(command, entity);
            command.Parameters.Add("@CNCode", SqlDbType.VarChar).Value = cnCode;
            command.Parameters.Add("@Code", SqlDbType.VarChar).Value = code;

            connection.Open();
            command.ExecuteNonQuery();
        }
    }
}
