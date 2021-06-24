import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationDataResult, OperationResult } from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';
import {
  ItemsListPnModel,
  ItemsListsPnModel,
  ItemsListPnUpdateModel,
  ItemsListPnRequestModel,
  ItemsListPnCreateModel,
  ItemsGroupPlanningPnUnitImportModel,
} from '../models/list';

export let ItemsGroupPlanningPnListsMethods = {
  Lists: 'api/items-group-planning-pn/lists',
  Index: 'api/items-group-planning-pn/lists/index',
};
@Injectable({
  providedIn: 'root',
})
export class ItemsGroupPlanningPnListsService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAllLists(
    model: ItemsListPnRequestModel
  ): Observable<OperationDataResult<ItemsListsPnModel>> {
    return this.apiBaseService.post(
      ItemsGroupPlanningPnListsMethods.Index,
      model
    );
  }

  getSingleList(
    listId: number
  ): Observable<OperationDataResult<ItemsListPnModel>> {
    return this.apiBaseService.get(ItemsGroupPlanningPnListsMethods.Lists, {
      id: listId,
    });
  }

  updateList(model: ItemsListPnUpdateModel): Observable<OperationResult> {
    return this.apiBaseService.put(
      ItemsGroupPlanningPnListsMethods.Lists,
      model
    );
  }

  createList(model: ItemsListPnCreateModel): Observable<OperationResult> {
    return this.apiBaseService.post(
      ItemsGroupPlanningPnListsMethods.Lists,
      model
    );
  }

  deleteList(fractionId: number): Observable<OperationResult> {
    return this.apiBaseService.delete(ItemsGroupPlanningPnListsMethods.Lists, {
      id: fractionId,
    });
  }

  importUnit(
    model: ItemsGroupPlanningPnUnitImportModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post(
      ItemsGroupPlanningPnListsMethods.Lists + '/import',
      model
    );
  }
}
