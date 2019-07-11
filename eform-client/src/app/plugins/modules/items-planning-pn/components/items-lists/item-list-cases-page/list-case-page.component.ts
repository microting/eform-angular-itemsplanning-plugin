import {Component, OnInit} from '@angular/core';
import {SharedPnService} from '../../../../shared/services';
import {ActivatedRoute} from '@angular/router';
import {PageSettingsModel} from '../../../../../../common/models/settings';
import {ItemsListPnRequestModel} from '../../../models/list';
import {ItemsListCasePnModel} from '../../../models/list/items-list-case-pn.model';
import {ItemsPlanningPnCasesService} from '../../../services/items-planning-pn-cases.service';

@Component({
  selector: 'app-items-planning-pn-list-case-page',
  templateUrl: './list-case-page.component.html',
  styleUrls: ['./list-case-page.component.scss']
})

export class ListCasePageComponent implements OnInit {
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  listRequestModel: ItemsListPnRequestModel = new ItemsListPnRequestModel();
  casesModel: ItemsListCasePnModel = new ItemsListCasePnModel();
  spinnerStatus = false;

  constructor(private sharedPnService: SharedPnService, private itemsPlanningPnCasesService: ItemsPlanningPnCasesService) { }

  ngOnInit(): void {
  }

  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings
    ('itemsPlanningPnSettings', this.localPageSettings, 'ItemLists');
    this.getAllCases();
  }

  getAllCases() {
    this.spinnerStatus = true;
    this.listRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.listRequestModel.sort = this.localPageSettings.sort;
    this.listRequestModel.pageSize = this.localPageSettings.pageSize;
    this.itemsPlanningPnCasesService.getAllCases(1).subscribe((data) => {
      if (data && data.success) {
        this.casesModel = data.model;
      } this.spinnerStatus = false;
    });
  }

  sortTable(sort: string) {
    if (this.localPageSettings.sort === sort) {
      this.localPageSettings.isSortDsc = !this.localPageSettings.isSortDsc;
    } else {
      this.localPageSettings.isSortDsc = false;
      this.localPageSettings.sort = sort;
    }
    this.updateLocalPageSettings();
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.listRequestModel.offset = e;
      if (e === 0) {
        this.listRequestModel.pageIndex = 0;
      } else {
        this.listRequestModel.pageIndex
          = Math.floor(e / this.listRequestModel.pageSize);
      }
      this.getAllCases();
    }
  }
}
