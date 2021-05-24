/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

namespace ItemsGroupPlanning.Pn.Services
{
    using Abstractions;
    using Infrastructure.Models;
    using Infrastructure.Models.Settings;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Dto;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.ItemsGroupPlanningBase.Infrastructure.Data;
    using System;
    using System.Diagnostics;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Xml.Linq;

    public class ItemListCaseService : IItemsListCaseService
    {
        private readonly ItemsGroupPlanningPnDbContext _dbContext;
        private readonly IItemsPlanningLocalizationService _itemsPlanningLocalizationService;
        private readonly IExcelService _excelService;
        private readonly IEFormCoreService _core;
        private readonly IUserService _userService;
        private readonly IPluginDbOptions<ItemsPlanningBaseSettings> _options;

        public ItemListCaseService(
            ItemsGroupPlanningPnDbContext dbContext,
            IUserService userService,
            IItemsPlanningLocalizationService itemsPlanningLocalizationService,
            IExcelService excelService,
            IEFormCoreService core,
            IPluginDbOptions<ItemsPlanningBaseSettings> options)
        {
            _dbContext = dbContext;
            _itemsPlanningLocalizationService = itemsPlanningLocalizationService;
            _core = core;
            _userService = userService;
            _excelService = excelService;
            _options = options;
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

                newItems
                    = newItems
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed);

                newItems = QueryHelper.AddSortToQuery(newItems, requestModel.Sort, requestModel.IsSortDsc);

                var total = await newItems.Select(x => x.BuildYear).CountAsync();

                newItems
                    = newItems
                        .Skip(requestModel.Offset)
                        .Take(requestModel.PageSize);

                if (newItems.Any())
                {

                    var itemsListCasePnModel = new ItemsListCasePnModel
                    {
                        Items = await newItems.Select(x => new ItemsListPnItemCaseModel()
                        {
                            Id = x.Id,
                            Date = x.CreatedAt,
                            CreatedAt = x.CreatedAt,
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
                        }).ToListAsync(),
                        Total = total,
                    };


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
            ItemListPnCaseResultListModel itemListPnCaseResultListModel = await GetTableData(requestModel);

            return new OperationDataResult<ItemListPnCaseResultListModel>(true, itemListPnCaseResultListModel);
        }

