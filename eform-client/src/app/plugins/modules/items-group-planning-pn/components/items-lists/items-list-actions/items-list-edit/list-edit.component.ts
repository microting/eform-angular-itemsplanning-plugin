import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ItemsGroupPlanningPnListsService } from '../../../../services';
import {
  ItemsListPnItemModel,
  ItemsListPnModel,
  ItemsListPnUpdateModel,
} from '../../../../models/list';
import { debounceTime, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { EFormService } from 'src/app/common/services';
import { TemplateListModel, TemplateRequestModel } from 'src/app/common/models';

@Component({
  selector: 'app-items-group-planning-pn-list-edit',
  templateUrl: './list-edit.component.html',
  styleUrls: ['./list-edit.component.scss'],
})
export class ListEditComponent implements OnInit {
  @ViewChild('frame', { static: false }) frame;
  @ViewChild('unitImportModal', { static: false }) importUnitModal;
  @Output() onListUpdated: EventEmitter<void> = new EventEmitter<void>();
  selectedListModel: ItemsListPnModel = new ItemsListPnModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel();
  templatesModel: TemplateListModel = new TemplateListModel();
  typeahead = new EventEmitter<string>();
  selectedListId: number;
  constructor(
    private activateRoute: ActivatedRoute,
    private itemsGroupPlanningPnListsService: ItemsGroupPlanningPnListsService,
    private cd: ChangeDetectorRef,
    private eFormService: EFormService,
    private location: Location
  ) {
    this.typeahead
      .pipe(
        debounceTime(200),
        switchMap((term) => {
          this.templateRequestModel.nameFilter = term;
          return this.eFormService.getAll(this.templateRequestModel);
        })
      )
      .subscribe((items) => {
        this.templatesModel = items.model;
        this.cd.markForCheck();
      });
    const activatedRouteSub = this.activateRoute.params.subscribe((params) => {
      this.selectedListId = +params['id'];
    });
  }

  ngOnInit() {
    this.getSelectedList(this.selectedListId);
    // this.frame.show();
  }

  show(listModel: ItemsListPnModel) {}

  getSelectedList(id: number) {
    this.itemsGroupPlanningPnListsService
      .getSingleList(id)
      .subscribe((data) => {
        if (data && data.success) {
          this.selectedListModel = data.model;
          this.selectedListModel.internalRepeatUntil = this.selectedListModel.repeatUntil;
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

  goBack() {
    this.location.back();
  }

  updateList() {
    if (this.selectedListModel.internalRepeatUntil) {
      const tempDate = moment(
        this.selectedListModel.internalRepeatUntil
      ).format('DD/MM/YYYY');
      const datTime = moment.utc(tempDate, 'DD/MM/YYYY');
      this.selectedListModel.repeatUntil = datTime
        .format('YYYY-MM-DDT00:00:00')
        .toString();
    }
    const model = new ItemsListPnUpdateModel(this.selectedListModel);
    this.itemsGroupPlanningPnListsService
      .updateList(model)
      .subscribe((data) => {
        if (data && data.success) {
          this.onListUpdated.emit();
          this.selectedListModel = new ItemsListPnModel();
          this.goBack();
        }
      });
  }
  showImportModal() {
    this.importUnitModal.show();
  }
  onSelectedChanged(e: any) {
    // debugger;
    // this.selectedListModel.eFormId = e.id;
  }
  addNewItem() {
    const newItem = new ItemsListPnItemModel();
    // set corresponding id
    if (!this.selectedListModel.items.length) {
      newItem.id = this.selectedListModel.items.length;
    } else {
      newItem.id =
        this.selectedListModel.items[this.selectedListModel.items.length - 1]
          .id + 1;
    }
    this.selectedListModel.items.push(newItem);
  }

  removeItem(id: number) {
    this.selectedListModel.items = this.selectedListModel.items.filter(
      (x) => x.id !== id
    );
  }
}
