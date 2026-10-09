import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-monthly-skillsetform',
    templateUrl: './list-monthly-skillsetform.component.html',
    styleUrls: ['./list-monthly-skillsetform.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListMonthlySkillsetformComponent implements OnInit {
  @ViewChild('filterform') filterform: NgForm;
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows: any = [];
  myInputVariable: ElementRef;
  file: any;
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;

  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: Number(localStorage.getItem('company_id')),
    searchQuery: '',
    userMasterID: null,
    yearmonth: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  ipAddress: any;
  rows1: any = [];
  alldepartment: any = [];
  alldesignation: any;
  excel: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  events: any;
  excelevents: any;
  comp: any;
  format: string;
  url: string | ArrayBuffer;
  childcompany: string;
  rows2: any = [];
  values: any = [];
  imgshow1: boolean;
  checkdata: any;

  bodyUser: any[];
  User: any[];
  employee: any;
  selected3: any[];

  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.childcompany = localStorage.getItem('childcompany');

    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: Number(localStorage.getItem('company_id')),
      searchQuery: '',
      userMasterID: null,
      yearmonth: '',
    };

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.alldata();
    this.getcompany();
    this.checkpermission();
    this.getIPAddress();
  }

  SelectedCompany(id) {
    if (!id) return;

    this.bodyUser = [];
    this.User = [];
    this.selected3 = [];
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
          let data1 = [];
          this.employee.forEach(async (rating) => {
            data1.push(rating.userMasterID);
          });
          this.selected3 = data1;
        }
      });
  }

  alldata() {
    this.spinner.start('alldata');
    this.api
      .callApi(this.constant.GETALLMONTHLYSKILLSETSFORM, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
            this.spinner.stop('alldata');
          } else {
            this.handleError(res.message);
            this.spinner.stop('alldata');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('alldata');
        },
      );
  }

  showdata(rowdata) {
    this.values = rowdata;
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.alldata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.alldata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.alldata();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.alldata();
    }
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

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/skillsets/monthlySkillsetform/add_monthlySkillsetform']);
  }

  onSubmit() {
    if (!this.filterform.valid) {
      return;
    }

    if (this.filterform.value.company)
      this.filterData.companyMasterID = this.filterform.value.company;
    this.filterData.userMasterID = this.selected3;

    if (this.filterform.value.fromyearmonth) {
      let startyear = this.filterform.value.fromyearmonth.slice(0, 4);
      let startmonth = this.filterform.value.fromyearmonth.slice(5, 7);
      let startyearmonth = startyear.concat(startmonth);

      this.filterData.yearmonth = startyearmonth;
    }

    this.alldata();
  }

  clear() {
    this.filterform.resetForm();

    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  downloadFile() {
    let startyearmonth;
    if (this.filterform.value.fromyearmonth) {
      let startyear = this.filterform.value.fromyearmonth.slice(0, 4);
      let startmonth = this.filterform.value.fromyearmonth.slice(5, 7);
      startyearmonth = startyear.concat(startmonth);
    }

    let body = {
      userMasterID: this.filterData.userMasterID,
      yearmonth: startyearmonth,
      page: '',
      limit: '',
      companyMasterID: this.filterData.companyMasterID,
      searchQuery: this.filterData.searchQuery,
    };

    let data = [];
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLMONTHLYSKILLSETSFORM, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.excel = res.data;

          if (this.excel.length == 0) {
            this.notifications.create('No data to Export', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
          } else {
            for (var i = 0; i < this.excel.length; i++) {
              let map = [];

              if (this.excel[i].questionSkillsets) {
                let data2 = this.excel[i].questionSkillsets;
                map = data2.map((item, index) => {
                  return item.skillSet;
                });
              }

              let map2 = [];

              if (this.excel[i].answerSkillsets) {
                let data3 = this.excel[i].answerSkillsets;
                map2 = data3.map((item, index) => {
                  return item;
                });
              }

              const data1 = {
                SkillSets: map ? map.join(', ') : '',
                Answers: map2 ? map2.join(', ') : '',
                YYYYMM: this.excel[i].YYYYMM,
                UserName: this.excel[i].userMaster.displayName,
                CompanyName: this.excel[i].companyMasterID.companyName,
                DesignationName: this.excel[i].userMaster.designationName,
                reportto: this.excel[i].reportto,
                fillby: this.excel[i].fillby,
                fillDateTime: this.excel[i].fillDateTime,
                verifiedby: this.excel[i].verifiedby,
                verifiedDateTime: this.excel[i].verifiedDateTime,
                Verified: this.excel[i].verified,
                fillStatus: this.excel[i].fillStatus,
                CreateBy: this.excel[i].createBy,
              };
              if (data1.fillStatus == 1) {
                data1.fillStatus = 'Filled';
              } else {
                data1.fillStatus = 'Not Filled';
              }
              if (data1.Verified == 1) {
                data1.Verified = 'Verified';
              } else {
                data1.Verified = 'Not Verified';
              }
              data.push(data1);
            }

            const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
            const header = Object.keys(data[0]);
            let csv = data.map((row) =>
              header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','),
            );
            csv.unshift(header.join(','));
            let csvArray = csv.join('\r\n');

            var blob = new Blob([csvArray], { type: 'text/csv' });
            saveAs(blob, 'Skillsets Form.csv');
          }
        }
      });
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
