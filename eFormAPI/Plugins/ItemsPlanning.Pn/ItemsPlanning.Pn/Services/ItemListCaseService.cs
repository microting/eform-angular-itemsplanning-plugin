using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Office2010.Excel;
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
                            itemCase.MicrotingSdkeFormId,
                            itemCase.Status
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
                        SdkeFormId = x.MicrotingSdkeFormId,
                        Status = x.Status
                    }).ToListAsync();
                    
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

        public async Task<OperationDataResult<ItemListPnCaseResultListModel>> GetSingleListResults(ItemListCasesPnRequestModel requestModel)
        {
            ItemListPnCaseResultListModel itemListPnCaseResultListModel = new ItemListPnCaseResultListModel();
            itemListPnCaseResultListModel.Total = 0;
            itemListPnCaseResultListModel.FieldEnabled1 = true;
            
            return new OperationDataResult<ItemListPnCaseResultListModel>(true, itemListPnCaseResultListModel);
        }

        public async Task<OperationDataResult<ItemsListPnItemCaseModel>> GetSingleCase(int caseId)
        {
            try
            {
                ItemsListPnItemCaseModel itemCaseModel = new ItemsListPnItemCaseModel();

                var itemCase = await _dbContext.ItemCases.FirstOrDefaultAsync(x => x.Id == caseId);
                var item = await _dbContext.Items.FirstOrDefaultAsync(x => x.Id == itemCase.ItemId);
                
                                
                itemCaseModel.Id = itemCase.Id;
                itemCaseModel.Comment = itemCase.Comment;
                itemCaseModel.Status = itemCase.Status;
                itemCaseModel.NumberOfImages = itemCase.NumberOfImages;
                itemCaseModel.Location = itemCase.Location;
                itemCaseModel.Description = item.Description;
                itemCaseModel.ItemNumber = item.ItemNumber;
                itemCaseModel.BuildYear = item.BuildYear;
                itemCaseModel.Type = item.Type;
//                
//                if (itemCaseModel == null)
//                {
//                    return new OperationDataResult<ItemsListPnItemCaseModel>(false,
//                        _itemsPlanningLocalizationService.GetString(($"ListItemCase with ID: {caseId} does not exist")));
//                }
                return new OperationDataResult<ItemsListPnItemCaseModel>(true, itemCaseModel);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            return new OperationDataResult<ItemsListPnItemCaseModel>(false, "Not done yet.");
        }
    }
}