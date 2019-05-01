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
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using ItemsPlanning.Pn.Abstractions;
using ItemsPlanning.Pn.Infrastructure.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.ItemsPlanningBase.Infrastructure.Data;

namespace ItemsPlanning.Pn.Services
{
    public class ItemsPlanningPnSettingsService : IItemsPlanningPnSettingsService
    {
        private readonly ILogger<ItemsPlanningPnSettingsService> _logger;
        private readonly IItemsPlanningLocalizationService _itemsPlanningLocalizationService;
        private readonly ItemsPlanningPnDbContext _dbContext;
        private readonly IPluginDbOptions<ItemsPlanningBaseSettings> _options;
        private readonly IHttpContextAccessor _httpContextAccessor;
        
        public OperationDataResult<ItemsPlanningBaseSettings> GetSettings()
        {
            try
            {
                var option = _options.Value;

                if (option.SdkConnectionString == "...")
                {
                    string connectionString = _dbContext.Database.GetDbConnection().ConnectionString;

                    string dbNameSection = Regex.Match(connectionString, @"(Database=(...)_eform-angular-\w*-plugin;)").Groups[0].Value;
                    string dbPrefix = Regex.Match(connectionString, @"Database=(\d*)_").Groups[1].Value;
                    string sdk = $"Database={dbPrefix}_SDK;";
                    connectionString = connectionString.Replace(dbNameSection, sdk);
                    _options.UpdateDb(settings => { settings.SdkConnectionString = connectionString;}, _dbContext, UserId);

                }

                return new OperationDataResult<ItemsPlanningBaseSettings>(true, option);
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<ItemsPlanningBaseSettings>(false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileObtainingItemsPlanningSettings"));
            }
        }

        public async Task<OperationResult> UpdateSettings(ItemsPlanningBaseSettings itemsPlanningBaseSettings)
        {
            try
            {
                await _options.UpdateDb(settings =>
                {
                    settings.LogLevel = itemsPlanningBaseSettings.LogLevel;
                    settings.LogLimit = itemsPlanningBaseSettings.LogLimit;
                    settings.MaxParallelism = itemsPlanningBaseSettings.MaxParallelism;
                    settings.NumberOfWorkers = itemsPlanningBaseSettings.NumberOfWorkers;
                    settings.SdkConnectionString = itemsPlanningBaseSettings.SdkConnectionString;
                }, _dbContext, UserId);
                
                return new OperationResult(true,
                    _itemsPlanningLocalizationService.GetString("SettingsHaveBeenUpdatedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileUpdatingSettings"));
            }
        }
        
        public int UserId
        {
            get
            {
                var value = _httpContextAccessor?.HttpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier);
                return value == null ? 0 : int.Parse(value);
            }
        }
    }
}