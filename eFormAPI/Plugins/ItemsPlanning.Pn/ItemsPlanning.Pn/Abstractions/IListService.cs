using System.Threading.Tasks;
using ItemsPlanning.Pn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace ItemsPlanning.Pn.Abstractions
{
    public interface IListService
    {
        Task<OperationResult> CreateList(ListModel model);
        Task<OperationResult> DeleteList(int id);
        Task<OperationResult> UpdateList(ListModel updateModel);
        Task<OperationDataResult<ListsModel>> GetAllLists(ListRequestModel requestModel);
        Task<OperationDataResult<ListModel>> GetSingleList(int fractionId);
        
    }
}