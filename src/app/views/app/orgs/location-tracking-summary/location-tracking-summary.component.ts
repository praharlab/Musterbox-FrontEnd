import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-location-tracking-summary',
    templateUrl: './location-tracking-summary.component.html',
    styleUrls: ['./location-tracking-summary.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LocationTrackingSummaryComponent implements OnInit {

  @Input() userMasterID: string;
  @Input() selectedDate: string;

  public info: Array<any> = [];
  summaryData: any;
  address: string;
  time: string;
  battery: number;
  gps: string;
  developerMode: boolean;
  wifi: boolean;
  location: string;
  mobile_name: string;


  constructor(private api: ApiService, private spinner: NgxUiLoaderService, private constant: ConstantService, private notifications: AppNotificationService) { }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  ngOnInit(): void {
    const filterData = {
      userMasterID: this.userMasterID,
      date: this.selectedDate,
    }
    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETUSERTRACKINGINFO, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.info = res.data;
          // this.address = this.info[0].address;
          // this.time = this.info[0].time;
          // this.battery = this.info[0].battery;
          // this.gps = this.info[0].gps;
          // this.developerMode = this.info[0].developerMode;
          // this.wifi = this.info[0].wifi;
          // this.location = this.info[0].address;
          // this.mobile_name = this.info[0].mobile_name;
          this.spinner.stop('start');
          
        } else {
          this.handleError(res.message);
          this.spinner.stop('start');
        }
      }, (err) => {
        this.handleError(err.error.message);

        this.spinner.stop('start');
      },)
  }

}
