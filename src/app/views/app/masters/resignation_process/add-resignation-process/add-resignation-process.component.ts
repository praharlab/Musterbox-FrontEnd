import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'app-add-resignation-process',
    templateUrl: './add-resignation-process.component.html',
    styleUrls: ['./add-resignation-process.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddResignationProcessComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('addtable') addtable: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  comp: any;
  adminRoot = environment.adminRoot;

  dbname1: any;
  tablename1: any;
  serialNo1: any;
  serialNumberIds: any = [];
  values = [];
  checkSerialNo: any;
  defaultTable: any;
  defaultSno: any;
  finalDBNAME: any;
  allcomp: any;
  company_id: any;
  alldepartment: any = null;
  allbranch: any;
  ownerList: any;

  selecteddesig: any;

  users_Body = {
    companyMasterID: '',
    designationID: '',
    branchMasterID: '',
  };
  ownerList1: any;
  selected: any = [];
  allusers: any = [];
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.company_id = +localStorage.getItem('company_id');
    this.getIPAddress();
    this.getcompany();
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allcomp = res.data;
          this.selectcompany(this.company_id)
          this.spinner.stop();
        }
      });
  }

  selectcompany(event) {
    this.values = []
    if (event) {
      this.company_id = event;
      this.alldepartment = []; // Clear the department list
      this.addcomp.controls['department'].reset(); // Reset the selected department
      this.users_Body.companyMasterID = event;
      this.spinner.start('dep');
      this.api
        .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.alldepartment = res.data;
          this.spinner.stop('dep');
        });
      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
          this.spinner.stop('branch');
        });
      this.getUsers(); // Fetch users related to the company
    }
  }

  selectbranch(event, i) {
    this.values[i].userMasterID = null;
    this.values[i].description = null

    this.selected = [];
    if (event) {
      const filterData = {
        companyMasterID: this.company_id,
        branchMasterID: event,
      };
      this.spinner.start('users');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList1 = res.data;
            this.values[i].ownerList = res.data;
            this.spinner.stop('users');
          }
        });
    } else {
      const filterData = {
        companyMasterID: this.company_id,
      };
      this.spinner.start('userss');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList1 = res.data;
            this.values[i].ownerList = res.data;
            this.spinner.stop('userss');
          }
        });
    }
  }

  getUsers() {
    this.spinner.start('users');
    this.api
      .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.ownerList = res.data;
          this.allusers = res.data;
          this.values.push({ branch: null, userMasterID: null, description: '', ownerList: this.allusers, deleted: false, });
        }
        this.spinner.stop('users');
      });
  }

  addvalue() {
    this.values.push({ branch: null, userMasterID: null, description: '', ownerList: this.allusers, deleted: false, });
  }

  removevalue(i) {
    this.values[i].deleted = true;
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    const taskData = [];
    this.values.forEach((element) => {
      if (!element.deleted) {
        taskData.push({
          userMasterID: element.userMasterID,
          description: element.description,
        });
      }
    });

    const formData = {
      companyMasterID: this.addcomp.value.company,
      departmentID: this.addcomp.value.department,
      taskData: taskData,
    };

    this.spinner.start();
    this.api.callApi(this.constant.ADDRESIGNATION, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/clearance-and-exit']);
            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }

  clear() {
    window.location.reload();
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }



}