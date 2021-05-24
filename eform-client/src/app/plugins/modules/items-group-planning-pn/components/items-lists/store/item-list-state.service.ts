import { Injectable } from '@angular/core';
import { ItemListStore, ItemListQuery } from './';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  PaginationModel,
  SortModel,
} from 'src/app/common/models';
import { updateTableSort, getOffset } from 'src/app/common/helpers';
import { map } from 'rxjs/operators';
import { ItemsGroupPlanningPnListsService } from '../../../services';
import { ItemsListsPnModel } from '../../../models';

@Injectable({ providedIn: 'root' })
export class ItemListStateService {
  constructor(
    private store: ItemListStore,
    private service: ItemsGroupPlanningPnListsService,
    private query: ItemListQuery
  ) {}

  getPageSize(): Observable<number> {
    return this.query.selectPageSize$;
  }

  getSort(): Observable<SortModel> {
    return this.query.selectSort$;
  }

  getAllLists(): Observable<OperationDataResult<ItemsListsPnModel>> {
    return this.service
      .getAllLists({
        ...this.query.pageSetting.pagination,
      })
      .pipe(
        map((response) => {
          if (response && response.success && response.model) {
            this.store.update(() => ({
              total: response.model.total,
            }));
          }
          return response;
        })
      );
  }

  // updateNameFilter(nameFilter: string) {
  //   this.store.update((state) => ({
  //     filters: {
  //       ...state.filters,
  //       nameFilter: nameFilter,
  //     },
  //     pagination: {
  //       ...state.pagination,
  //       offset: 0,
  //     },
  //   }));
  // }

  updatePageSize(pageSize: number) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        pageSize: pageSize,
      },
    }));
    this.checkOffset();
  }

  changePage(offset: number) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        offset: offset,
      },
    }));
  }

  onDelete() {
    this.store.update((state) => ({
      total: state.total - 1,
    }));
    this.checkOffset();
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.query.pageSetting.pagination.sort,
      this.query.pageSetting.pagination.isSortDsc
    );
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        isSortDsc: localPageSettings.isSortDsc,
        sort: localPageSettings.sort,
      },
    }));
  }

  checkOffset() {
    const newOffset = getOffset(
      this.query.pageSetting.pagination.pageSize,
      this.query.pageSetting.pagination.offset,
      this.query.pageSetting.total
    );
    if (newOffset !== this.query.pageSetting.pagination.offset) {
      this.store.update((state) => ({
        pagination: {
          ...state.pagination,
          offset: newOffset,
        },
      }));
    }
  }

  getPagination(): Observable<PaginationModel> {
    return this.query.selectPagination$;
  }
}
