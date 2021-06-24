import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationDataResult, OperationResult } from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';
import { ItemsGroupPlanningBaseSettingsModel } from '../models';

export let ItemsGroupPlanningSettingsMethods = {
  ItemsGroupPlanningSettings: 'api/items-group-planning-pn/settings',
};

@Injectable()
export class ItemsGroupPlanningPnSettingsService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAllSettings(): Observable<
    OperationDataResult<ItemsGroupPlanningBaseSettingsModel>
  > {
    return this.apiBaseService.get(
      ItemsGroupPlanningSettingsMethods.ItemsGroupPlanningSettings
    );
  }

  updateSettings(
    model: ItemsGroupPlanningBaseSettingsModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post(
      ItemsGroupPlanningSettingsMethods.ItemsGroupPlanningSettings,
      model
    );
  }
}
