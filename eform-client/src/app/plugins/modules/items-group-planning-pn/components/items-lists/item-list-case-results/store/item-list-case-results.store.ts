import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import {
  FiltrationStateModel,
  CommonPaginationState,
} from 'src/app/common/models';

export interface ItemListCaseResultState {
  pagination: CommonPaginationState;
  filters: ItemListCaseResultFiltrationState;
  total: number;
}

export class ItemListCaseResultFiltrationState {
  listId: number;
  dateFrom: string;
  dateTo: string;
}

function createInitialState(): ItemListCaseResultState {
  return <ItemListCaseResultState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
    filters: {
      listId: 0,
      dateFrom: '',
      dateTo: '',
    },
    total: 0,
  };
}

const itemListCaseResultPersistStorage = persistState({
  include: ['itemListCaseResult'],
  key: 'itemsGroupPlanningPn',
  preStorageUpdate(storeName, state: ItemListCaseResultState) {
    return {
      pagination: state.pagination,
      filters: state.filters,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'itemListCaseResult', resettable: true })
export class ItemListCaseResultsStore extends Store<ItemListCaseResultState> {
  constructor() {
    super(createInitialState());
  }
}

export const itemListCaseResultPersistProvider = {
  provide: 'persistStorage',
  useValue: itemListCaseResultPersistStorage,
  multi: true,
};
