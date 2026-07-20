using Microsoft.AspNetCore.Mvc;
using SCPWEBAPI.DTOs.Entries;
using SCPWEBAPI.Services.Interfaces.Entries;

namespace SCPWEBAPI.Controllers.Entries
{
    // Layered replacement for the Color endpoints in FilipGetListController /
    // FilipInsertController / FilipUpdateController. Those are left in place
    // (not wired to the frontend) until this version is reviewed.
    [ApiController]
    [Route("api/entries/color")]
    public class ColorController : ControllerBase
    {
        private readonly IColorService _service;

        public ColorController(IColorService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IEnumerable<ColorDto>> GetAll([FromQuery] string cnCode)
        {
            return Ok(_service.GetAll(cnCode));
        }

        [HttpPost]
        public IActionResult Create([FromQuery] string cnCode, [FromBody] ColorCreateRequest request)
        {
            _service.Create(cnCode, request);
            return Ok();
        }

        [HttpPut("{cnCode}/{colorCode}")]
        public IActionResult Update(string cnCode, string colorCode, [FromBody] ColorUpdateRequest request)
        {
            _service.Update(cnCode, colorCode, request);
            return Ok();
        }
    }
}
