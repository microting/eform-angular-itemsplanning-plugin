import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ItemListCaseResultState, ItemListCaseResultsStore } from './';
import { PaginationModel, SortModel } from 'src/app/common/models';

@Injectable({ providedIn: 'root' })
export class ItemListCaseResultsQuery extends Query<ItemListCaseResultState> {
  constructor(protected store: ItemListCaseResultsStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectPageSize$ = this.select((state) => state.pagination.pageSize);
  selectPagination$ = this.select(
    (state) =>
      new PaginationModel(
        state.total,
        state.pagination.pageSize,
        state.pagination.offset
      )
  );
  selectSort$ = this.select(
    (state) => new SortModel(state.pagination.sort, state.pagination.isSortDsc)
  );
}
