import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationDataResult} from '../../../../common/models';
import {ItemsListPnModel} from '../models/list';
import {ItemsPlanningPnListsMethods} from './items-planning-pn-lists.service';
import {ItemsListCasePnModel} from '../models/list/items-list-case-pn.model';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';

export let ItemsPlanningPnCasesMethods = {
  Cases: 'api/items-planning-pn/list-cases',
};
@Injectable({
  providedIn: 'root'
})

export class ItemsPlanningPnCasesService extends BaseService {

  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllCases(listId: number): Observable<OperationDataResult<ItemsListCasePnModel>> {
    return this.get(ItemsPlanningPnCasesMethods.Cases + '/' + listId);
  }

}
