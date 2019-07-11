using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ItemsPlanning.Pn.Abstractions;
using ItemsPlanning.Pn.Infrastructure.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.ItemsPlanningBase.Infrastructure.Data;
using Microting.ItemsPlanningBase.Infrastructure.Data.Entities;

namespace ItemsPlanning.Pn.Services
{
    public class ItemListCaseService :IItemsListCaseService
    {
        private readonly ItemsPlanningPnDbContext _dbContext;
        private readonly IItemsPlanningLocalizationService _itemsPlanningLocalizationService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEFormCoreService _core;

        public ItemListCaseService(
            ItemsPlanningPnDbContext dbContext,
            IItemsPlanningLocalizationService itemsPlanningLocalizationService,
            IHttpContextAccessor httpContextAccessor, IEFormCoreService core)
        {
            _dbContext = dbContext;
            _itemsPlanningLocalizationService = itemsPlanningLocalizationService;
            _httpContextAccessor = httpContextAccessor;
            _core = core;
        }

        public async Task<OperationDataResult<ItemsListCasePnModel>> GetSingleList(int itemListId)
        {
            try
            {
                var items = _dbContext.Items.Where(x => x.ItemListId == itemListId);
                List<int> itemIds = items.Select(x => x.Id).ToList();
                if (items.Any())
                {
                    
                    ItemsListCasePnModel itemsListCasePnModel = new ItemsListCasePnModel();
                    
                    List<ItemCase> itemCases = _dbContext.ItemCases.Where(x => itemIds.Contains(x.ItemId)).ToList();

                    foreach (ItemCase itemCase in itemCases)
                    {
                        var item = items.SingleOrDefault(x => x.Id == itemCase.ItemId);
                        ItemsListPnItemCaseModel _itemCase = new ItemsListPnItemCaseModel()
                        {
                            Id = itemCase.Id,
                            Name = item.Name,
                            Description = item.Description,
                            ItemNumber = item.ItemNumber,
                            LocationCode = item.LocationCode,
                            Location = "",
                            BuildYear = item.BuildYear,
                            Type = item.Type,
                            Status = itemCase.Status,
                            Comment = "",
                            NumberOfImages = 1,
                            SdkCaseId = itemCase.MicrotingSdkCaseId
                        }; 
                        itemsListCasePnModel.Items.Add(_itemCase);
                    }
                    
                    return new OperationDataResult<ItemsListCasePnModel>(
                        true,
                        itemsListCasePnModel);
                }
                else
                {
                    return new OperationDataResult<ItemsListCasePnModel>(
                        false, "");
                }
//                var itemCases = await _dbContext.ItemCases.Where(x => x.ItemId)
            }
            catch
            {
                return new OperationDataResult<ItemsListCasePnModel>(
                    false, "");
            }
        }
    }
}