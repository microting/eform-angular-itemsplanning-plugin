import {Component, OnInit, ViewChild} from '@angular/core';
import {PageSettingsModel} from 'src/app/common/models/settings';

import {SharedPnService} from 'src/app/plugins/modules/shared/services';
import {ListPnModel, ListPnRequestModel, ListsPnModel} from '../../../models/list';
import {ItemsPlanningPnListsService} from '../../../services';

@Component({
  selector: 'app-items-planning-pn-lists-page',
  templateUrl: './lists-page.component.html',
  styleUrls: ['./lists-page.component.scss']
})
export class ListsPageComponent implements OnInit {
  @ViewChild('createListModal') createListModal;
  @ViewChild('editListModal') editListModal;
  @ViewChild('deleteListModal') deleteListModal;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  listsModel: ListsPnModel = new ListsPnModel();
  listRequestModel: ListPnRequestModel = new ListPnRequestModel();
  spinnerStatus = false;

  constructor(private sharedPnService: SharedPnService,
              private itemsPlanningPnListsService: ItemsPlanningPnListsService) { }

  ngOnInit() {
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.sharedPnService.getLocalPageSettings
    ('itemsPlanningsPnSettings', 'ItemLists').settings;
    this.getAllInitialData();
  }

  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings
    ('itemsPlanningsPnSettings', this.localPageSettings, 'ItemLists');
    this.getAllLists();
  }

  getAllInitialData() {
    this.getAllLists();
  }

  getAllLists() {
    this.spinnerStatus = true;
    this.listRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.listRequestModel.sort = this.localPageSettings.sort;
    this.listRequestModel.pageSize = this.localPageSettings.pageSize;
    this.itemsPlanningPnListsService.getAllLists(this.listRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.listsModel = data.model;
      } this.spinnerStatus = false;
    });
  }
  showEditListModal(list: ListPnModel) {
    this.editListModal.show(list);
  }

  showDeleteListModal(list: ListPnModel) {
    this.deleteListModal.show(list);
  }

  showCreateListModal() {
    this.createListModal.show();
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
      this.getAllLists();
    }
  }
}
