import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationDataResult } from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';
import { ReportPnFullModel, ReportPnGenerateModel } from '../models/report';

export let ItemsGroupPlanningPnReportsMethods = {
  Reports: 'api/items-group-planning-pn/reports',
  ReportsExcel: 'api/items-group-planning-pn/reports/excel',
};

@Injectable()
export class ItemsGroupPlanningPnReportsService {
  constructor(private apiBaseService: ApiBaseService) {}

  generateReport(
    model: ReportPnGenerateModel
  ): Observable<OperationDataResult<ReportPnFullModel>> {
    return this.apiBaseService.get(
      ItemsGroupPlanningPnReportsMethods.Reports,
      model
    );
  }

  getGeneratedReport(model: ReportPnGenerateModel): Observable<any> {
    return this.apiBaseService.getBlobData(
      ItemsGroupPlanningPnReportsMethods.ReportsExcel,
      model
    );
  }
}
