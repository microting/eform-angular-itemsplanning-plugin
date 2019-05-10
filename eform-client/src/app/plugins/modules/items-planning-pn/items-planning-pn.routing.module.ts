import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminGuard, AuthGuard} from 'src/app/common/guards';
import {ItemsPlanningPnLayoutComponent} from './layouts';
import {ItemsPlanningSettingsComponent} from './components/items-plannings-setting';
import {ListsPageComponent} from './components/items-lists';

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
        path: 'settings',
        canActivate: [AdminGuard],
        component: ItemsPlanningSettingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsPlanningPnRouting { }
