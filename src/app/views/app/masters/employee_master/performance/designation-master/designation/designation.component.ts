import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-designation',
    templateUrl: './designation.component.html',
    styleUrls: ['./designation.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DesignationComponent implements OnInit {

  rows6: any;

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
    this.designationdata()
  }

  designationdata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEMPLOYEEDESIGNATION + localStorage.getItem('id'),
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows6 = res.data;
          this.spinner.stop();
        }
      });
  }

}
