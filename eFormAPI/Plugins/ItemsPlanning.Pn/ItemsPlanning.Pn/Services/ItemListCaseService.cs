using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using ItemsPlanning.Pn.Abstractions;
using ItemsPlanning.Pn.Infrastructure.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Dto;
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
            var itemList = await _dbContext.ItemLists.SingleOrDefaultAsync(x => x.Id == requestModel.ListId);

            List<Field_Dto> allFields = _core.GetCore().Advanced_TemplateFieldReadAll(itemList.RelatedEFormId);

            int i = 0;
            List<int> toBeRemoved = new List<int>();
            foreach (Field_Dto field in allFields)
            {
                if (field.FieldType == Constants.FieldTypes.SaveButton)
                {
                    toBeRemoved.Add(i);
                }

                i += 1;
            }

            foreach (int i1 in toBeRemoved)
            {
                allFields.RemoveAt(i1);
            }
            
            ItemListPnCaseResultListModel itemListPnCaseResultListModel = new ItemListPnCaseResultListModel();
            itemListPnCaseResultListModel.Total = 0;
            itemListPnCaseResultListModel.FieldEnabled1 = allFields.Any();
            if ( itemListPnCaseResultListModel.FieldEnabled1)
                itemListPnCaseResultListModel.FieldName1 = allFields[0].Label;
            
            itemListPnCaseResultListModel.FieldEnabled2 = allFields.Count() > 1;
            if (itemListPnCaseResultListModel.FieldEnabled2)
                itemListPnCaseResultListModel.FieldName2 = allFields[1].Label;
            
            itemListPnCaseResultListModel.FieldEnabled3 = allFields.Count() > 1;
            if (itemListPnCaseResultListModel.FieldEnabled3)
                itemListPnCaseResultListModel.FieldName3 = allFields[2].Label;
            
            itemListPnCaseResultListModel.FieldEnabled4 = allFields.Count() > 1;
            if (itemListPnCaseResultListModel.FieldEnabled4)
                itemListPnCaseResultListModel.FieldName4 = allFields[3].Label;
            
            itemListPnCaseResultListModel.FieldEnabled5 = allFields.Count() > 1;
            if (itemListPnCaseResultListModel.FieldEnabled5)
                itemListPnCaseResultListModel.FieldName5 = allFields[4].Label;
            
            itemListPnCaseResultListModel.FieldEnabled6 = allFields.Count() > 1;
            if (itemListPnCaseResultListModel.FieldEnabled6)
                itemListPnCaseResultListModel.FieldName6 = allFields[5].Label;
            
            itemListPnCaseResultListModel.FieldEnabled7 = allFields.Count() > 1;
            if (itemListPnCaseResultListModel.FieldEnabled7)
                itemListPnCaseResultListModel.FieldName7 = allFields[6].Label;
            
            itemListPnCaseResultListModel.FieldEnabled8 = allFields.Count() > 1;
            if (itemListPnCaseResultListModel.FieldEnabled8)
                itemListPnCaseResultListModel.FieldName8 = allFields[7].Label;
            
            itemListPnCaseResultListModel.FieldEnabled9 = allFields.Count() > 1;
            if (itemListPnCaseResultListModel.FieldEnabled9)
                itemListPnCaseResultListModel.FieldName9 = allFields[8].Label;
            
            itemListPnCaseResultListModel.FieldEnabled10 = allFields.Count() > 1;
            if (itemListPnCaseResultListModel.FieldEnabled10)
                itemListPnCaseResultListModel.FieldName10 = allFields[9].Label;
            
            var newItems = (_dbContext.Items.Where(item => item.ItemListId == requestModel.ListId)
                .Join(_dbContext.ItemCases, item => item.Id, itemCase => itemCase.ItemId,
                    (item, itemCase) => new
                    {
                        itemCase.Id,
                        item.Name,
                        item.Description,
                        itemCase.MicrotingSdkCaseDoneAt,
                        itemCase.MicrotingSdkCaseId,
                        itemCase.Status
                    })).ToList();

            itemListPnCaseResultListModel.Items = new List<ItemsListPnCaseResultModel>();
            
            foreach (var item in newItems)
            {
                if (item.Status == 100)
                {
                    try
                    {
                        DateTime? doneAt = null;

                        string doneByUserName = "";

                        int? sdkeFormId = null;

                        var caseDto = _core.GetCore().CaseReadByCaseId(item.MicrotingSdkCaseId);
                        if (caseDto.CheckUId != null)
                        {
                            var microtingUId = caseDto.MicrotingUId;
                            var microtingCheckUId = caseDto.CheckUId;
                            var theCase = _core.GetCore().CaseRead(microtingUId, microtingCheckUId);
                            doneAt = theCase.DoneAt;
                            sdkeFormId = caseDto.CheckListId;
                        }
                    
                        ItemsListPnCaseResultModel newItem = new ItemsListPnCaseResultModel()
                        {
                            Id = item.Id,
                            DoneAt = doneAt,
                            DoneByUserName = doneByUserName,
                            Label = item.Name,
                            Description = item.Description,
                            Field1 = "",
                            Field2 = "",
                            Field3 = "",
                            Field4 = "",
                            Field5 = "",
                            Field6 = "",
                            Field7 = "",
                            Field8 = "",
                            Field9 = "",
                            Field10 = "",
                            Field11 = "",
                            Field12 = "",
                            Field13 = "",
                            Field14 = "",
                            Field15 = "",
                            Field16 = "",
                            Field17 = "",
                            Field18 = "",
                            Field19 = "",
                            Field20 = "",
                            SdkCaseId = item.MicrotingSdkCaseId,
                            SdkeFormId = (int)sdkeFormId,
                            Status = item.Status
                        };
                        itemListPnCaseResultListModel.Items.Add(newItem);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }
                }
            }
            
            return new OperationDataResult<ItemListPnCaseResultListModel>(true, itemListPnCaseResultListModel);
        }
    }
}