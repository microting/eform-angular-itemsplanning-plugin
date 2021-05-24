import { Injectable } from '@angular/core';
import { ItemListCaseResultsStore, ItemListCaseResultsQuery } from './';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  PaginationModel,
  SortModel,
} from 'src/app/common/models';
import { updateTableSort } from 'src/app/common/helpers';
import { getOffset } from 'src/app/common/helpers/pagination.helper';
import { map } from 'rxjs/operators';
import { ItemListPnCaseResultListModel } from '../../../../models';
import { ItemsGroupPlanningPnCasesService } from '../../../../services';

@Injectable({ providedIn: 'root' })
export class ItemListCaseResultsStateService {
  constructor(
    private store: ItemListCaseResultsStore,
    private service: ItemsGroupPlanningPnCasesService,
    private query: ItemListCaseResultsQuery
  ) {}

  getPageSize(): Observable<number> {
    return this.query.selectPageSize$;
  }

  getSort(): Observable<SortModel> {
    return this.query.selectSort$;
  }

  getAllCaseResults(): Observable<
    OperationDataResult<ItemListPnCaseResultListModel>
  > {
    return this.service
      .getAllCaseResults({
        ...this.query.pageSetting.pagination,
        ...this.query.pageSetting.filters,
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

  getGeneratedReport(): Observable<any> {
    this.changePage(0);
    return this.service.getGeneratedReport({
      ...this.query.pageSetting.pagination,
      ...this.query.pageSetting.filters,
    });
  }

  updateDateTo(dateTo: string) {
    this.store.update((state) => ({
      filters: {
        ...state.filters,
        dateTo: dateTo,
      },
      pagination: {
        ...state.pagination,
        offset: 0,
      },
    }));
  }

  updateDateFrom(dateFrom: string) {
    this.store.update((state) => ({
      filters: {
        ...state.filters,
        dateFrom: dateFrom,
      },
      pagination: {
        ...state.pagination,
        offset: 0,
      },
    }));
  }

  updateListId(listId: number) {
    this.store.update((state) => ({
      filters: {
        ...state.filters,
        listId: listId,
      },
      pagination: {
        ...state.pagination,
        offset: 0,
      },
    }));
  }

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
