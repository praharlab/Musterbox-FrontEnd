import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-submit-form',
    templateUrl: './submit-form.component.html',
    styleUrls: ['./submit-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SubmitFormComponent implements OnInit {
  company: any;
  company1: any;
  apiURL = environment.apiUrl;
  showimage: boolean;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
  ) {}
  @ViewChild('addpreboarding') addpreboarding: NgForm;

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const body = {
      companyMasterID: this.activatedRoute.snapshot.params.id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;

          for (var i = 0; i < this.company.length; i++) {
            if (this.company[i].companyMasterID == this.activatedRoute.snapshot.params.id) {
              this.company1 = this.company[i];
            }
          }

          if (
            this.company1.companyLogo == '' ||
            this.company1.companyLogo == null ||
            this.company1.companyLogo == ' '
          ) {
            this.showimage = false;
          } else {
            this.showimage = true;
          }

          this.spinner.stop();
        }
      });
  }
}
