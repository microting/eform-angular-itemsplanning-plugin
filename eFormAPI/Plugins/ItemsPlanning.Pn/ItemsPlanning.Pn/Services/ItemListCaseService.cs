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
            itemListPnCaseResultListModel.LabelEnabled = itemList.LabelEnabled;
            itemListPnCaseResultListModel.DescriptionEnabled = itemList.DescriptionEnabled;
            itemListPnCaseResultListModel.DoneAtEnabled = itemList.DoneAtEnabled;
            itemListPnCaseResultListModel.DoneByUserNameEnabled = itemList.DoneByUserNameEnabled;
            itemListPnCaseResultListModel.UploadedDataEnabled = itemList.UploadedDataEnabled;
            itemListPnCaseResultListModel.ItemNumberEnabled = itemList.ItemNumberEnabled;
            itemListPnCaseResultListModel.LocationCodeEnabled = itemList.LocationCodeEnabled;
            itemListPnCaseResultListModel.BuildYearEnabled = itemList.BuildYearEnabled;
            itemListPnCaseResultListModel.TypeEnabled = itemList.TypeEnabled;
            
            itemListPnCaseResultListModel.FieldEnabled1 = itemList.SdkFieldEnabled1;
            if ( itemListPnCaseResultListModel.FieldEnabled1)
                itemListPnCaseResultListModel.FieldName1 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId1)?.Label;
            
            itemListPnCaseResultListModel.FieldEnabled2 = itemList.SdkFieldEnabled2;
            if (itemListPnCaseResultListModel.FieldEnabled2)
                itemListPnCaseResultListModel.FieldName2 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId2)?.Label;
            
            itemListPnCaseResultListModel.FieldEnabled3 = itemList.SdkFieldEnabled3;
            if (itemListPnCaseResultListModel.FieldEnabled3)
                itemListPnCaseResultListModel.FieldName3 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId3)?.Label;
            
            itemListPnCaseResultListModel.FieldEnabled4 = itemList.SdkFieldEnabled4;
            if (itemListPnCaseResultListModel.FieldEnabled4)
                itemListPnCaseResultListModel.FieldName4 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId4)?.Label;
            
            itemListPnCaseResultListModel.FieldEnabled5 = itemList.SdkFieldEnabled5;
            if (itemListPnCaseResultListModel.FieldEnabled5)
                itemListPnCaseResultListModel.FieldName5 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId5)?.Label;
            
            itemListPnCaseResultListModel.FieldEnabled6 = itemList.SdkFieldEnabled6;
            if (itemListPnCaseResultListModel.FieldEnabled6)
                itemListPnCaseResultListModel.FieldName6 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId6)?.Label;
            
            itemListPnCaseResultListModel.FieldEnabled7 = itemList.SdkFieldEnabled7;
            if (itemListPnCaseResultListModel.FieldEnabled7)
                itemListPnCaseResultListModel.FieldName7 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId7)?.Label;
            
            itemListPnCaseResultListModel.FieldEnabled8 = itemList.SdkFieldEnabled8;
            if (itemListPnCaseResultListModel.FieldEnabled8)
                itemListPnCaseResultListModel.FieldName8 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId8)?.Label;
            
            itemListPnCaseResultListModel.FieldEnabled9 = itemList.SdkFieldEnabled9;
            if (itemListPnCaseResultListModel.FieldEnabled9)
                itemListPnCaseResultListModel.FieldName9 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId9)?.Label;
            
            itemListPnCaseResultListModel.FieldEnabled10 = itemList.SdkFieldEnabled10;
            if (itemListPnCaseResultListModel.FieldEnabled10)
                itemListPnCaseResultListModel.FieldName10 = allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId10)?.Label;
            
            var newItems = (_dbContext.Items.Where(item => item.ItemListId == requestModel.ListId)
                .Join(_dbContext.ItemCases, item => item.Id, itemCase => itemCase.ItemId,
                    (item, itemCase) => new
                    {
                        itemCase.Id,
                        item.Name,
                        item.Description,
                        item.BuildYear,
                        item.LocationCode,
                        item.ItemNumber,
                        item.Type,
                        itemCase.MicrotingSdkCaseDoneAt,
                        itemCase.MicrotingSdkCaseId,
                        itemCase.Status,
                        itemCase.DoneByUserName,
                        itemCase.SdkFieldValue1,
                        itemCase.SdkFieldValue2,
                        itemCase.SdkFieldValue3,
                        itemCase.SdkFieldValue4,
                        itemCase.SdkFieldValue5,
                        itemCase.SdkFieldValue6,
                        itemCase.SdkFieldValue7,
                        itemCase.SdkFieldValue8,
                        itemCase.SdkFieldValue9,
                        itemCase.SdkFieldValue10,
                        itemCase.WorkflowState
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

            itemListPnCaseResultListModel.Items = new List<ItemsListPnCaseResultModel>();
            
            foreach (var item in newItems.ToList())
            {
                Console.WriteLine($"[DBG] ItemListCaseService.GetSingleListResults: Looking at case with id {item.Id} with status {item.Status}");

                try
                {
                
                    ItemsListPnCaseResultModel newItem = new ItemsListPnCaseResultModel()
                    {
                        Id = item.Id,
                        DoneAt = item.MicrotingSdkCaseDoneAt,
                        DoneByUserName = item.DoneByUserName,
                        Label = item.Name,
                        Description = item.Description,
                        Field1 = item.SdkFieldValue1,
                        Field2 = item.SdkFieldValue2,
                        Field3 = item.SdkFieldValue3,
                        Field4 = item.SdkFieldValue4,
                        Field5 = item.SdkFieldValue5,
                        Field6 = item.SdkFieldValue6,
                        Field7 = item.SdkFieldValue7,
                        Field8 = item.SdkFieldValue8,
                        Field9 = item.SdkFieldValue9,
                        Field10 = item.SdkFieldValue10,
                        SdkCaseId = item.MicrotingSdkCaseId,
                        SdkeFormId = itemList.RelatedEFormId,
                        Status = item.Status
                    };
                    itemListPnCaseResultListModel.Items.Add(newItem);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
            
            return new OperationDataResult<ItemListPnCaseResultListModel>(true, itemListPnCaseResultListModel);
        }
    }
}