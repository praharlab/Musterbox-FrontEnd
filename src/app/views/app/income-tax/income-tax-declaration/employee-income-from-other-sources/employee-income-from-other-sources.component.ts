import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-employee-income-from-other-sources',
    templateUrl: './employee-income-from-other-sources.component.html',
    styleUrls: ['./employee-income-from-other-sources.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeIncomeFromOtherSourcesComponent implements OnInit {
  @Input() data: any;
  @Input() selectedFiscalYear: string;

  constructor() {}

  ngOnInit(): void {
  }
}
