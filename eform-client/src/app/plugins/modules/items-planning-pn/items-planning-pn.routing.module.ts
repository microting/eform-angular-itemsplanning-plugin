import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminGuard, AuthGuard, PermissionGuard} from 'src/app/common/guards';
import {ItemsPlanningPnLayoutComponent} from './layouts';
import {
  ListsPageComponent,
  ItemsPlanningSettingsComponent,
  ReportGeneratorContainerComponent,
  ListCasePageComponent,
  ListCaseResultPageComponent,
  ItemCaseUploadedDataComponent,
  ItemsPlanningPnUnitImportComponent
} from './components';
import {ItemsPlanningPnClaims} from './enums';

export const routes: Routes = [
  {
    path: '',
    component: ItemsPlanningPnLayoutComponent,
    canActivate: [PermissionGuard],
    data: {requiredPermission: ItemsPlanningPnClaims.accessItemsPlanningPlugin},
    children: [
      {
        path: 'lists',
        canActivate: [AuthGuard],
        component: ListsPageComponent
      },
      {
        path: 'item-cases/:id',
        canActivate: [AuthGuard],
        component: ListCasePageComponent
      },
      {
        path: 'item-itemCase-results/:id',
        canActivate: [AuthGuard],
        component: ListCaseResultPageComponent
      },
      {
        path: 'settings',
        canActivate: [AdminGuard],
        component: ItemsPlanningSettingsComponent
      },
      {
        path: 'reports',
        canActivate: [AdminGuard],
        component: ReportGeneratorContainerComponent
      },
      {
        path: 'item-cases/:id/:id',
        canActivate: [AdminGuard],
        component: ItemCaseUploadedDataComponent
      },
      {
        path: 'import',
        canActivate: [AdminGuard],
        component: ItemsPlanningPnUnitImportComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsPlanningPnRouting { }
