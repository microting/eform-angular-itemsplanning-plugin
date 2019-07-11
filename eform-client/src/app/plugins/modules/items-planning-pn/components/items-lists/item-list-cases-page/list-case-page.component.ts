import {Component, OnInit} from '@angular/core';
import {SharedPnService} from '../../../../shared/services';

@Component({
  selector: 'app-items-planning-pn-list-case-page',
  templateUrl: './list-case-page.component.html',
  styleUrls: ['./list-case-page.component.scss']
})

export class ListCasePageComponent implements OnInit {
  spinnerStatus = false;

  constructor() { }

  ngOnInit(): void {
  }
}
