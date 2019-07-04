/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

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

using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ItemsPlanning.Pn.Abstractions;
using ItemsPlanning.Pn.Infrastructure.Helpers;
using ItemsPlanning.Pn.Infrastructure.Models;
using ItemsPlanning.Pn.Infrastructure.Models.Report;
using ItemsPlanning.Pn.Infrastructure.Models.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.ItemsPlanningBase.Infrastructure.Data;

namespace ItemsPlanning.Pn.Services
{
    public class ItemsPlanningReportService : IItemsPlanningReportService
    {
        private readonly ILogger<ItemsPlanningReportService> _logger;
        private readonly IItemsPlanningLocalizationService _machineAreaLocalizationService;
        private readonly IExcelService _excelService;
        private readonly ItemsPlanningPnDbContext _dbContext;
        private readonly IEFormCoreService _coreHelper;
        private readonly IPluginDbOptions<ItemsPlanningBaseSettings> _options;

        // ReSharper disable once SuggestBaseTypeForParameter
        public ItemsPlanningReportService(IItemsPlanningLocalizationService machineAreaLocalizationService, ILogger<ItemsPlanningReportService> logger, IExcelService excelService, ItemsPlanningPnDbContext dbContext, IEFormCoreService coreHelper, IPluginDbOptions<ItemsPlanningBaseSettings> options)
        {
            _machineAreaLocalizationService = machineAreaLocalizationService;
            _logger = logger;
            _excelService = excelService;
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _options = options;
        }

        public async Task<OperationDataResult<ReportModel>> GenerateReport(GenerateReportModel model)
        {
            try
            {
                Debugger.Break();
                var core = _coreHelper.GetCore();
                var itemList = await _dbContext.ItemLists.FirstAsync(x => x.Id == model.ItemList);
                var item = await _dbContext.Items.FirstAsync(x => x.Id == model.Item);
                var template = core.TemplateRead(itemList.RelatedEFormId);

                var casesQuery = _dbContext.ItemCases.Where(x => x.ItemId == model.Item);

                if (model.DateFrom != null)
                {
                    DateTime? dateFrom = model.DateFrom.Value;
                    casesQuery = casesQuery.Where(x => 
                        x.CreatedAt >= new DateTime(dateFrom.Value.Year, dateFrom.Value.Month, dateFrom.Value.Day, 0, 0, 0));
                }

                if (model.DateTo != null)
                {
                    DateTime? dateTo = model.DateTo.Value;
                    casesQuery = casesQuery.Where(x => 
                        x.CreatedAt <= new DateTime(dateTo.Value.Year, dateTo.Value.Month, dateTo.Value.Day, 23, 59, 59));
                }

                var itemCases = await casesQuery.ToListAsync();
                var cases = itemCases.Select(x => core.CaseLookupMUId(x.MicrotingSdkCaseId.ToString())).ToList();
                var replies = cases.Select(x => core.CaseRead(x.MicrotingUId, x.CheckUId)).Where(x => x != null).ToList();
                
                var reportModel = ReportsHelper.GetReportData(model, item, replies, template);

                return new OperationDataResult<ReportModel>(true, reportModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<ReportModel>(false,
                    _machineAreaLocalizationService.GetString("ErrorWhileGeneratingReport"));
            }
        }

        public async Task<OperationDataResult<FileStreamModel>> GenerateReportFile(GenerateReportModel model)
        {
            string excelFile = null;
            try
            {
                OperationDataResult<ReportModel> reportDataResult = await GenerateReport(model);
                if (!reportDataResult.Success)
                {
                    return new OperationDataResult<FileStreamModel>(false, reportDataResult.Message);
                }

                excelFile = _excelService.CopyTemplateForNewAccount("report_template");
                bool writeResult = _excelService.WriteRecordsExportModelsToExcelFile(
                    reportDataResult.Model,
                    model,
                    excelFile);

                if (!writeResult)
                {
                    throw new Exception($"Error while writing excel file {excelFile}");
                }

                FileStreamModel result = new FileStreamModel()
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
                _logger.LogError(e.Message);
                return new OperationDataResult<FileStreamModel>(
                    false,
                    _machineAreaLocalizationService.GetString("ErrorWhileGeneratingReportFile"));
            }
        }
    }
}