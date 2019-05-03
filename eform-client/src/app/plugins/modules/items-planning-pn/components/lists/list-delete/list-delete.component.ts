import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {
  ItemsPlanningPnListsService
} from 'src/app/plugins/modules/items-planning-pn/services';
import {ListPnModel} from '../../../models/list';

@Component({
  selector: 'app-items-planning-pn-list-delete',
  templateUrl: './list-delete.component.html',
  styleUrls: ['./list-delete.component.scss']
})
export class ListDeleteComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onListDeleted: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  selectedListModel: ListPnModel = new ListPnModel();
  constructor(private trashInspectionPnListsService: ItemsPlanningPnListsService) { }

  ngOnInit() {
  }

  show(listModel: ListPnModel) {
    this.selectedListModel = listModel;
    this.frame.show();
  }

  deleteList() {
    this.spinnerStatus = true;
    this.trashInspectionPnListsService.deleteList(this.selectedListModel.id).subscribe((data) => {
      if (data && data.success) {
        this.onListDeleted.emit();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }
}
