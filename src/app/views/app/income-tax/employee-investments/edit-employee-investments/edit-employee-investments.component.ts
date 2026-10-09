import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-edit-employee-investments',
    templateUrl: './edit-employee-investments.component.html',
    styleUrls: ['./edit-employee-investments.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditEmployeeInvestmentsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
