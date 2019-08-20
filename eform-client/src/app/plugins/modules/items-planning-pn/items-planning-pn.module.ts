import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPnModule} from '../shared/shared-pn.module';
import {MDBBootstrapModule} from '../../../../../port/angular-bootstrap-md';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {EformSharedModule} from '../../../common/modules/eform-shared/eform-shared.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ItemsPlanningPnLayoutComponent} from './layouts';
import {
  ItemListCaseColumnsModalComponent,
  ItemsListCreateComponent,
  ListCasePageComponent,
  ListCaseResultPageComponent,
  ListDeleteComponent,
  ListEditComponent,
  ListsPageComponent,
  ItemCaseUploadedDataComponent, UploadedDataPdfComponent
} from './components/items-lists';
import {ItemsPlanningSettingsComponent} from './components/items-plannings-setting';
import {RouterModule} from '@angular/router';
import {ItemsPlanningPnRouting} from './items-planning-pn.routing.module';
import {ItemsPlanningPnListsService,
  ItemsPlanningPnSettingsService,
  ItemsPlanningPnReportsService,
  ItemsPlanningPnCasesService} from './services';
import {OwlDateTimeModule} from 'ng-pick-datetime';
import {OwlMomentDateTimeModule} from 'ng-pick-datetime-moment';
import {
  ReportGeneratorContainerComponent,
  ReportGeneratorFormComponent,
  ReportPreviewTableComponent
} from './components/reports';
import {FileUploadModule} from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    SharedPnModule,
    MDBBootstrapModule,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    EformSharedModule,
    FontAwesomeModule,
    RouterModule,
    ItemsPlanningPnRouting,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    ReactiveFormsModule,
    FileUploadModule
  ],
  declarations: [
    ItemsPlanningPnLayoutComponent,
    ItemListCaseColumnsModalComponent,
    ListsPageComponent,
    ListCaseResultPageComponent,
    ItemsListCreateComponent,
    ListCasePageComponent,
    ListEditComponent,
    ListDeleteComponent,
    ItemsPlanningSettingsComponent,
    ReportGeneratorContainerComponent,
    ReportGeneratorFormComponent,
    ReportPreviewTableComponent,
    ItemCaseUploadedDataComponent,
    UploadedDataPdfComponent
  ],
  providers: [
    ItemsPlanningPnSettingsService,
    ItemsPlanningPnListsService,
    ItemsPlanningPnReportsService,
    ItemsPlanningPnCasesService
  ]
})

export class ItemsPlanningPnModule { }
