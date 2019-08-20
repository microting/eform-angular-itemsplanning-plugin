import {
  ApplicationPageModel,
  PageSettingsModel
} from 'src/app/common/models/settings';

export const ItemsPlanningPnLocalSettings = [
  new ApplicationPageModel({
      name: 'ItemLists',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false
      })
    },
  ),
  new ApplicationPageModel({
      name: 'ItemListCases',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false
      })
    },
  ),
  new ApplicationPageModel({
      name: 'ItemCaseResults',
      settings: new PageSettingsModel({
        pageSize: 10,
        sort: 'Id',
        isSortDsc: false
      })
    },
  )
];

