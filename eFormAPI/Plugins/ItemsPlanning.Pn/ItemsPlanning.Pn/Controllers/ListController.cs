using System.Threading.Tasks;
using ItemsPlanning.Pn.Abstractions;
using ItemsPlanning.Pn.Infrastructure.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace ItemsPlanning.Pn.Controllers
{
    [Authorize]
    public class ListController : Controller
    {        
        private readonly IListService _listService;

        public ListController(IListService listService)
        {
            _listService = listService;
        }

        [HttpGet]
        [Route("api/items-planning-pn/lists")]
        public async Task<OperationDataResult<ListsModel>> GetAllLists(ListRequestModel requestModel)
        {
            return await _listService.GetAllLists(requestModel);
        }

        [HttpGet]
        [Route("api/items-planning-pn/lists/{id}")]
        public async Task<OperationDataResult<ListModel>> GetSingleList(int id)
        {
            return await _listService.GetSingleList(id);
        }

        [HttpPost]
        [Route("api/items-planning-pn/lists")]
        public async Task<OperationResult> CreateList([FromBody] ListModel createModel)
        {
            return await _listService.CreateList(createModel);
        }

        [HttpPut]
        [Route("api/items-planning-pn/lists")]
        public async Task<OperationResult> UpdateList([FromBody] ListModel updateModel)
        {
            return await _listService.UpdateList(updateModel);
        }

        [HttpDelete]
        [Route("api/items-planning-pn/lists/{id}")]
        public async Task<OperationResult> DeleteList(int id)
        {
            return await _listService.DeleteList(id);
        }
    }
}