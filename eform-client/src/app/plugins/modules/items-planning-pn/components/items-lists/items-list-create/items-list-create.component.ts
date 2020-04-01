import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {debounceTime, switchMap} from 'rxjs/operators';
import {ItemsPlanningPnListsService} from '../../../services';
import {SiteNameDto} from '../../../../../../common/models/dto';
import {DeployModel} from '../../../../../../common/models/eforms';
import {EFormService} from '../../../../../../common/services/eform';
import {SitesService} from '../../../../../../common/services/advanced';
import {AuthService} from 'src/app/common/services';
import {ItemsListPnCreateModel, ItemsListPnItemModel, ItemsListPnModel} from '../../../models/list';
import {TemplateListModel, TemplateRequestModel} from 'src/app/common/models/eforms';


@Component({
  selector: 'app-items-planning-pn-items-list-create',
  templateUrl: './items-list-create.component.html',
  styleUrls: ['./items-list-create.component.scss']
})
export class ItemsListCreateComponent implements OnInit {
  @ViewChild('frame', {static: false}) frame;
  @ViewChild('unitImportModal', {static: false}) importUnitModal;
  @Output() listCreated: EventEmitter<void> = new EventEmitter<void>();
  // @Output() deploymentFinished: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  newListModel: ItemsListPnCreateModel = new ItemsListPnCreateModel();
  // sitesDto: Array<SiteNameDto> = [];
  // deployModel: DeployModel = new DeployModel();
  // deployViewModel: DeployModel = new DeployModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel();
  templatesModel: TemplateListModel = new TemplateListModel();
  typeahead = new EventEmitter<string>();

  get userClaims() {
    return this.authService.userClaims;
  }
  constructor(private trashInspectionPnListsService: ItemsPlanningPnListsService,
              private sitesService: SitesService,
              private authService: AuthService,
              private eFormService: EFormService,
              private cd: ChangeDetectorRef) {
    this.typeahead
      .pipe(
        debounceTime(200),
        switchMap(term => {
          this.templateRequestModel.nameFilter = term;
          return this.eFormService.getAll(this.templateRequestModel);
        })
      )
      .subscribe(items => {
        this.templatesModel = items.model;
        this.cd.markForCheck();
      });
  }

  ngOnInit() {
    // this.loadAllSites();
  }

  createItemsList() {
    this.spinnerStatus = true;

    if (this.newListModel.repeatUntil) {
      this.newListModel.repeatUntil.utcOffset(0, true);
    }

    this.trashInspectionPnListsService.createList(this.newListModel).subscribe((data) => {
      // debugger;
      if (data && data.success) {
        this.listCreated.emit();
        // this.submitDeployment();
        this.newListModel = new ItemsListPnCreateModel();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }


  // loadAllSites() {
  //   if (this.userClaims.eFormsPairingRead) {
  //     this.sitesService.getAllSitesForPairing().subscribe(operation => {
  //       this.spinnerStatus = true;
  //       if (operation && operation.success) {
  //         this.sitesDto = operation.model;
  //       }
  //       this.spinnerStatus = false;
  //     });
  //   }
  // }

  show() {
    // this.deployModel = new DeployModel();
    // this.deployViewModel = new DeployModel();
    this.frame.show();
  }
  showImportModal() {
    this.importUnitModal.show();
  }
  // onSelectedChanged(e: any) {
  //   debugger;
  //   this.newListModel.eFormId = e.id;
  // }
  // submitDeployment() {
  //   this.spinnerStatus = true;
  //   // this.deployModel.id = this.newInstallationModel.id;
  //   this.eFormService.deploySingle(this.deployModel).subscribe(operation => {
  //     if (operation && operation.success) {
  //       this.frame.hide();
  //       this.deploymentFinished.emit();
  //     }
  //     this.spinnerStatus = false;
  //   });
  // }
  addNewItem() {
    const newItem = new ItemsListPnItemModel();
    // set corresponding id
    if (!this.newListModel.items.length) {
      newItem.id = this.newListModel.items.length;
    } else {
      newItem.id = this.newListModel.items[this.newListModel.items.length - 1].id + 1;
    }
    this.newListModel.items.push(newItem);
  }

  removeItem(id: number) {
    this.newListModel.items = this.newListModel.items.filter(x => x.id !== id);
  }
}
