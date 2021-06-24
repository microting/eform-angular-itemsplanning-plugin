import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ItemsListPnModel, ItemsListPnUpdateModel } from '../../../../models';
import { ItemsGroupPlanningPnListsService } from '../../../../services';
import { TemplateColumnModel, TemplateListModel } from 'src/app/common/models';
import { EFormService } from 'src/app/common/services';

@Component({
  selector: 'app-item-list-case-column-modal',
  templateUrl: './item-list-case-columns-modal.component.html',
  styleUrls: ['./item-list-case-columns-modal.component.scss'],
})
export class ItemListCaseColumnsModalComponent implements OnInit {
  @ViewChild('frame', { static: false }) frame;
  @Output() listUpdated: EventEmitter<void> = new EventEmitter<void>();
  selectedListModel: ItemsListPnModel = new ItemsListPnModel();
  templatesModel: TemplateListModel = new TemplateListModel();

  // columnEditModel: UpdateColumnsModel = new UpdateColumnsModel();
  columnModels: Array<TemplateColumnModel> = [];

  constructor(
    private eFormService: EFormService,
    private itemsGroupPlanningPnListsService: ItemsGroupPlanningPnListsService
  ) {}

  ngOnInit() {}

  show(listModel: ItemsListPnModel) {
    this.getSelectedList(listModel.id);
    // this.selectedTemplateDto = selectedTemplate;
    this.getColumnsForTemplate(listModel.relatedEFormId);
    this.frame.show();
  }

  getSelectedList(id: number) {
    this.itemsGroupPlanningPnListsService
      .getSingleList(id)
      .subscribe((data) => {
        if (data && data.success) {
          this.selectedListModel = data.model;
          this.templatesModel.templates = [
            // @ts-ignore
            {
              id: this.selectedListModel.relatedEFormId,
              label: this.selectedListModel.relatedEFormName,
            },
          ];
        }
      });
  }

  updateList() {
    const model = new ItemsListPnUpdateModel(this.selectedListModel);
    // if (this.selectedListModel.repeatUntil) {
    //   const datTime = moment(this.selectedListModel.repeatUntil);
    // }
    this.itemsGroupPlanningPnListsService
      .updateList(model)
      .subscribe((data) => {
        if (data && data.success) {
          this.listUpdated.emit();
          this.selectedListModel = new ItemsListPnModel();
          this.frame.hide();
        }
      });
  }

  getColumnsForTemplate(relatedEformId: number) {
    this.eFormService
      .getTemplateColumns(relatedEformId)
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.columnModels = operation.model;
          // this.eFormService.getCurrentTemplateColumns(this.selectedTemplateDto.id).subscribe((result) => {
          //   if (result && result.success) {
          //     this.columnEditModel = result.model;
          //   }
          // });
        }
      });
  }
}
