import {
  ItemsListCasePnModel,
  ItemsListPnItemCaseModel,
} from '../../../../models';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableHeaderElementModel } from 'src/app/common/models';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { ItemsListCasesStateService } from '../store';

@AutoUnsubscribe()
@Component({
  selector: 'app-items-group-planning-pn-list-case-page',
  templateUrl: './list-case-page.component.html',
  styleUrls: ['./list-case-page.component.scss'],
})
export class ListCasePageComponent implements OnInit, OnDestroy {
  @ViewChild('uploadedDataModal', { static: false }) uploadedDataModal;
  casesModel: ItemsListCasePnModel = new ItemsListCasePnModel();

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idTableHeader', sortable: true },
    {
      name: 'CreatedAt',
      elementId: 'dateTableHeader',
      sortable: true,
      visibleName: 'Date',
    },
    {
      name: 'ItemNumber',
      elementId: 'numberTableHeader',
      sortable: true,
      visibleName: 'Number',
    },
    {
      name: 'BuildYear',
      elementId: 'buildYearTableHeader',
      sortable: true,
      visibleName: 'Build Year',
    },
    {
      name: 'Description',
      elementId: 'descriptionTableHeader',
      sortable: true,
    },
    { name: 'Type', elementId: 'typeTableHeader', sortable: true },
    {
      name: 'Location',
      elementId: 'locationTypeTableHeader',
      sortable: true,
    },
    {
      name: 'FieldStatus',
      elementId: 'statusTypeTableHeader',
      sortable: true,
      visibleName: 'Status',
    },
    {
      name: 'Comment',
      elementId: 'commentTypeTableHeader',
      sortable: true,
    },
    {
      name: 'NumberOfImages',
      elementId: 'numberOfPicturesTableHeader',
      sortable: true,
      visibleName: 'Number of pictures',
    },
    {
      name: 'PDF',
      elementId: 'pdfTableHeader',
      sortable: false,
    },
    { name: 'Actions', elementId: '', sortable: false },
  ];

  activatedRouteSub$: Subscription;
  getAllCasesSub$: Subscription;

  constructor(
    private activateRoute: ActivatedRoute,
    public itemsListCasesStateService: ItemsListCasesStateService
  ) {
    this.activatedRouteSub$ = this.activateRoute.params.subscribe((params) => {
      itemsListCasesStateService.setListId(+params['id']);
    });
  }

  ngOnInit(): void {
    this.getAllInitialData();
  }

  ngOnDestroy(): void {}

  getAllInitialData() {
    this.getAllCases();
  }

  showListCasePdfModal(itemCase: ItemsListPnItemCaseModel) {
    this.uploadedDataModal.show(itemCase);
  }

  getAllCases() {
    this.getAllCasesSub$ = this.itemsListCasesStateService
      .getAllCases()
      .subscribe((data) => {
        if (data && data.success) {
          this.casesModel = data.model;
        }
      });
  }

  sortTable(sort: string) {
    this.itemsListCasesStateService.onSortTable(sort);
    this.getAllCases();
  }

  changePage(offset: number) {
    this.itemsListCasesStateService.changePage(offset);
    this.getAllCases();
  }

  onPageSizeChanged(pageSize: number) {
    this.itemsListCasesStateService.updatePageSize(pageSize);
    this.getAllCases();
  }
}
