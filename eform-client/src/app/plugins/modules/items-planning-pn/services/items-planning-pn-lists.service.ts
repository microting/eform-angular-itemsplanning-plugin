import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

import { Observable} from 'rxjs';
import {Router} from '@angular/router';
import {OperationDataResult, OperationResult} from 'src/app/common/models/operation.models';
import {BaseService} from 'src/app/common/services/base.service';

import {ListPnModel,
        ListsPnModel,
        ListPnUpdateModel,
        ListPnRequestModel} from '../models/list';

export let ItemsPlanningPnListsMethods = {
  Lists: 'api/items-planning-pn/lists',
};
@Injectable({
  providedIn: 'root'
})
export class ItemsPlanningPnListsService extends BaseService {

  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllLists(model: ListPnRequestModel): Observable<OperationDataResult<ListsPnModel>> {
    return this.get(ItemsPlanningPnListsMethods.Lists, model);
  }

  getSingleList(fractionId: number): Observable<OperationDataResult<ListPnModel>> {
    return this.get(ItemsPlanningPnListsMethods.Lists + '/' + fractionId);
  }

  updateList(model: ListPnUpdateModel): Observable<OperationResult> {
    return this.put(ItemsPlanningPnListsMethods.Lists, model);
  }

  createList(model: ListPnModel): Observable<OperationResult> {
    return this.post(ItemsPlanningPnListsMethods.Lists, model);
  }

  deleteList(fractionId: number): Observable<OperationResult> {
    return this.delete(ItemsPlanningPnListsMethods.Lists + '/' + fractionId);
  }
}
