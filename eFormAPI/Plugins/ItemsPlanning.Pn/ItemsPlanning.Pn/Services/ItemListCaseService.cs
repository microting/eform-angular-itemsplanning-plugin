using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ItemsPlanning.Pn.Abstractions;
using ItemsPlanning.Pn.Infrastructure.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure.Constants;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Extensions;
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

        public async Task<OperationDataResult<ItemsListCasePnModel>> GetSingleList(ItemListCasesPnRequestModel requestModel)
        {
            try
            {

                var newItems = (_dbContext.Items.Where(item => item.ItemListId == requestModel.ListId)
                    .Join(_dbContext.ItemCases, item => item.Id, itemCase => itemCase.ItemId,
                        (item, itemCase) => new
                        {
                            itemCase.Id,
                            item.Name,
                            item.Description,
                            item.Type,
                            item.BuildYear,
                            item.ItemNumber,
                            itemCase.Comment,
                            itemCase.Location,
                            itemCase.FieldStatus,
                            itemCase.NumberOfImages,
                            itemCase.WorkflowState,
                            itemCase.CreatedAt,
                            itemCase.MicrotingSdkCaseId,
                            itemCase.MicrotingSdkeFormId
                        }));
                
                if (!string.IsNullOrEmpty(requestModel.Sort))
                {
                    if (requestModel.IsSortDsc)
                    {
                        newItems = newItems
                            .CustomOrderByDescending(requestModel.Sort);
                    }
                    else
                    {
                        newItems = newItems
                            .CustomOrderBy(requestModel.Sort);
                    }
                }
                else
                {
                    newItems = newItems
                        .OrderBy(x => x.Id);
                }


                newItems
                    = newItems
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Skip(requestModel.Offset)
                        .Take(requestModel.PageSize);
                if (newItems.Any())
                {
                    
                    ItemsListCasePnModel itemsListCasePnModel = new ItemsListCasePnModel();
//                    
//                    IQueryable<ItemCase> itemCaseQuery = _dbContext.ItemCases.Where(x => itemIds.Contains(x.ItemId)).AsQueryable();

                    
                    
//                    foreach (ItemCase itemCase in itemCaseQuery)
//                    {
//                        var item = items.SingleOrDefault(x => x.Id == itemCase.ItemId);
//                        ItemsListPnItemCaseModel model = new ItemsListPnItemCaseModel()
//                        {
//                            Id = itemCase.Id,
//                            Date = itemCase.CreatedAt,
//                            Name = item.Name,
//                            Description = item.Description,
//                            ItemNumber = item.ItemNumber,
//                            LocationCode = item.LocationCode,
//                            Location = itemCase.Location,
//                            BuildYear = item.BuildYear,
//                            Type = item.Type,
//                            Status = itemCase.Status,
//                            Comment = itemCase.Comment,
//                            NumberOfImages = itemCase.NumberOfImages,
//                            SdkCaseId = itemCase.MicrotingSdkCaseId
//                        }; 
//                        itemsListCasePnModel.Items.Add(model);
                    itemsListCasePnModel.Items = await newItems.Select(x => new ItemsListPnItemCaseModel()
                    {
                        Id = x.Id,
                        Date = x.CreatedAt,
                        Name = x.Name,
                        ItemNumber = x.ItemNumber,
                        BuildYear = x.BuildYear,
                        Description = x.Description,
                        Type = x.Type,
                        Comment = x.Comment,
                        Location = x.Location,
                        FieldStatus = x.FieldStatus,
                        NumberOfImages = x.NumberOfImages,
                        SdkCaseId = x.MicrotingSdkCaseId,
                        SdkeFormId = x.MicrotingSdkeFormId
//                        Status = x.Status
                    }).ToListAsync();
                    
//                    itemsListCasePnModel.Total = await _dbContext.ItemCases.CountAsync(x =>
//                        x.WorkflowState != Constants.WorkflowStates.Removed);
                    
                    itemsListCasePnModel.Total = await (_dbContext.Items.Where(item => item.ItemListId == requestModel.ListId)
                        .Join(_dbContext.ItemCases, item => item.Id, itemCase => itemCase.ItemId,
                            (item, itemCase) => new
                            {
                                itemCase.Id
                            })).CountAsync();

                    return new OperationDataResult<ItemsListCasePnModel>(
                        true,
                        itemsListCasePnModel);
                }
                else
                {
                    return new OperationDataResult<ItemsListCasePnModel>(
                        false, "");
                }
            }
            catch (Exception ex)
            {
                return new OperationDataResult<ItemsListCasePnModel>(
                    false, ex.Message);
            }
        }
    }
}