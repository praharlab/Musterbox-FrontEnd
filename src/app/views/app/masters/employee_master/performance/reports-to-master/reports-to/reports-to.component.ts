import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-reports-to',
    templateUrl: './reports-to.component.html',
    styleUrls: ['./reports-to.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ReportsToComponent implements OnInit {

  selectedCityIds1: any = [];

  constructor(
      private spinner: NgxUiLoaderService,
      private router: Router,
      public activatedRoute: ActivatedRoute,
      private notifications: AppNotificationService,
      private api: ApiService,
      private constant: ConstantService,
      private http: HttpClient,

  
    ) { }

  ngOnInit(): void {
    this.reportsto()
  }

  reportsto() {

    let companyid = localStorage.getItem('id');
    this.spinner.start();
    this.api.callApi(this.constant.VIEWREPORT + companyid, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        if (res.data.length > 0) {
          this.selectedCityIds1 = res.data;
          this.spinner.stop();
        } else {
          this.selectedCityIds1 = [];
        }
      },
      (err) => {
        this.spinner.stop();
      },
    );
  }

}
