using SCPWEBAPI.DTOs.Entries;

namespace SCPWEBAPI.Services.Interfaces.Entries
{
    public interface IColorService
    {
        IEnumerable<ColorDto> GetAll(string cnCode);
        void Create(string cnCode, ColorCreateRequest request);
        void Update(string cnCode, string colorCode, ColorUpdateRequest request);
    }
}
