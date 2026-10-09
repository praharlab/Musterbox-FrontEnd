import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-ticket-dashboard-priority',
    templateUrl: './ticket-dashboard-priority.component.html',
    styleUrls: ['./ticket-dashboard-priority.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TicketDashboardPriorityComponent implements OnInit {
  @Input() class = 'icon-cards-row';
  @Input() totalTickets = 0;
  @Input() ticketPriorityDistribution = [];

  statusCounts = [
    {
      priority: 'High',
      count: '0',
    },
    {
      priority: 'Medium',
      count: '0',
    },
    {
      priority: 'Low',
      count: '0',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.ticketPriorityDistribution.forEach((item) => {
      const priority = item.priority;
      const count = parseInt(item.count, 10);
      const priorityCountItem = this.statusCounts.find(
        (statusItem) => statusItem.priority === priority,
      );
      if (priorityCountItem) {
        priorityCountItem.count = (parseInt(priorityCountItem.count, 10) + count).toString();
      }
    });
  }
}
