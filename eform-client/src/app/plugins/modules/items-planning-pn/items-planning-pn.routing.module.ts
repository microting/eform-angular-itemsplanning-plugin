import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminGuard, AuthGuard} from 'src/app/common/guards';
import {ItemsPlanningPnLayoutComponent} from './layouts';
import {
  ListsPageComponent,
  ItemsPlanningSettingsComponent,
  ReportGeneratorContainerComponent,
  ListCasePageComponent, ListCaseResultPageComponent
} from './components';

export const routes: Routes = [
  {
    path: '',
    component: ItemsPlanningPnLayoutComponent,
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
        path: 'item-case-results/:id',
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsPlanningPnRouting { }
