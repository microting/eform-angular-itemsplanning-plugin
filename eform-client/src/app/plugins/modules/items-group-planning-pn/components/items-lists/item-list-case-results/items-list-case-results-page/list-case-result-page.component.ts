import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TableHeaderElementModel, TemplateDto } from 'src/app/common/models';
import {
  ItemListCasesPnRequestModel,
  ItemListPnCaseResultListModel,
  ItemsListPnCaseResultModel,
  ReportPnGenerateModel,
} from '../../../../models';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EFormService } from 'src/app/common/services';
import { SharedPnService } from 'src/app/plugins/modules/shared/services';
import { ItemsGroupPlanningPnCasesService } from '../../../../services';
import { format } from 'date-fns';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import {
  ItemListCaseResultsQuery,
  ItemListCaseResultsStateService,
} from 'src/app/plugins/modules/items-group-planning-pn/components/items-lists/item-list-case-results/store';

@AutoUnsubscribe()
@Component({
  selector: 'app-items-group-planning-pn-list-case-result-page',
  templateUrl: './list-case-result-page.component.html',
  styleUrls: ['./list-case-result-page.component.scss'],
})
export class ListCaseResultPageComponent implements OnInit, OnDestroy {
  @ViewChild('uploadedDataModal', { static: false }) uploadedDataModal;
  @Output()
  generateReport: EventEmitter<ReportPnGenerateModel> = new EventEmitter();
  @Output()
  saveReport: EventEmitter<ReportPnGenerateModel> = new EventEmitter();
  generateForm: FormGroup;
  currentTemplate: TemplateDto = new TemplateDto();
  listCaseRequestModel: ItemListCasesPnRequestModel = new ItemListCasesPnRequestModel();
  casesModel: ItemListPnCaseResultListModel = new ItemListPnCaseResultListModel();

