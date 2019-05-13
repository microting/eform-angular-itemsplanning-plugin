using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microting.eFormApi.BasePn.Infrastructure.Extensions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.ItemsPlanningBase.Infrastructure.Data.Entities;
using Microting.ItemsPlanningBase.Infrastructure.Data;
using ItemsPlanning.Pn.Abstractions;

namespace ItemsPlanning.Pn.Services
{
    using System.Security.Claims;
    using Infrastructure.Models;
    using Microsoft.AspNetCore.Http;

    public class ItemsListService : IItemsListService
    {
        private readonly ItemsPlanningPnDbContext _dbContext;
        private readonly IItemsPlanningLocalizationService _itemsPlanningLocalizationService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ItemsListService(
            ItemsPlanningPnDbContext dbContext,
            IItemsPlanningLocalizationService itemsPlanningLocalizationService,
            IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _itemsPlanningLocalizationService = itemsPlanningLocalizationService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<OperationDataResult<ItemsListsModel>> GetAllLists(ItemsListRequestModel pnRequestModel)
        {
            try
            {
                ItemsListsModel listsModel = new ItemsListsModel();

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

                List<ItemsListPnModel> lists = await itemListsQuery.Select(x => new ItemsListPnModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    RepeatEvery = x.RepeatEvery,
                    RepeatOn = x.RepeatOn,
                    RepeatType = x.RepeatType,
                    RepeatUntil = x.RepeatUntil,
                    TemplateId = x.TemplateId,
                }).ToListAsync();

                listsModel.Total = await _dbContext.ItemLists.CountAsync(x =>
                    x.WorkflowState != eFormShared.Constants.WorkflowStates.Removed);
                listsModel.Lists = lists;

                return new OperationDataResult<ItemsListsModel>(true, listsModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<ItemsListsModel>(false,
                    _itemsPlanningLocalizationService.GetString("ErrorObtainingFractions"));
            }
        }

        public async Task<OperationResult> CreateList(ItemsListPnModel model)
        {
            try
            {
                var itemsList = new ItemList
                {
                    Name = model.Name,
                    Description = model.Description,
                    CreatedByUserId = UserId,
                    CreatedAt = DateTime.UtcNow,
                    RepeatEvery = model.RepeatEvery,
                    TemplateId = model.TemplateId,
                    RepeatUntil = model.RepeatUntil,
                    RepeatOn = model.RepeatOn,
                    RepeatType = model.RepeatType,
                    Enabled = true,
                };

                await itemsList.Save(_dbContext);

                return new OperationResult(
                    true,
                    _itemsPlanningLocalizationService.GetString(""));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationResult(false,
                    _itemsPlanningLocalizationService.GetString(""));
            }
        }

        public async Task<OperationResult> DeleteList(int id)
        {
            try
            {
                var itemsList = new ItemList
                {
                    Id = id
                };
                await itemsList.Delete(_dbContext);

                return new OperationResult(
                    true,
                    _itemsPlanningLocalizationService.GetString(""));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationResult(
                    false,
                    _itemsPlanningLocalizationService.GetString(""));
            }
        }

        public async Task<OperationResult> UpdateList(ItemsListPnModel updateModel)
        {
            try
            {
                var itemsList = new ItemList
                {
                    Id = updateModel.Id,
                    RepeatUntil = updateModel.RepeatUntil,
                    RepeatOn = updateModel.RepeatOn,
                    RepeatEvery = updateModel.RepeatEvery,
                    TemplateId = updateModel.TemplateId,
                    RepeatType = updateModel.RepeatType,
                    Description = updateModel.Description,
                    Name = updateModel.Name,
                    UpdatedAt = DateTime.UtcNow,
                    UpdatedByUserId = UserId,
                };
                await itemsList.Update(_dbContext);

                return new OperationResult(
                    true,
                    _itemsPlanningLocalizationService.GetString(""));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationResult(
                    false,
                    _itemsPlanningLocalizationService.GetString(""));
            }
        }

        public async Task<OperationDataResult<ItemsListPnModel>> GetSingleList(int fractionId)
        {
            try
            {
                var itemList = await _dbContext.ItemLists
                    .Where(x => x.WorkflowState != eFormShared.Constants.WorkflowStates.Removed)
                    .Select(x => new ItemsListPnModel()
                    {
                        Id = x.Id,
                        RepeatUntil = x.RepeatUntil,
                        RepeatOn = x.RepeatOn,
                        RepeatEvery = x.RepeatEvery,
                        TemplateId = x.TemplateId,
                        RepeatType = x.RepeatType,
                        Description = x.Description,
                        Name = x.Name,
                        Items = x.Items.Select(i=> new ItemsListPnItemModel()
                        {
                            Id = i.Id,
                            Description = i.Description,
                            Name = i.Name,
                            LocationCode = i.LocationCode,
                            ItemNumber = i.ItemNumber,
                        }).ToList()
                    }).FirstOrDefaultAsync();

                if (itemList == null)
                {
                    return new OperationDataResult<ItemsListPnModel>(
                        false,
                        _itemsPlanningLocalizationService.GetString(""));
                }


                return new OperationDataResult<ItemsListPnModel>(
                    true,
                    itemList);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<ItemsListPnModel>(
                    false,
                    _itemsPlanningLocalizationService.GetString(""));
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