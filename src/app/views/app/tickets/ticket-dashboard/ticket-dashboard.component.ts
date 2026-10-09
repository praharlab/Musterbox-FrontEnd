import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-ticket-dashboard',
    templateUrl: './ticket-dashboard.component.html',
    styleUrls: ['./ticket-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TicketDashboardComponent implements OnInit {
  ticketDashboardData: any = [];
  display: boolean = false;
  avgResolutionTimeInHours: string = '0';

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.initdata();
  }

  initdata() {
    this.api
      .callApi(this.constant.TICKETDASHBOARD, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.ticketDashboardData = res.data;
        if (this.ticketDashboardData.avgResolutionTime.length != 0) {
          let time = this.ticketDashboardData.avgResolutionTime;
          this.avgResolutionTimeInHours = (time[0].avgResolutionTime / 3600).toFixed(2);
        }
        this.display = true;
        this.spinner.stop();
      });
  }
}
