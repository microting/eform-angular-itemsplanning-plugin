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

namespace ItemsGroupPlanning.Pn
{
    using System;
    using System.Collections.Generic;
    using System.Reflection;
    using Abstractions;
    using Handlers;
    using Infrastructure.Data.Seed;
    using Infrastructure.Data.Seed.Data;
    using Infrastructure.Models.Settings;
    using Messages;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microting.eFormApi.BasePn;
    using Microting.eFormApi.BasePn.Infrastructure.Database.Extensions;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
    using Microting.eFormApi.BasePn.Infrastructure.Settings;
    using Microting.ItemsGroupPlanningBase.Infrastructure.Const;
    using Microting.ItemsGroupPlanningBase.Infrastructure.Data;
    using Microting.ItemsGroupPlanningBase.Infrastructure.Data.Factories;
    using Rebus.Bus;
    using Services;

    public class EformItemsGroupPlanningPlugin : IEformPlugin
    {
        public string Name => "Microting Items Group Planning Plugin";
        public string PluginId => "eform-angular-items-group-planning-plugin";
        public string PluginPath => PluginAssembly().Location;
        public string PluginBaseUrl => "items-group-planning-pn";

        private string _connectionString;
        private eFormCaseUpdatedHandler _eFormCaseUpdatedHandler;
        private IBus _bus;

        public Assembly PluginAssembly()
        {
            return typeof(EformItemsGroupPlanningPlugin).GetTypeInfo().Assembly;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IItemsPlanningLocalizationService, ItemsPlanningLocalizationService>();
            services.AddTransient<IItemsPlanningPnSettingsService, ItemsPlanningPnSettingsService>();
            services.AddTransient<IItemsListCaseService, ItemListCaseService>();
            services.AddTransient<IItemsPlanningReportService, ItemsPlanningReportService>();
            services.AddTransient<IExcelService, ExcelService>();
            services.AddTransient<IItemsListService, ItemsListService>();
            services.AddTransient<IUploadedDataService, UploadedDataService>();
            services.AddSingleton<IRebusService, RebusService>();
        }

        public void AddPluginConfig(IConfigurationBuilder builder, string connectionString)
        {
            var seedData = new ItemsPlanningConfigurationSeedData();
            var contextFactory = new ItemsGroupPlanningPnContextFactory();
            builder.AddPluginConfiguration(
                connectionString, 
                seedData, 
                contextFactory);
            //CaseUpdateDelegates.CaseUpdateDelegate += UpdateRelatedCase;

        }

        public void ConfigureOptionsServices(
            IServiceCollection services, 
            IConfiguration configuration)
        {
            services.ConfigurePluginDbOptions<ItemsPlanningBaseSettings>(
                configuration.GetSection("ItemsPlanningBaseSettings"));
        }

        public void ConfigureDbContext(IServiceCollection services, string connectionString)
        {
            _connectionString = connectionString;
            if (connectionString.ToLower().Contains("convert zero datetime"))
            {
                services.AddDbContext<ItemsGroupPlanningPnDbContext>(o => o.UseMySql(connectionString,
                    b => b.MigrationsAssembly(PluginAssembly().FullName)));
            }
            else
            {
                services.AddDbContext<ItemsGroupPlanningPnDbContext>(o => o.UseSqlServer(connectionString,
                    b => b.MigrationsAssembly(PluginAssembly().FullName)));
            }

            ItemsGroupPlanningPnContextFactory contextFactory = new ItemsGroupPlanningPnContextFactory();
            var context = contextFactory.CreateDbContext(new[] {connectionString});
            context.Database.Migrate();

            // Seed database
            SeedDatabase(connectionString);
        }

        public void Configure(IApplicationBuilder appBuilder)
        {
            var serviceProvider = appBuilder.ApplicationServices;
            IRebusService rebusService = serviceProvider.GetService<IRebusService>();
            rebusService.Start(_connectionString);
            
            _bus = rebusService.GetBus();

        }

        public MenuModel HeaderMenu(IServiceProvider serviceProvider)
        {
            var localizationService = serviceProvider
                .GetService<IItemsPlanningLocalizationService>();

            var result = new MenuModel();
            result.LeftMenu.Add(new MenuItemModel()
            {
                Name = localizationService.GetString("ItemsPlanning"),
                E2EId = "items-planning-pn",
                Link = "",
                Guards = new List<string>() { ItemsGroupPlanningClaims.AccessItemsGroupPlanningPlugin },
                MenuItems = new List<MenuItemModel>()
                {
                    new MenuItemModel()
                    {
                        Name = localizationService.GetString("Lists"),
                        E2EId = "items-planning-pn-lists",
                        Link = "/plugins/items-planning-pn/lists",
                        Position = 0,
                    },
                    new MenuItemModel()
                    {
                        Name = localizationService.GetString("Reports"),
                        E2EId = "items-planning-pn-reports",
                        Link = "/plugins/items-planning-pn/reports",
                        Position = 2,
                    }
                }
            });
            return result;
        }

        public void SeedDatabase(string connectionString)
        {
            // Get DbContext
            var contextFactory = new ItemsGroupPlanningPnContextFactory();
            using (var context = contextFactory.CreateDbContext(new []{connectionString}))
            {
                // Seed configuration
                ItemsGroupPlanningPluginSeed.SeedData(context);
            }
        }

        public PluginPermissionsManager GetPermissionsManager(string connectionString)
        {
            var contextFactory = new ItemsGroupPlanningPnContextFactory();
            var context = contextFactory.CreateDbContext(new[] { connectionString });

            return new PluginPermissionsManager(context);
        }

        private void UpdateRelatedCase(int caseId)
        {
            _bus.SendLocal(new eFormCaseUpdated(caseId));
        }
    }
}