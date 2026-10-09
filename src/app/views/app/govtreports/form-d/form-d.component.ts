import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'app-form-d',
    templateUrl: './form-d.component.html',
    styleUrls: ['./form-d.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FormDComponent implements OnInit {
  @ViewChild('addcompanyreport') addcompanyreport: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  values: any = [];
  allcomp: any;
  alldepartment: any;
  comp: any;
  alldesignation: any;
  companyid: any;
  companyname: any;
  startDate: any;
  endDate: any;
  companyaddress: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.getIPAddress();
    this.getcompany();
    this.getDesignationData();
    this.getDepartmenData();
  }
  add() {
    this.values = [];
  }
  removevalue(i) {
    this.values.splice(i, 1);
  }

  addvalue() {
    this.values.push({ value: '' });
  }
  onSubmit() {
    if (this.addcompanyreport.valid) {
      this.companyid = this.addcompanyreport.value.company;
      this.startDate = this.addcompanyreport.value.startdate;
      this.endDate = this.addcompanyreport.value.enddate;
      this.getcompanybyid(this.companyid);
    }
  }
  getcompanybyid(id: any) {
    if (this.comp.length == 1) {
      this.companyname = this.comp.companyName;
      this.companyaddress = this.comp.companyAddress;
    } else {
      for (var i = 0; i < this.comp.length; i++) {
        if (this.comp[i].companyMasterID == id) {
          this.companyname = this.comp[i].companyName;
          this.companyaddress = this.comp[i].companyAddress;
        }
      }
    }
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  getcompany() {
    const body = {
      companyMasterID: 4,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.comp = res.data;

          this.spinner.stop();
        }
      });
  }
  getDesignationData() {
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + 4, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;
          this.spinner.stop();
        }
      });
  }
  getDepartmenData() {
    this.api
      .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + 4, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldepartment = res.data;

          this.spinner.stop();
        }
      });
  }
}
