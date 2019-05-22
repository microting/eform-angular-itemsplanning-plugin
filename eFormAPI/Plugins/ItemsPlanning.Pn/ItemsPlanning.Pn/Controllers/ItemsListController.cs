using System.Threading.Tasks;
using ItemsPlanning.Pn.Abstractions;
using ItemsPlanning.Pn.Infrastructure.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace ItemsPlanning.Pn.Controllers
{
    [Authorize]
    public class ItemsListController : Controller
    {        
        private readonly IItemsListService _listService;

        public ItemsListController(IItemsListService listService)
        {
            _listService = listService;
        }

        [HttpGet]
        [Route("api/items-planning-pn/lists")]
        public async Task<OperationDataResult<ItemsListsModel>> GetAllLists(ItemsListRequestModel requestModel)
        {
            return await _listService.GetAllLists(requestModel);
        }

        [HttpGet]
        [Route("api/items-planning-pn/lists/{id}")]
        public async Task<OperationDataResult<ItemsListPnModel>> GetSingleList(int id)
        {
            return await _listService.GetSingleList(id);
        }

        [HttpPost]
        [Route("api/items-planning-pn/lists")]
        public async Task<OperationResult> CreateList([FromBody] ItemsListPnModel createModel)
        {
            return await _listService.CreateList(createModel);
        }

        [HttpPut]
        [Route("api/items-planning-pn/lists")]
        public async Task<OperationResult> UpdateList([FromBody] ItemsListPnModel updateModel)
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