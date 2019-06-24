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
using Microting.eFormApi.BasePn.Abstractions;

namespace ItemsPlanning.Pn.Services
{
    using System.Security.Claims;
    using eFormShared;
    using Infrastructure.Models;
    using Microsoft.AspNetCore.Http;

    public class ItemsListService : IItemsListService
    {
        private readonly ItemsPlanningPnDbContext _dbContext;
        private readonly IItemsPlanningLocalizationService _itemsPlanningLocalizationService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEFormCoreService _core;

        public ItemsListService(
            ItemsPlanningPnDbContext dbContext,
            IItemsPlanningLocalizationService itemsPlanningLocalizationService,
            IHttpContextAccessor httpContextAccessor, IEFormCoreService core)
        {
            _dbContext = dbContext;
            _itemsPlanningLocalizationService = itemsPlanningLocalizationService;
            _httpContextAccessor = httpContextAccessor;
            _core = core;
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
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Skip(pnRequestModel.Offset)
                        .Take(pnRequestModel.PageSize);

                List<ItemsListPnModel> lists = await itemListsQuery.Select(x => new ItemsListPnModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    RepeatEvery = x.RepeatEvery,
                    RepeatType = x.RepeatType,
                    RepeatUntil = x.RepeatUntil,
                    DayOfWeek = x.DayOfWeek,
                    DayOfMonth = x.DayOfMonth,
                    RelatedEFormId = x.RelatedEFormId,
                    RelatedEFormName = x.RelatedEFormName,
                }).ToListAsync();

