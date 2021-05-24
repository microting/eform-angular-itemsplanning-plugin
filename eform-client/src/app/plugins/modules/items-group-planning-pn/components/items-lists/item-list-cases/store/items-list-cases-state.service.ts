import { Injectable } from '@angular/core';
import { ItemsListCasesStore, ItemsListCasesQuery } from './';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  PaginationModel,
  SortModel,
} from 'src/app/common/models';
import { updateTableSort, getOffset } from 'src/app/common/helpers';
import { map } from 'rxjs/operators';
import { ItemsListCasePnModel } from '../../../../models';
import { ItemsGroupPlanningPnCasesService } from '../../../../services';

@Injectable({ providedIn: 'root' })
export class ItemsListCasesStateService {
  constructor(
    private store: ItemsListCasesStore,
    private service: ItemsGroupPlanningPnCasesService,
    private query: ItemsListCasesQuery
  ) {}

  private listId: number;

  setListId(listId: number) {
    this.listId = listId;
  }

  getPageSize(): Observable<number> {
    return this.query.selectPageSize$;
  }

  getSort(): Observable<SortModel> {
    return this.query.selectSort$;
  }

  getAllCases(): Observable<OperationDataResult<ItemsListCasePnModel>> {
    return this.service
      .getAllCases({
        listId: this.listId,
        ...this.query.pageSetting.pagination,
        dateFrom: '',
        dateTo: '',
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
