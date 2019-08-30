import { Component, OnInit } from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {Papa} from 'ngx-papaparse';
import {TrashInspectionPnFractionsService} from '../../../../trash-inspection-pn/services';
import {ItemsPlanningPnHeadersModel, ItemsPlanningPnUnitImportModel} from '../../../models/list';
import {ItemsPlanningPnListsService} from '../../../services';

const URL = '';

@Component({
  selector: 'app-items-planning-pn-unit-import',
  templateUrl: './items-planning-pn-unit-import.component.html',
  styleUrls: ['./items-planning-pn-unit-import.component.scss']
})
export class ItemsPlanningPnUnitImportComponent implements OnInit {

  public data: any = [];
  uploader: FileUploader;
  unitImportModel: ItemsPlanningPnUnitImportModel;
  unitHeaderModel: ItemsPlanningPnHeadersModel;
  fileName: string;
  spinnerStatus = false;
  totalColumns: number;
  totalRows: number;
  myFile: any;
  chboxNames = ['Exclude the first row', 'Ignore all unselected fields', 'Manage matching records'];
  papa: Papa = new Papa();
  tableData: any = null;
  options = [
    {value: 0, label: 'Number'},
    {value: 1, label: 'Name'},
    {value: 2, label: 'Location Nr'},
    {value: 3, label: 'eForm nr'},
    {value: 4, label: 'Statutory eForm'},
    {value: 5, label: 'Description'}


  ];
  constructor(private itemListService: ItemsPlanningPnListsService) {
    this.unitImportModel = new ItemsPlanningPnUnitImportModel();
    this.options.forEach((option) => {
        this.unitHeaderModel = new ItemsPlanningPnHeadersModel();
        this.unitHeaderModel.headerLabel = option.label;
        this.unitHeaderModel.headerValue = null;
        this.unitImportModel.headerList.push(this.unitHeaderModel);
        // console.log(label);
      }
    );
    this.uploader = new FileUploader(
      {
        url: URL,
        autoUpload: true,
        isHTML5: true,
        removeAfterUpload: true
      });
    this.uploader.onAfterAddingFile = (fileItem => {
      fileItem.withCredentials = false;
      // console.log(fileItem._file);
      this.myFile = fileItem.file.rawFile;
    });
  }



  ngOnInit() {
    this.fileName = 'DummyCustomerData.csv';
    this.totalColumns = 4;
    this.totalRows = 100;
  }
  csv2Array(fileInput) {
    const file = fileInput;
    this.papa.parse(fileInput.target.files[0], {
      skipEmptyLines: true,
      header: false,
      complete: (results) => {
        this.tableData = results.data;
        console.log(this.tableData);
        this.unitImportModel.importList = JSON.stringify(this.tableData);
      }
    });
    return this.tableData;
  }
  // importFraction() {
  //   this.spinnerStatus = true;
  //   // this.customerImportModel.importList = this.tableData;
  //   // debugger;
  //   this.fractionsImportModel.headers = JSON.stringify(this.fractionsImportModel.headerList);
  //   return this.fractionsService.importFraction(this.fractionsImportModel).subscribe(((data) => {
  //     if (data && data.success) {
  //       this.fractionsImportModel = new FractionPnImportModel();
  //     } this.spinnerStatus = false;
  //   }));
  // }

  importUnit() {
    this.spinnerStatus = true;
    this.unitImportModel.headers = JSON.stringify(this.unitImportModel.headerList);
    return this.itemListService.importUnit(this.unitImportModel).subscribe(((data)=> {
      if (data && data.success) {
        this.unitImportModel = new ItemsPlanningPnUnitImportModel();
      } this.spinnerStatus = false;
    }));
}
  logThings(value) {
    console.log(value);
  }
  onSelectedChanged(e: any, columnIndex: any) {
    this.unitImportModel.headerList[e.value].headerValue = columnIndex;
  }
}
