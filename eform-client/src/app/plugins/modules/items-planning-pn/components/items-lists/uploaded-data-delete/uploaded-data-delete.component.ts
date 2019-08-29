import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ItemsPlanningPnUploadedDataService} from '../../../services';
import {UploadedDataModel} from '../../../models/list';

@Component({
  selector: 'app-uploaded-data-delete',
  templateUrl: './uploaded-data-delete.component.html',
  styleUrls: ['./uploaded-data-delete.component.scss']
})
export class UploadedDataDeleteComponent implements OnInit {
 @ViewChild('frame') frame;
 @Output() onUploadedDataDeleted: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  selectedUploadedData: UploadedDataModel = new UploadedDataModel();
  constructor(private itemsPlanningPnUploadedDataService: ItemsPlanningPnUploadedDataService) { }

  ngOnInit() {
  }

  show(uploadedData: UploadedDataModel) {
    this.selectedUploadedData = uploadedData;
    this.frame.show();
  }

  deleteUploadedData() {
    this.spinnerStatus = true;
    this.itemsPlanningPnUploadedDataService.deleteUploadedData(this.selectedUploadedData.id).subscribe((data) => {
      if (data && data.success) {
        this.onUploadedDataDeleted.emit();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }
}
