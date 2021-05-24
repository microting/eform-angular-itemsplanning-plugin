import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models';

export interface ItemsListCasesState {
  pagination: CommonPaginationState;
  total: number;
}

function createInitialState(): ItemsListCasesState {
  return <ItemsListCasesState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
    total: 0,
  };
}

const itemsListCasesPersistStorage = persistState({
  include: ['itemsListCases'],
  key: 'itemsGroupPlanningPn',
  preStorageUpdate(storeName, state: ItemsListCasesState) {
    return {
      pagination: state.pagination,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'itemsListCases', resettable: true })
export class ItemsListCasesStore extends Store<ItemsListCasesState> {
  constructor() {
    super(createInitialState());
  }
}

export const itemsListCasesPersistProvider = {
  provide: 'persistStorage',
  useValue: itemsListCasesPersistStorage,
  multi: true,
};
