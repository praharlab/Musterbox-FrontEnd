import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
    selector: 'app-ticket-dashboard-ticket-category',
    templateUrl: './ticket-dashboard-ticket-category.component.html',
    styleUrls: ['./ticket-dashboard-ticket-category.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TicketDashboardTicketCategoryComponent implements OnInit {
  columnMode = ColumnMode;

  @Input() ticketCategoryData = [];

  constructor() {}

  ngOnInit(): void {}
}
