using System.Threading.Tasks;
using ItemsPlanning.Pn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace ItemsPlanning.Pn.Abstractions
{
    public interface IItemsListService
    {
        Task<OperationResult> CreateList(ItemsListPnModel model);
        Task<OperationResult> DeleteList(int id);
        Task<OperationResult> UpdateList(ItemsListPnModel updateModel);
        Task<OperationDataResult<ItemsListsModel>> GetAllLists(ItemsListRequestModel requestModel);
        Task<OperationDataResult<ItemsListPnModel>> GetSingleList(int itemListId);
        Task<OperationResult> ImportUnit(UnitImportModel unitImportModel);

    }
}