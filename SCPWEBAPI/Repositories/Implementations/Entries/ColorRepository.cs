using System.Data;
using Microsoft.Data.SqlClient;
using SCPWEBAPI.DTOs.Entries;
using SCPWEBAPI.Repositories.Interfaces.Entries;

namespace SCPWEBAPI.Repositories.Implementations.Entries
{
    public class ColorRepository : EntryLookupRepository<ColorDto>, IColorRepository
    {
        protected override string TableName => "tblEntryColor";
        protected override string CodeColumn => "ColorCode";
        protected override string SelectColumns => "ColorCode, ColorDesc, CatCode, ColorDescSub, CNCode";
        protected override string InsertColumns => "ColorCode, ColorDesc, CatCode, ColorDescSub, CNCode";
        protected override string InsertParameterNames => "@ColorCode, @ColorDesc, @CatCode, @ColorDescSub, @CNCode";
        protected override string UpdateSetClause => "ColorDesc = @ColorDesc, CatCode = @CatCode, ColorDescSub = @ColorDescSub";

        protected override ColorDto MapRow(SqlDataReader reader) => new()
        {
            ColorCode = reader["ColorCode"].ToString(),
            ColorDesc = reader["ColorDesc"].ToString(),
            CatCode = reader["CatCode"].ToString(),
            ColorDescSub = reader["ColorDescSub"].ToString(),
            CNCode = reader["CNCode"].ToString(),
        };

        protected override void AddInsertParameters(SqlCommand command, ColorDto entity)
        {
            command.Parameters.Add("@ColorCode", SqlDbType.VarChar).Value = entity.ColorCode;
            command.Parameters.Add("@ColorDesc", SqlDbType.VarChar).Value = entity.ColorDesc;
            command.Parameters.Add("@CatCode", SqlDbType.VarChar).Value = entity.CatCode;
            command.Parameters.Add("@ColorDescSub", SqlDbType.VarChar).Value = entity.ColorDescSub;
            command.Parameters.Add("@CNCode", SqlDbType.VarChar).Value = entity.CNCode;
        }

        protected override void AddUpdateParameters(SqlCommand command, ColorDto entity)
        {
            command.Parameters.Add("@ColorDesc", SqlDbType.VarChar).Value = entity.ColorDesc;
            command.Parameters.Add("@CatCode", SqlDbType.VarChar).Value = entity.CatCode;
            command.Parameters.Add("@ColorDescSub", SqlDbType.VarChar).Value = entity.ColorDescSub;
        }
    }
}
