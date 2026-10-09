import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-list-employee-reportsto',
    templateUrl: './list-employee-reportsto.component.html',
    styleUrls: ['./list-employee-reportsto.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeReportstoComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  adminRoot = environment.adminRoot;

  selectedCityIds: any = [];
  selecteddata: any = [];
  ownerList: any;
  dropdownSettings = {};
  singledropdownSettings = {};
  ipAddress: any;
  selectedCityIds1 = [];
  usertype: any;
  formValue: any;
  values = [];
  allCompany: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private profileStatusService: ProfileStatusService,
    private formValueStorageService: FormValueStorageService,
  ) { }
  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.getOwner();
    this.getIPAddress();
    this.getCompany();
    this.usertype = localStorage.getItem('usertype');
    this.profileStatusService.refreshProfileStatus();
  }

  dropboxChips() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 6,
      allowSearchFilter: true,
    };
    this.singledropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      itemsShowLimit: 6,
      allowSearchFilter: true,
    };
  }
  getCompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api
      .callApi(this.constant.GETCOMPANYTREE, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allCompany = res.data;
        }
        this.spinner.stop('company');

      });
  }
  getOwner() {

    let companyid = this.formValue.ListEmployeeMasterComponent.id;
    this.spinner.start('main');
    this.api.callApi(this.constant.VIEWREPORT + companyid, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        if (res.data.length > 0) {
          for (var i = 0; i < res.data.length; i++) {
            let allUser = []
            let companyid = +res.data[i].companyMasterID, userid = +res.data[i].userMasterID
            const filterData = {
              companyMasterID: +res.data[i].companyMasterID,
            };
            this.spinner.start('users');
            this.api
              .callApi(this.constant.GETUSER, filterData, 'POST', true, false, true)
              .subscribe((res1: any) => {
                if (res1.status == 200) {
                  allUser = res1.data;
                  this.values.push({
                    companyMasterID: companyid, userMasterID: userid, allCompany: this.allCompany, allUsers: allUser, deleted: false
                  })

                  this.spinner.stop('users');
                }
              });


          }
        }
        this.spinner.stop('main');

      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('main');
      },
    );
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    let mainarray = [];
    let tempID = [];


    for (var item of this.values) {
      if (item.deleted) continue;

      if (+this.formValue.ListEmployeeMasterComponent.id == +item.userMasterID) {
        this.notifications.create('Oops!', 'User cannot report him/her self!', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        return;
      }

      if (tempID.includes(item.userMasterID)) {
        this.notifications.create('Oops!', 'Repeated user found!', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        return;
      }
      mainarray.push({
        userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        reportToID: item.userMasterID,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      });
      tempID.push(item.userMasterID);
    }

    let body = {
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      reportsto: mainarray,
    };
    this.spinner.start();
    this.api.callApi(this.constant.CREATEREPORTSTO, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop();
            this.router.navigate([this.adminRoot + '/masters/edit_employee']).then(() => {
              // this.ngOnInit();
              this.addcomp.resetForm();
              this.values = [];
              this.getOwner();
              this.spinner.stop();
            });
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
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  addvalue() {
    this.values.push({ companyMasterID: null, userMasterID: null, allCompany: this.allCompany, allUsers: [], deleted: false });
  }
  removevalue(i: any) {
    // this.values.splice(i, 1);
    this.values[i].deleted = true
  }

  selectcompany(event, i) {

    this.values[i].userMasterID = null;
    this.values[i].allUsers = [];

    if (event) {
      const filterData = {
        companyMasterID: event,
      };
      this.spinner.start('users');
      this.api
        .callApi(this.constant.GETUSER, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.values[i].allUsers = res.data;
            this.spinner.stop('users');
          }
        });
    } else {
      this.values[i].companyMasterID = null;
    }
  }
}
