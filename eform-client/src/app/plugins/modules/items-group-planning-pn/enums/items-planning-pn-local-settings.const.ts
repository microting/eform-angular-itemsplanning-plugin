import {
  ApplicationPageModel,
  PageSettingsModel
} from 'src/app/common/models/settings';
import {ItemListResultsPageModel, ItemListResultsSettingsModel} from '../models/list';
import {ItemListCasesPnRequestModel} from '../models/list/item-list-cases-pn-request.model';

export const ItemsGroupPlanningPnLocalSettings = [
  new ApplicationPageModel({
      name: 'ItemGroupLists',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false
      })
    },
  ),
  new ApplicationPageModel({
      name: 'ItemGroupListCases',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false
      })
    },
  ),
  new ItemListResultsPageModel({
      name: 'ItemGroupCaseResults',
      settings: {
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false,
        pageIndex: 1,
        offset: 0,
        listId: 0,
        dateFrom: '',
        dateTo: ''
      }
    },
  )
];

