using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection.Metadata;
using System.Threading.Tasks;
using eFormCore;
using eFormData;
using eFormShared;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Extensions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.ItemsPlanningBase.Infrastructure.Data.Entities;
using Microting.ItemsPlanningBase.Infrastructure.Data;
using Newtonsoft.Json.Linq;
using ItemsPlanning.Pn.Abstractions;
using ItemsPlanning.Pn.Infrastructure.Models;

namespace ItemsPlanning.Pn.Services
{
    public class ListService : IListService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ItemsPlanningPnDbContext _dbContext;
        private readonly IItemsPlanningLocalizationService _itemsPlanningLocalizationService;
        
        public ListService(
            IEFormCoreService coreHelper,
            ItemsPlanningPnDbContext dbContext,
            IItemsPlanningLocalizationService itemsPlanningLocalizationService
        )
        {
            _coreHelper = coreHelper;
            _dbContext = dbContext;
            _itemsPlanningLocalizationService = itemsPlanningLocalizationService;
        }

        public async Task<OperationDataResult<ListsModel>> GetAllLists(ListRequestModel pnRequestModel)
        {
            try
            {
                ListsModel listsModel = new ListsModel();
                
                IQueryable<ItemList> itemListsQuery = _dbContext.ItemLists.AsQueryable();
                if (!string.IsNullOrEmpty(pnRequestModel.Sort))
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        itemListsQuery = itemListsQuery
                            .CustomOrderByDescending(pnRequestModel.Sort);
                    }
                    else
                    {
                        itemListsQuery = itemListsQuery
                            .CustomOrderBy(pnRequestModel.Sort);
                    }
                }
                else
                {
                    itemListsQuery = _dbContext.ItemLists
                        .OrderBy(x => x.Id);
                }

                itemListsQuery
                    = itemListsQuery
                        .Where(x => x.WorkflowState != eFormShared.Constants.WorkflowStates.Removed)
                        .Skip(pnRequestModel.Offset)
                        .Take(pnRequestModel.PageSize);
                
                List<ListModel> lists = await itemListsQuery.Select(x => new ListModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description
                    
                }).ToListAsync();

                listsModel.Total = await _dbContext.ItemLists.CountAsync(x => x.WorkflowState != eFormShared.Constants.WorkflowStates.Removed);
                listsModel.Lists = lists;
                
                return new OperationDataResult<ListsModel>(true, listsModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
//                _logger.LogError(e.Message);
                return new OperationDataResult<ListsModel>(false,
                    _itemsPlanningLocalizationService.GetString("ErrorObtainingFractions"));

            }
        }
        
        public Task<OperationResult> CreateList(ListModel model)
        {
            throw new System.NotImplementedException();
        }

        public Task<OperationResult> DeleteList(int id)
        {
            throw new System.NotImplementedException();
        }

        public Task<OperationResult> UpdateList(ListModel updateModel)
        {
            throw new System.NotImplementedException();
        }

        public Task<OperationDataResult<ListModel>> GetSingleList(int fractionId)
        {
            throw new System.NotImplementedException();
        }
    }
}