import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-ticket-dashboard-ticket-by-agent',
    templateUrl: './ticket-dashboard-ticket-by-agent.component.html',
    styleUrls: ['./ticket-dashboard-ticket-by-agent.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TicketDashboardTicketByAgentComponent implements OnInit {
  apiURL = environment.apiUrl;
  data: any[];
  @Input() ticketByAgentData = [];
  @Input() ticketAverageResolutionTime = '0';

  constructor() {}

  ngOnInit(): void {}
}
