import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
@Component({
    selector: 'app-ticket-dashboard-ticket-subcategory',
    templateUrl: './ticket-dashboard-ticket-subcategory.component.html',
    styleUrls: ['./ticket-dashboard-ticket-subcategory.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TicketDashboardTicketSubcategoryComponent implements OnInit {
  columnMode = ColumnMode;

  @Input() ticketSubCategoryData = [];

  constructor() {}

  ngOnInit(): void {}
}
