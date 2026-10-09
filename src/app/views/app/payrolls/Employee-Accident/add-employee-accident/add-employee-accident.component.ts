import { Component, ViewChild, OnInit, ElementRef, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-add-employee-accident',
    templateUrl: './add-employee-accident.component.html',
    styleUrls: ['./add-employee-accident.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddEmployeeAccidentComponent implements OnInit {
  @ViewChild('addAccident') addAccident: NgForm;

  scrollBarHorizontal = window.innerWidth < 1201;
  childcompany: string;
  usertype: string;
  company_id: string;
  cid: string;
  company1: any;
  permissionedit: any;
  permissionview: any;
  permissiondelete: any;
  employee: any;
  allbranch: any;
  employeedata: any;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  branchfilter: boolean = false;
  filterData = {
    page: 1,
    limit: 10,
    userid: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  rows = [];
  days: any[];
  ipAddress: any;
  maxdays: Number;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private ren: Renderer2,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');

    this.checkpermission();
    this.getcompany();
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stop('company');
        }
      });
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ExpenseRequest' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ExpenseRequest' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ExpenseRequest' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  selectcompany(id) {
    let bb = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start('user');
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
        }
      });

    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.spinner.stop('user');
      });
  }

  selectbranch(id) {
    if (id == undefined) {
      this.addAccident.resetForm();
    }
    this.branchfilter = true;
    let bb = {
      branchMasterID: id,
    };
    this.spinner.start('branchuser');
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employeedata = res.data;
          this.spinner.stop('branchuser');
        }
      });
  }

  calcdays() {
    if (this.addAccident.value.AccidentDate != '' && this.addAccident.value.ReturnDate != '') {
      this.days = [];
      let startDate = this.addAccident.value.AccidentDate;
      let date1 = new Date(this.addAccident.value.ReturnDate);
      let date2 = new Date(startDate);
      let timeInMilisec = date1.getTime() - date2.getTime();
      let daysBetweenDates = Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24));
      this.days.push(Number(daysBetweenDates));
      this.maxdays = this.days[0];
    }
  }

  onSubmit() {
    if (!this.addAccident.valid) {
      return;
    }

    let body = {
      userMasterID: this.addAccident.value.userMasterID,
      NoticeDate: this.addAccident.value.NoticeDate,
      AccidentDate: this.addAccident.value.AccidentDate,
      AccidentTime: this.addAccident.value.AccidentTime,
      AccidentLocation: this.addAccident.value.AccidentLocation,
      AccidentCause: this.addAccident.value.AccidentCause,
      InjuryNature: this.addAccident.value.InjuryNature,
      WitnessOneName: this.addAccident.value.WitnessOneName,
      WitnessOneAddress: this.addAccident.value.WitnessOneAddress,
      WitnessOneOccupation: this.addAccident.value.WitnessOneOccupation,
      WitnessSecondName: this.addAccident.value.WitnessSecondName,
      WitnessSecondAddress: this.addAccident.value.WitnessSecondAddress,
      WitnessSecondOccupation: this.addAccident.value.WitnessSecondOccupation,
      ReturnDate: this.addAccident.value.ReturnDate,
      TotalDays: this.maxdays,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };

    this.spinner.start('submit');
    this.api
      .callApi(this.constant.ADDEMPACCIDENT, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          }),
            setTimeout(() => {
              this.router
                .navigate([this.adminRoot + '/payrolls/list_employee_accident'])
                .then(() => { });
            }, 3000);
          this.spinner.stop('submit');
        } else {
          this.notifications.create('Error', 'Error', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          }),
            setTimeout(() => {
              this.router
                .navigate([this.adminRoot + '/payrolls/list_employee_accident'])
                .then(() => { });
            }, 3000);
          this.spinner.stop('submit');
        }
      });
  }

  clear() {
    window.location.reload();
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
