import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';
import { UploadedDatasModel } from '../models/list';
import { Injectable } from '@angular/core';

export let ItemsGroupPlanningPnUploadedDataMethods = {
  UploadedDatas: 'api/items-group-planning-pn/uploaded-data',
  DownloadPDF: 'api/items-group-planning-pn/uploaded-data/download-pdf/',
};

@Injectable({
  providedIn: 'root',
})
export class ItemsGroupPlanningPnUploadedDataService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAllUploadedData(
    itemCaseId: number
  ): Observable<OperationDataResult<UploadedDatasModel>> {
    return this.apiBaseService.get(
      ItemsGroupPlanningPnUploadedDataMethods.UploadedDatas +
        '/get-all/' +
        itemCaseId
    );
  }

  deleteUploadedData(uploadedDataId: number): Observable<OperationResult> {
    return this.apiBaseService.delete(
      ItemsGroupPlanningPnUploadedDataMethods.UploadedDatas +
        '/' +
        uploadedDataId
    );
  }

  downloadUploadedDataPdf(fileName: string): Observable<OperationResult> {
    return this.apiBaseService.get(
      ItemsGroupPlanningPnUploadedDataMethods.DownloadPDF,
      fileName
    );
  }
}