  activatedRouteSub$: Subscription;
  getGeneratedReportSub$: Subscription;
  getAllCaseResultsSub$: Subscription;
  eFormServiceGetSingleSub$: Subscription;

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', sortable: true },
    { name: 'Actions', elementId: '', sortable: false },
  ];

  constructor(
    private activateRoute: ActivatedRoute,
    private sharedPnService: SharedPnService,
    private formBuilder: FormBuilder,
    private eFormService: EFormService,
    private itemsGroupPlanningPnCasesService: ItemsGroupPlanningPnCasesService,
    private toastrService: ToastrService,
    public itemListCaseResultsStateService: ItemListCaseResultsStateService,
    private itemListCaseResultsQuery: ItemListCaseResultsQuery
  ) {
    this.activatedRouteSub$ = this.activateRoute.params.subscribe((params) => {
      this.itemListCaseResultsStateService.updateListId(+params['id']);
    });
  }

  ngOnDestroy() {}

  ngOnInit(): void {
    this.generateForm = this.formBuilder.group({
      dateRange: [
        [
          this.itemListCaseResultsQuery.pageSetting.filters.dateFrom,
          this.itemListCaseResultsQuery.pageSetting.filters.dateTo,
        ],
        Validators.required,
      ],
    });

    this.getAllCases();
  }

  onGenerateReport() {
    this.itemListCaseResultsStateService.changePage(0);
    this.itemListCaseResultsStateService.updateDateFrom(
      format(this.generateForm.value.dateRange[0], 'yyyy-MM-dd')
    );
    this.itemListCaseResultsStateService.updateDateTo(
      format(this.generateForm.value.dateRange[1], 'yyyy-MM-dd')
    );

    this.getAllCases();
  }

  onSaveReport() {
    this.getGeneratedReportSub$ = this.itemListCaseResultsStateService
      .getGeneratedReport()
      .subscribe(
        (data) => {
          saveAs(
            data,
            `${this.itemListCaseResultsQuery.pageSetting.filters.dateFrom}_${this.itemListCaseResultsQuery.pageSetting.filters.dateTo}_report.xlsx`
          );
        },
        (_) => {
          this.toastrService.error();
        }
      );
  }

  getReportingSettings(eformId: number) {
    this.eFormServiceGetSingleSub$ = this.eFormService
      .getSingle(eformId)
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.currentTemplate = operation.model;
        }
      });
  }

  getAllCases() {
    this.getAllCaseResultsSub$ = this.itemListCaseResultsStateService
      .getAllCaseResults()
      .subscribe((data) => {
        if (data && data.success) {
          this.casesModel = data.model;
          this.setHeaders();
        }
        this.getReportingSettings(this.casesModel.sdkeFormId);
      });
  }

  sortTable(sort: string) {
    this.itemListCaseResultsStateService.onSortTable(sort);
    this.getAllCases();
  }

  changePage(offset: number) {
    this.itemListCaseResultsStateService.changePage(offset);
    this.getAllCases();
  }

  changePageSize(pageSize: number) {
    this.itemListCaseResultsStateService.updatePageSize(pageSize);
    this.getAllCases();
  }

  showListCasePdfModal(itemCase: ItemsListPnCaseResultModel) {
    this.uploadedDataModal.show(itemCase);
  }

  downloadFile(itemCase: ItemsListPnCaseResultModel, fileType: string) {
    window.open(
      '/api/items-group-planning-pn/list-case-file-report/' +
        itemCase.id +
        '?token=' +
        itemCase.token +
        '&fileType=' +
        fileType,
      '_blank'
    );
  }

  private setHeaders() {
    this.tableHeaders = [
      { name: 'Id', sortable: true },
      this.casesModel.deployedAtEnabled
        ? {
            name: 'CreatedAt',
            elementId: 'dateTableHeader',
            sortable: true,
            visibleName: 'Date of deployment',
          }
        : null,
      this.casesModel.doneAtEnabled
        ? {
            name: 'MicrotingSdkCaseDoneAt',
            elementId: 'doneAtTableHeader',
            sortable: true,
            visibleName: 'Date of doing',
          }
        : null,
      this.casesModel.doneByUserNameEnabled
        ? {
            name: 'DoneByUserName',
            elementId: 'doneByUserNameTableHeader',
            sortable: true,
            visibleName: 'Done by',
          }
        : null,
      this.casesModel.labelEnabled
        ? {
            name: 'Name',
            elementId: 'labelTableHeader',
            sortable: true,
          }
        : null,
      this.casesModel.descriptionEnabled
        ? {
            name: 'Description',
            elementId: 'descriptionTableHeader',
            sortable: true,
          }
        : null,
      this.casesModel.itemNumberEnabled
        ? {
            name: 'ItemNumber',
            elementId: 'itemNumberTableHeader',
            sortable: true,
            visibleName: 'Item number',
          }
        : null,
      this.casesModel.locationCodeEnabled
        ? {
            name: 'LocationCode',
            elementId: 'locationCodeTableHeader',
            sortable: true,
            visibleName: 'Location code',
          }
        : null,
      this.casesModel.buildYearEnabled
        ? {
            name: 'BuildYear',
            elementId: 'buildYearTableHeader',
            sortable: true,
            visibleName: 'Build year',
          }
        : null,
      this.casesModel.typeEnabled
        ? {
            name: 'Type',
            elementId: 'typeTableHeader',
            sortable: true,
          }
        : null,
      this.casesModel.fieldEnabled1
        ? {
            name: 'SdkFieldValue1',
            elementId: 'field1TableHeader',
            sortable: false,
            visibleName: this.casesModel.fieldName1,
          }
        : null,
      this.casesModel.fieldEnabled2
        ? {
            name: 'SdkFieldValue2',
            elementId: 'field2TableHeader',
            sortable: false,
            visibleName: this.casesModel.fieldName1,
          }
        : null,
      this.casesModel.fieldEnabled3
        ? {
            name: 'SdkFieldValue3',
            elementId: 'field3TableHeader',
            sortable: false,
            visibleName: this.casesModel.fieldName3,
          }
        : null,
      this.casesModel.fieldEnabled4
        ? {
            name: 'SdkFieldValue4',
            elementId: 'field4TableHeader',
            sortable: false,
            visibleName: this.casesModel.fieldName4,
          }
        : null,
      this.casesModel.fieldEnabled5
        ? {
            name: 'SdkFieldValue5',
            elementId: 'field5TableHeader',
            sortable: false,
            visibleName: this.casesModel.fieldName5,
          }
        : null,
      this.casesModel.fieldEnabled6
        ? {
            name: 'SdkFieldValue6',
            elementId: 'field6TableHeader',
            sortable: false,
            visibleName: this.casesModel.fieldName6,
          }
        : null,
      this.casesModel.fieldEnabled7
        ? {
            name: 'SdkFieldValue7',
            elementId: 'field7TableHeader',
            sortable: false,
            visibleName: this.casesModel.fieldName7,
          }
        : null,
      this.casesModel.fieldEnabled8
        ? {
            name: 'SdkFieldValue8',
            elementId: 'field8TableHeader',
            sortable: false,
            visibleName: this.casesModel.fieldName8,
          }
        : null,
      this.casesModel.fieldEnabled9
        ? {
            name: 'SdkFieldValue9',
            elementId: 'field9TableHeader',
            sortable: false,
            visibleName: this.casesModel.fieldName9,
          }
        : null,
      this.casesModel.fieldEnabled10
        ? {
            name: 'SdkFieldValue10',
            elementId: 'field10TableHeader',
            sortable: false,
            visibleName: this.casesModel.fieldName10,
          }
        : null,
      this.casesModel.numberOfImagesEnabled
        ? {
            name: 'NumberOfImages',
            elementId: 'numberOfImagesTableHeader',
            sortable: false,
            visibleName: 'Number of images',
          }
        : null,
      { name: 'Actions', elementId: '', sortable: false },
    ];
  }
}
