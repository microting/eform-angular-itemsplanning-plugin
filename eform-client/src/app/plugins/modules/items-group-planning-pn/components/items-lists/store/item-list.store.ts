import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import {
  FiltrationStateModel,
  CommonPaginationState,
} from 'src/app/common/models';

export interface ItemListState {
  pagination: CommonPaginationState;
  total: number;
}

function createInitialState(): ItemListState {
  return <ItemListState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
    total: 0,
  };
}

const itemListPersistStorage = persistState({
  include: ['itemList'],
  key: 'itemsGroupPlanningPn',
  preStorageUpdate(storeName, state: ItemListState) {
    return {
      pagination: state.pagination,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'itemList', resettable: true })
export class ItemListStore extends Store<ItemListState> {
  constructor() {
    super(createInitialState());
  }
}

export const itemListPersistProvider = {
  provide: 'persistStorage',
  useValue: itemListPersistStorage,
  multi: true,
};
