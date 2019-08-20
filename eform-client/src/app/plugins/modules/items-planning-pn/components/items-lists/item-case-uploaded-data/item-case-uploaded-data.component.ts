import {Component, OnInit, ViewChild} from '@angular/core';
import {ItemsListPnItemCaseModel} from '../../../models/list/items-list-case-pn.model';
import {ItemsPlanningPnCasesService} from '../../../services';

@Component({
  selector: 'app-item-case-uploaded-data',
  templateUrl: './item-case-uploaded-data.component.html',
  styleUrls: ['./item-case-uploaded-data.component.scss']
})
export class ItemCaseUploadedDataComponent implements OnInit {
  @ViewChild('frame') frame;
  @ViewChild('uploadedDataPdfModal') uploadedDataPdfModal;
  spinnerStatus = false;
  selectedListCase: ItemsListPnItemCaseModel = new ItemsListPnItemCaseModel();
  constructor( private itemsPlanningPnCasesService: ItemsPlanningPnCasesService) { }

  ngOnInit() {
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

  showUploadPDFModal() {
    this.uploadedDataPdfModal.show(this.selectedListCase);
  }
}
