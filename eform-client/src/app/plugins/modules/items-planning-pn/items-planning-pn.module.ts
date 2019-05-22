import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedPnModule} from '../shared/shared-pn.module';
import {MDBBootstrapModule} from '../../../../../port/angular-bootstrap-md';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {EformSharedModule} from '../../../common/modules/eform-shared/eform-shared.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ItemsPlanningPnLayoutComponent} from './layouts/items-planning-pn-layout.component';
import {ItemsListCreateComponent, ListDeleteComponent, ListEditComponent, ListsPageComponent} from './components/items-lists';
import {ItemsPlanningSettingsComponent} from './components/items-plannings-setting';
import {RouterModule} from '@angular/router';
import {ItemsPlanningPnRouting} from './items-planning-pn.routing.module';
import {ItemsPlanningPnListsService, ItemsPlanningPnSettingsService} from './services';
import {OwlDateTimeModule} from 'ng-pick-datetime';
import {OwlMomentDateTimeModule} from 'ng-pick-datetime-moment';

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
    OwlMomentDateTimeModule
  ],
  declarations: [
    ItemsPlanningPnLayoutComponent,
    ListsPageComponent,
    ItemsListCreateComponent,
    ListEditComponent,
    ListDeleteComponent,
    ItemsPlanningSettingsComponent
  ],
  providers: [
    ItemsPlanningPnSettingsService,
    ItemsPlanningPnListsService
  ]
})

export class ItemsPlanningPnModule { }
