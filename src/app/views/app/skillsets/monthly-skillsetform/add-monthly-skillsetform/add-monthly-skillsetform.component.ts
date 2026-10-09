import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { environment } from 'src/environments/environment';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-add-monthly-skillsetform',
    templateUrl: './add-monthly-skillsetform.component.html',
    styleUrls: ['./add-monthly-skillsetform.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddMonthlySkillsetformComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  adminRoot = environment.adminRoot;

  childcompany: string;
  cid: string;
  page = {
    totalCount: 0,
    offset: 0,
  };
  usertype: any;
  company_id: any;
  alldepartment: any;
  limit = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  filterData = {
    page: 1,
    limit: 10,
    companyid: '',
    fromdate: '',
    todate: '',
    user: '',
  };
  company1: any;
  designation1: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  SelectionType = SelectionType;
  allbranch: any = [];
  alluser: any;
  datesArray: any[];
  selected: any = [];
  selected1: any = [];
  selected2: any = [];
  selected3: any = [];
  employee: any;
  enddate: Date;
  User: any = [];
  bodyUser: any;
  ipAddress: any;
  buttonDisabled = false;
  buttonState = '';
  employeedata: any;
  branchfilter: boolean = false;
  selected4: any[];
  userFormisThereForThatMonth: any;
  usserFormCreatedSuccessfully: any;
  userDesignationFormisNotCreated: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private http: HttpClient,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) { }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
    this.getIPAddress();
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
          this.company1 = res.data;
          this.spinner.stop();
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
              permissionval.formName == 'GenerateMonthlySkillSetsForm' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'GenerateMonthlySkillSetsForm' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'GenerateMonthlySkillSetsForm' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'GenerateMonthlySkillSetsForm' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  clear() {
    this.datefilter.resetForm();
    this.bodyUser = [];
    this.User = [];
    this.allbranch = [];
    this.selected3 = [];
    this.selected4 = [];
    this.employee = [];
  }

  selectcompany(id) {
    this.bodyUser = [];
    this.User = [];

    if (!id || id == undefined) {
      this.datefilter.resetForm();
      return;
    }

    let bb = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          this.selectAllForDropdownItems(this.employee);
          let data1 = [];
          this.employee.forEach(async (rating) => {
            data1.push(rating.userMasterID);
          });
          this.selected3 = data1;
        }
      });

    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.spinner.stop();
      });

    this.spinner.start();
    let body = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.api
      .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          for (let item of res.data) {
            this.User.push(item.userMasterID);
          }
          this.spinner.stop();
        }
      });
  }

  selectbranch(id) {
    this.bodyUser = [];
    this.User = [];

    if (id == undefined) {
      this.datefilter.resetForm();
      return;
    }
    this.branchfilter = true;
    let bb = {
      branchMasterID: id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employeedata = res.data;
          this.selectAllForDropdownItems(this.employeedata);
          let data2 = [];
          this.employeedata.forEach(async (rating) => {
            data2.push(rating.userMasterID);
          });
          this.selected4 = data2;
          this.spinner.stop();
        }
      });

    let bb1 = {
      branchMasterID: this.datefilter.value.branch,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, bb1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          for (let item of res.data) {
            this.User.push(item.userMasterID);
          }
          this.spinner.stop();
        }
      });
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  selectfrom() {
    this.enddate = new Date();
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    function getMonthRangeArray(startDateStr, endDateStr) {
      const startDate = parseInt(startDateStr.substr(0, 7).replace(/-/g, ''));
      const endDate = parseInt(endDateStr.substr(0, 7).replace(/-/g, ''));

      const result = [];
      let currentDate = startDate;

      while (currentDate <= endDate) {
        result.push(currentDate.toString());
        const year = Math.floor(currentDate / 100);
        const month = currentDate % 100;
        if (month === 12) {
          currentDate = (year + 1) * 100 + 1;
        } else {
          currentDate++;
        }
      }

      return result;
    }

    let startyear = this.datefilter.value.fromyearmonth.slice(0, 4);
    let startmonth = this.datefilter.value.fromyearmonth.slice(5, 7);
    let startyearmonth = startyear.concat(startmonth);

    let endyear = this.datefilter.value.toyearmonth.slice(0, 4);
    let endmonth = this.datefilter.value.toyearmonth.slice(5, 7);
    let endyearmonth = endyear.concat(endmonth);

    const yearmonthArray = getMonthRangeArray(startyearmonth, endyearmonth);

    let body = {
      yearmonth: yearmonthArray,
      userMasterID: this.User,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
      companyMasterID: this.datefilter.value.company,
    };

    this.spinner.start();
    this.api
      .callApi(this.constant.MONTHLYSKILLSETSFORMADD, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.userDesignationFormisNotCreated = res.userDesignationFormisNotCreated;
            this.usserFormCreatedSuccessfully = res.usserFormCreatedSuccessfully;
            this.userFormisThereForThatMonth = res.userFormisThereForThatMonth;
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
}
