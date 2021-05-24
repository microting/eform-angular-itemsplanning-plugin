import { Observable } from 'rxjs';
import { OperationDataResult } from 'src/app/common/models';
import {
  ItemListPnCaseResultListModel,
  ItemsListCasePnModel,
  ItemsListPnItemCaseModel,
  ItemListCasesPnRequestModel,
} from '../models';
import { Injectable } from '@angular/core';
import { ApiBaseService } from 'src/app/common/services';

export let ItemsGroupPlanningPnCasesMethods = {
  Cases: 'api/items-group-planning-pn/list-cases',
  CaseResults: 'api/items-group-planning-pn/list-case-results',
};
@Injectable({
  providedIn: 'root',
})
export class ItemsGroupPlanningPnCasesService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAllCases(
    model: ItemListCasesPnRequestModel
  ): Observable<OperationDataResult<ItemsListCasePnModel>> {
    return this.apiBaseService.post(
      ItemsGroupPlanningPnCasesMethods.Cases,
      model
    );
  }

  getAllCaseResults(
    model: ItemListCasesPnRequestModel
  ): Observable<OperationDataResult<ItemListPnCaseResultListModel>> {
    return this.apiBaseService.post<
      OperationDataResult<ItemListPnCaseResultListModel>
    >(ItemsGroupPlanningPnCasesMethods.CaseResults, model);
  }

  getSingleCase(
    caseId: number
  ): Observable<OperationDataResult<ItemsListPnItemCaseModel>> {
    return this.apiBaseService.get(ItemsGroupPlanningPnCasesMethods.Cases, {
      caseId: caseId,
    });
  }

  getGeneratedReport(model: ItemListCasesPnRequestModel): Observable<any> {
    return this.apiBaseService.getBlobData(
      ItemsGroupPlanningPnCasesMethods.CaseResults + '/excel',
      model
    );
  }
}
