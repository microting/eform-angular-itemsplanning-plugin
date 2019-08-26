import {Component, OnInit, ViewChild} from '@angular/core';
import {ItemsListPnItemCaseModel} from '../../../models/list/items-list-case-pn.model';
import {ItemsPlanningPnCasesService, ItemsPlanningPnUploadedDataService} from '../../../services';
import {UploadedDataModel, UploadedDatasModel} from '../../../models/list';

@Component({
  selector: 'app-item-case-uploaded-data',
  templateUrl: './item-case-uploaded-data.component.html',
  styleUrls: ['./item-case-uploaded-data.component.scss']
})
export class ItemCaseUploadedDataComponent implements OnInit {
  @ViewChild('frame') frame;
  @ViewChild('uploadedDataPdfModal') uploadedDataPdfModal;
  @ViewChild('uploadedDataDeleteModal') uploadedDataDeleteModal;
  spinnerStatus = false;
  uploadedDatasModel: UploadedDatasModel = new UploadedDatasModel();
  selectedListCase: ItemsListPnItemCaseModel = new ItemsListPnItemCaseModel();
  constructor( private itemsPlanningPnCasesService: ItemsPlanningPnCasesService,
               private itemsPlanningPnUploadedDataService: ItemsPlanningPnUploadedDataService) { }

  ngOnInit() {
    this.getAllUploadedData(this.selectedListCase.id);
  }
  show(selectedListCase) {
    this.getSelectedListCase(selectedListCase.id);
    this.frame.show(selectedListCase);
  }

  getSelectedListCase(id: number) {
    this.spinnerStatus = true;
    this.itemsPlanningPnCasesService.getSingleCase(id).subscribe((data) => {
      if (data && data.success) {
        this.selectedListCase = data.model;
      }this.spinnerStatus = false;
    } );
  }
  getAllUploadedData(itemCaseId: number) {
    this.spinnerStatus = true;
    this.itemsPlanningPnUploadedDataService.getAllUploadedData(itemCaseId).subscribe((data) => {
      if (data && data.success) {
        this.uploadedDatasModel = data.model;
        this.spinnerStatus = false;
      }
    });
  }
  downloadUploadedDataPdf(fileName: string) {
    // this.itemsPlanningPnUploadedDataService.downloadUploadedDataPdf(fileName);
    window.open('api/items-planning-pn/uploaded-data/download-pdf/' + fileName);
  }
  showUploadPDFModal() {
    this.uploadedDataPdfModal.show(this.selectedListCase);
  }
  showUploadedDataDeleteModal(uploadedData: UploadedDataModel) {
    this.uploadedDataDeleteModal.show(uploadedData);
  }
}