        public async Task<OperationDataResult<FileStreamModel>> GenerateSingleListResults(
            ItemListCasesPnRequestModel requestModel)
        {
            string excelFile = null;
            try
            {
                var reportDataResult = await GetTableData(requestModel);
                if (reportDataResult == null)
                {
                    return new OperationDataResult<FileStreamModel>(false, "ERROR");
                }

                var itemList = await _dbContext.ItemLists.SingleOrDefaultAsync(x => x.Id == requestModel.ListId);

                excelFile = _excelService.CopyTemplateForNewAccount("report_template_lists");
                var writeResult = _excelService.WriteTableToExcel(itemList.Name, itemList.Description,
                    reportDataResult,
                    requestModel,
                    excelFile);

                if (!writeResult)
                {
                    throw new Exception($"Error while writing excel file {excelFile}");
                }

                var result = new FileStreamModel()
                {
                    FilePath = excelFile,
                    FileStream = new FileStream(excelFile, FileMode.Open),
                };

                return new OperationDataResult<FileStreamModel>(true, result);
            }
            catch (Exception e)
            {
                if (!string.IsNullOrEmpty(excelFile) && File.Exists(excelFile))
                {
                    File.Delete(excelFile);
                }

                Trace.TraceError(e.Message);
                //_logger.LogError(e.Message);
                return new OperationDataResult<FileStreamModel>(
                    false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileGeneratingReportFile"));
            }
        }

        private async Task<ItemListPnCaseResultListModel> GetTableData(ItemListCasesPnRequestModel requestModel)
        {
            var pluginConfigurationValue = _options.Value.Token;

            var itemList = await _dbContext.ItemLists
                .SingleOrDefaultAsync(x => x.Id == requestModel.ListId);

            var core = await _core.GetCore();
            await using var microtingDbContext = core.DbContextHelper.GetDbContext();
            var locale = await _userService.GetCurrentUserLocale();
            var language = microtingDbContext.Languages.Single(x => x.LanguageCode.ToLower() == locale.ToLower());
            var allFields = await core.Advanced_TemplateFieldReadAll(itemList.RelatedEFormId, language);

            // filter fields
            allFields = allFields.Where(x => x.FieldType != Constants.FieldTypes.SaveButton).ToList();

            var itemListPnCaseResultListModel = new ItemListPnCaseResultListModel
            {
                LabelEnabled = itemList.LabelEnabled,
                DescriptionEnabled = itemList.DescriptionEnabled,
                DeployedAtEnabled = itemList.DeployedAtEnabled,
                DoneAtEnabled = itemList.DoneAtEnabled,
                DoneByUserNameEnabled = itemList.DoneByUserNameEnabled,
                UploadedDataEnabled = itemList.UploadedDataEnabled,
                ItemNumberEnabled = itemList.ItemNumberEnabled,
                LocationCodeEnabled = itemList.LocationCodeEnabled,
                BuildYearEnabled = itemList.BuildYearEnabled,
                TypeEnabled = itemList.TypeEnabled,
                NumberOfImagesEnabled = itemList.NumberOfImagesEnabled,
                SdkeFormId = itemList.RelatedEFormId,
                FieldEnabled1 = itemList.SdkFieldEnabled1,
                FieldEnabled2 = itemList.SdkFieldEnabled2,
                FieldEnabled3 = itemList.SdkFieldEnabled3,
                FieldEnabled4 = itemList.SdkFieldEnabled4,
                FieldEnabled5 = itemList.SdkFieldEnabled5,
                FieldEnabled6 = itemList.SdkFieldEnabled6,
                FieldEnabled7 = itemList.SdkFieldEnabled7,
                FieldEnabled8 = itemList.SdkFieldEnabled8,
                FieldEnabled9 = itemList.SdkFieldEnabled9,
                FieldEnabled10 = itemList.SdkFieldEnabled10,
                FieldName1 = itemList.SdkFieldEnabled1 ? allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId1)?.Label : "",
                FieldName2 = itemList.SdkFieldEnabled2 ? allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId2)?.Label : "",
                FieldName3 = itemList.SdkFieldEnabled3 ? allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId3)?.Label : "",
                FieldName4 = itemList.SdkFieldEnabled4 ? allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId4)?.Label : "",
                FieldName5 = itemList.SdkFieldEnabled5 ? allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId5)?.Label : "",
                FieldName6 = itemList.SdkFieldEnabled6 ? allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId6)?.Label : "",
                FieldName7 = itemList.SdkFieldEnabled7 ? allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId7)?.Label : "",
                FieldName8 = itemList.SdkFieldEnabled8 ? allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId8)?.Label : "",
                FieldName9 = itemList.SdkFieldEnabled9 ? allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId9)?.Label : "",
                FieldName10 = itemList.SdkFieldEnabled10 ? allFields.SingleOrDefault(x => x.Id == itemList.SdkFieldId10)?.Label : "",
            };

            var newItems = _dbContext.Items
                .Where(item => item.ItemListId == requestModel.ListId)
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
                        itemCase.CreatedAt,
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
                        itemCase.WorkflowState,
                        itemCase.NumberOfImages
                    });

            if (requestModel.DateFrom != null)
            {
                newItems = newItems.Where(x =>
                    x.CreatedAt >= new DateTime(requestModel.DateFrom.Value.Year, requestModel.DateFrom.Value.Month, requestModel.DateFrom.Value.Day, 0, 0, 0));
            }

            if (requestModel.DateTo != null)
            {
                newItems = newItems.Where(x =>
                    x.CreatedAt <= new DateTime(requestModel.DateTo.Value.Year, requestModel.DateTo.Value.Month, requestModel.DateTo.Value.Day, 23, 59, 59));
            }

            // Add sort
            newItems = QueryHelper.AddSortToQuery(newItems, requestModel.Sort, requestModel.IsSortDsc);

            newItems = newItems
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed);

            // Get total
            itemListPnCaseResultListModel.Total = await newItems.Select(x => x.Id).CountAsync();

            // Pagination
            newItems
                = newItems
                    .Skip(requestModel.Offset)
                    .Take(requestModel.PageSize);

            // add select and get from db
            itemListPnCaseResultListModel.Items = newItems
                .Select(x => new ItemsListPnCaseResultModel
                {
                    Id = x.Id,
                    DoneAt = x.MicrotingSdkCaseDoneAt,
                    DeployedAt = x.CreatedAt,
                    DoneByUserName = x.DoneByUserName,
                    Label = x.Name,
                    Description = x.Description,
                    ItemNumber = x.ItemNumber,
                    LocationCode = x.LocationCode,
                    BuildYear = x.BuildYear,
                    Type = x.Type,
                    NumberOfImages = x.NumberOfImages,
                    Field1 = x.SdkFieldValue1,
                    Field2 = x.SdkFieldValue2,
                    Field3 = x.SdkFieldValue3,
                    Field4 = x.SdkFieldValue4,
                    Field5 = x.SdkFieldValue5,
                    Field6 = x.SdkFieldValue6,
                    Field7 = x.SdkFieldValue7,
                    Field8 = x.SdkFieldValue8,
                    Field9 = x.SdkFieldValue9,
                    Field10 = x.SdkFieldValue10,
                    SdkCaseId = x.MicrotingSdkCaseId,
                    SdkeFormId = itemList.RelatedEFormId,
                    Status = x.Status,
                    Token = pluginConfigurationValue,
                })
                .ToList();

            return itemListPnCaseResultListModel;
        }

        public async Task<OperationDataResult<ItemsListPnItemCaseModel>> GetSingleCase(int caseId)
        {
            try
            {
                var itemCase = await _dbContext.ItemCases.FirstOrDefaultAsync(x => x.Id == caseId);
                var item = await _dbContext.Items.FirstOrDefaultAsync(x => x.Id == itemCase.ItemId);

                var itemCaseModel = new ItemsListPnItemCaseModel
                {
                    Id = itemCase.Id,
                    Comment = itemCase.Comment,
                    Status = itemCase.Status,
                    NumberOfImages = itemCase.NumberOfImages,
                    Location = itemCase.Location,
                    Description = item.Description,
                    ItemNumber = item.ItemNumber,
                    BuildYear = item.BuildYear,
                    Type = item.Type,
                };

                return new OperationDataResult<ItemsListPnItemCaseModel>(true, itemCaseModel);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public async Task<string> DownloadEFormPdf(int caseId, string token, string fileType)
        {
            var pluginConfigurationValue = _options.Value.Token;
            if (token == pluginConfigurationValue)
            {
                try
                {
                    var core = await _core.GetCore();
                    var eFormId = 0;
                    var itemCase = await _dbContext.ItemCases.FirstOrDefaultAsync(x => x.Id == caseId);
                    var item = await _dbContext.Items.SingleOrDefaultAsync(x => x.Id == itemCase.ItemId);
                    var itemList = await _dbContext.ItemLists.SingleOrDefaultAsync(x => x.Id == item.ItemListId);

                    await using var microtingDbContext = core.DbContextHelper.GetDbContext();
                    var locale = await _userService.GetCurrentUserLocale();
                    var language = microtingDbContext.Languages.Single(x => x.LanguageCode.ToLower() == locale.ToLower());
                    if (itemList != null)
                    {
                        eFormId = itemList.RelatedEFormId;
                    }

                    var xmlContent = new XElement("ItemCase",
                        new XElement("ItemId", item.Id),
                        new XElement("ItemNumber", item.ItemNumber),
                        new XElement("ItemName", item.Name),
                        new XElement("ItemDescription", item.Description),
                        new XElement("ItemLocationCode", item.LocationCode),
                        new XElement("ItemBuildYear", item.BuildYear),
                        new XElement("ItemType", item.Type)
                    ).ToString();

                    if (caseId != 0 && eFormId != 0)
                    {
                        var filePath = await core.CaseToPdf(itemCase.MicrotingSdkCaseId, eFormId.ToString(),
                            DateTime.Now.ToString("yyyyMMddHHmmssffff"),
                            $"{core.GetSdkSetting(Settings.httpServerAddress)}/" + "api/template-files/get-image/", fileType, xmlContent, language);
                        if (!File.Exists(filePath))
                        {
                            throw new FileNotFoundException();
                        }

                        return filePath;
                    }

                    throw new Exception("Could not find case of eform!");

                }
                catch (Exception exception)
                {
                    Log.LogException($"ItemListCaseService.DownloadEFormPdf: Got exception {exception.Message}");
                    throw new Exception("Something went wrong!", exception);
                }
            }

            throw new UnauthorizedAccessException();
        }

    }
}
