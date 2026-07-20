using SCPWEBAPI.DTOs.Entries;
using SCPWEBAPI.Repositories.Interfaces.Entries;
using SCPWEBAPI.Services.Interfaces.Entries;

namespace SCPWEBAPI.Services.Implementations.Entries
{
    public class ColorService : IColorService
    {
        private readonly IColorRepository _repository;

        public ColorService(IColorRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<ColorDto> GetAll(string cnCode) => _repository.GetAll(cnCode);

        public void Create(string cnCode, ColorCreateRequest request)
        {
            _repository.Insert(new ColorDto
            {
                ColorCode = request.ColorCode,
                ColorDesc = request.ColorDesc,
                CatCode = request.CatCode,
                ColorDescSub = request.ColorDescSub,
                CNCode = cnCode,
            });
        }

        public void Update(string cnCode, string colorCode, ColorUpdateRequest request)
        {
            _repository.Update(cnCode, colorCode, new ColorDto
            {
                ColorDesc = request.ColorDesc,
                CatCode = request.CatCode,
                ColorDescSub = request.ColorDescSub,
            });
        }
    }
}