                listsModel.Total = await _dbContext.ItemLists.CountAsync(x =>
                    x.WorkflowState != Constants.WorkflowStates.Removed);
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
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                Debugger.Break();
                try
                {
                    var template = _core.GetCore().TemplateItemRead(model.RelatedEFormId);
                    var itemsList = new ItemList
                    {
                        Name = model.Name,
                        Description = model.Description,
                        CreatedByUserId = UserId,
                        CreatedAt = DateTime.UtcNow,
                        RepeatEvery = model.RepeatEvery,
                        RepeatUntil = model.RepeatUntil,
                        RepeatType = model.RepeatType,
                        DayOfWeek = model.DayOfWeek,
                        DayOfMonth = model.DayOfMonth,
                        Enabled = true,
                        Items = new List<Item>(),
                        RelatedEFormId = model.RelatedEFormId,
                        RelatedEFormName = template.Label
                    };

                    await itemsList.Save(_dbContext);

                    foreach (var itemModel in model.Items)
                    {
                        var item = new Item()
                        {
                            LocationCode = itemModel.LocationCode,
                            ItemNumber = itemModel.ItemNumber,
                            Description = itemModel.Description,
                            Name = itemModel.Name,
                            Version = 1,
                            WorkflowState = Constants.WorkflowStates.Created,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            Enabled = true,
                            ItemListId = itemsList.Id,
                            CreatedByUserId = UserId,
                        };
                        await item.Save(_dbContext);
                    }

                    transaction.Commit();
                    return new OperationResult(
                        true,
                        _itemsPlanningLocalizationService.GetString("ListCreatedSuccessfully"));
                }
                catch (Exception e)
                {
                    transaction.Rollback();
                    Trace.TraceError(e.Message);
                    return new OperationResult(false,
                        _itemsPlanningLocalizationService.GetString("ErrorWhileCreatingList"));
                }
            }
        }

        public async Task<OperationResult> UpdateList(ItemsListPnModel updateModel)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var template = _core.GetCore().TemplateItemRead(updateModel.RelatedEFormId);
                    var itemsList = new ItemList
                    {
                        Id = updateModel.Id,
                        RepeatUntil = updateModel.RepeatUntil,
                        RepeatEvery = updateModel.RepeatEvery,
                        RepeatType = updateModel.RepeatType,
                        DayOfWeek = updateModel.DayOfWeek,
                        DayOfMonth = updateModel.DayOfMonth,
                        Description = updateModel.Description,
                        Name = updateModel.Name,
                        UpdatedAt = DateTime.UtcNow,
                        UpdatedByUserId = UserId,
                        RelatedEFormId = updateModel.RelatedEFormId,
                        RelatedEFormName = template.Label,
                    };
                    await itemsList.Update(_dbContext);

                    // update current items
                    var items = await _dbContext.Items
                        .Where(x => x.ItemListId == itemsList.Id)
                        .ToListAsync();

                    foreach (var item in items)
                    {
                        var itemModel = updateModel.Items.FirstOrDefault(x => x.Id == item.Id);
                        if (itemModel != null)
                        {
                            item.Description = itemModel.Description;
                            item.ItemNumber = itemModel.ItemNumber;
                            item.LocationCode = itemModel.LocationCode;
                            item.Name = itemModel.Name;
                            item.UpdatedAt = DateTime.UtcNow;
                            item.UpdatedByUserId = UserId;
                            await item.Update(_dbContext);
                        }
                    }

                    // Remove old
                    var itemModelIds = updateModel.Items.Select(x => x.Id).ToArray();
                    var itemsForRemove = await _dbContext.Items
                        .Where(x => !itemModelIds.Contains(x.Id) && x.ItemListId == itemsList.Id)
                        .ToListAsync();

                    foreach (var itemForRemove in itemsForRemove)
                    {
                        await itemForRemove.Delete(_dbContext);
                    }

                    // Create new
                    foreach (var itemModel in updateModel.Items)
                    {
                        var item = items.FirstOrDefault(x => x.Id == itemModel.Id);
                        if (item == null)
                        {
                            var newItem = new Item()
                            {
                                LocationCode = itemModel.LocationCode,
                                ItemNumber = itemModel.ItemNumber,
                                Description = itemModel.Description,
                                Name = itemModel.Name,
                                Version = 1,
                                WorkflowState = Constants.WorkflowStates.Created,
                                CreatedAt = DateTime.UtcNow,
                                CreatedByUserId = UserId,
                                UpdatedAt = DateTime.UtcNow,
                                Enabled = true,
                                ItemListId = itemsList.Id,
                            };
                            await newItem.Save(_dbContext);
                        }
                    }

                    transaction.Commit();
                    return new OperationResult(
                        true,
                        _itemsPlanningLocalizationService.GetString("ListUpdatedSuccessfully"));
                }
                catch (Exception e)
                {
                    Trace.TraceError(e.Message);
                    transaction.Rollback();
                    return new OperationResult(
                        false,
                        _itemsPlanningLocalizationService.GetString("ErrorWhileUpdatingList"));
                }
            }
        }

        public async Task<OperationResult> DeleteList(int id)
        {
            try
            {
                Debugger.Break();
                var itemsList = new ItemList
                {
                    Id = id
                };
                await itemsList.Delete(_dbContext);

                return new OperationResult(
                    true,
                    _itemsPlanningLocalizationService.GetString("ListDeletedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationResult(
                    false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileRemovingList"));
            }
        }

        public async Task<OperationDataResult<ItemsListPnModel>> GetSingleList(int listId)
        {
            try
            {
                var itemList = await _dbContext.ItemLists
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed && x.Id == listId)
                    .Select(x => new ItemsListPnModel()
                    {
                        Id = x.Id,
                        RepeatUntil = x.RepeatUntil,
                        RepeatEvery = x.RepeatEvery,
                        RepeatType = x.RepeatType,
                        DayOfWeek = x.DayOfWeek,
                        DayOfMonth = x.DayOfMonth,
                        Description = x.Description,
                        Name = x.Name,
                        RelatedEFormId = x.RelatedEFormId,
                        RelatedEFormName = x.RelatedEFormName,
                        Items = x.Items.Select(i => new ItemsListPnItemModel()
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
                        _itemsPlanningLocalizationService.GetString("ListNotFound"));
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
                    _itemsPlanningLocalizationService.GetString("ErrorWhileObtainingList"));
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