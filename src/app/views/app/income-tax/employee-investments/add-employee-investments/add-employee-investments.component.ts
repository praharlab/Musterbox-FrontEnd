import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-add-employee-investments',
    templateUrl: './add-employee-investments.component.html',
    styleUrls: ['./add-employee-investments.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddEmployeeInvestmentsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
