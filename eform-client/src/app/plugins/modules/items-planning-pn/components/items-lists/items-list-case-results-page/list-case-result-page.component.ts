import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SharedPnService} from '../../../../shared/services';
import {ItemsPlanningPnCasesService} from '../../../services';
import {PageSettingsModel} from '../../../../../../common/models/settings';
import {ItemListCasesPnRequestModel} from '../../../models/list/item-list-cases-pn-request.model';
import {ItemListPnCaseResultListModel, ItemsListPnCaseResultModel} from '../../../models/list';

@Component({
  selector: 'app-items-planning-pn-list-case-result-page',
  templateUrl: './list-case-result-page.component.html',
  styleUrls: ['./list-case-result-page.component.scss']
})

export class ListCaseResultPageComponent implements OnInit{
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  listCaseRequestModel: ItemListCasesPnRequestModel = new ItemListCasesPnRequestModel();
  casesModel: ItemListPnCaseResultListModel = new ItemListPnCaseResultListModel();
  spinnerStatus = false;
  id: number;

  constructor(private activateRoute: ActivatedRoute,
              private sharedPnService: SharedPnService,
              private itemsPlanningPnCasesService: ItemsPlanningPnCasesService) {
    const activatedRouteSub = this.activateRoute.params.subscribe(params => {
      this.id = +params['id'];
    });
  }

  ngOnInit(): void {
    this.getAllInitialData();
  }


  getAllInitialData() {
    this.getAllCases();
  }

  getAllCases() {
    this.spinnerStatus = true;
    this.listCaseRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.listCaseRequestModel.sort = this.localPageSettings.sort;
    this.listCaseRequestModel.pageSize = this.localPageSettings.pageSize;
    this.listCaseRequestModel.listId = this.id;
    this.itemsPlanningPnCasesService.getAllCaseResults(this.listCaseRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.casesModel = data.model;
      } this.spinnerStatus = false;
    });
  }

  sortTable(sort: string) {
    // if (this.localPageSettings.sort === sort) {
    //   this.localPageSettings.isSortDsc = !this.localPageSettings.isSortDsc;
    // } else {
    //   this.localPageSettings.isSortDsc = false;
    //   this.localPageSettings.sort = sort;
    // }
    // this.updateLocalPageSettings();
  }
}
