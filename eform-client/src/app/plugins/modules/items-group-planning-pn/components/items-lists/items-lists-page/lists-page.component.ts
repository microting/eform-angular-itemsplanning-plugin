import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ItemsListPnModel, ItemsListsPnModel } from '../../../models';
import { ItemsGroupPlanningPnClaims } from '../../../enums';
import { TableHeaderElementModel } from 'src/app/common/models';
import { AuthStateService } from 'src/app/common/store';
import { ItemListStateService } from '../../items-lists/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-items-group-planning-pn-lists-page',
  templateUrl: './lists-page.component.html',
  styleUrls: ['./lists-page.component.scss'],
})
export class ListsPageComponent implements OnInit, OnDestroy {
  @ViewChild('createListModal', { static: false }) createListModal;
  @ViewChild('editListModal', { static: false }) editListModal;
  @ViewChild('deleteListModal', { static: false }) deleteListModal;
  @ViewChild('modalCasesColumns', { static: false }) modalCasesColumnsModal;

  listsModel: ItemsListsPnModel = new ItemsListsPnModel();

  constructor(
    public authStateService: AuthStateService,
    public itemListStateService: ItemListStateService
  ) {}

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idTableHeader', sortable: true },
    { name: 'Name', elementId: 'nameTableHeader', sortable: true },
    {
      name: 'Description',
      elementId: 'descriptionTableHeader',
      sortable: true,
    },
    {
      name: 'RepeatEvery',
      elementId: 'repeatEveryTableHeader',
      sortable: true,
      visibleName: 'Repeat every',
    },
    {
      name: 'RepeatType',
      elementId: 'repeatTypeTableHeader',
      sortable: true,
      visibleName: 'Repeat type',
    },
    {
      name: 'DayOfWeek',
      elementId: 'dayOfWeekTableHeader',
      sortable: true,
      visibleName: 'Day of week',
    },
    {
      name: 'DayOfMonth',
      elementId: 'dayOfMonthTableHeader',
      sortable: true,
      visibleName: 'Day of month',
    },
    {
      name: 'RepeatUntil',
      elementId: 'repeatUntilTableHeader',
      sortable: true,
      visibleName: 'Repeat until',
    },
    { name: 'Actions', elementId: '', sortable: false },
  ];

  get itemsPlanningPnClaims() {
    return ItemsGroupPlanningPnClaims;
  }

  ngOnInit() {
    this.getAllInitialData();
  }

  ngOnDestroy() {}

  getAllInitialData() {
    this.getAllLists();
  }

  getAllLists() {
    this.itemListStateService.getAllLists().subscribe((data) => {
      if (data && data.success) {
        this.listsModel = data.model;
      }
    });
  }

  showDeleteListModal(list: ItemsListPnModel) {
    this.deleteListModal.show(list);
  }

  openEditColumnsModal(templateId: number) {
    this.modalCasesColumnsModal.show(templateId);
  }

  onSortTable(sort: string) {
    this.itemListStateService.onSortTable(sort);
    this.getAllLists();
  }

  changePage(offset: number) {
    this.itemListStateService.changePage(offset);
    this.getAllLists();
  }

  onListDeleted() {
    this.itemListStateService.onDelete();
    this.getAllLists();
  }

  onPageSizeChanged(pageSize: number) {
    this.itemListStateService.updatePageSize(pageSize);
    this.getAllLists();
  }
}
