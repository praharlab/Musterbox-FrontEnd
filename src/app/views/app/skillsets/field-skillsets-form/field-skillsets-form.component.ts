import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-field-skillsets-form',
    templateUrl: './field-skillsets-form.component.html',
    styleUrls: ['./field-skillsets-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FieldSkillsetsFormComponent implements OnInit {
  @ViewChild('filterform') filterform: NgForm;
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
    userMasterID: [],
    yearmonth: '',
    page: 1,
    limit: 10,
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
  filter: string;
  limit = 10;
  events: any;
  excelevents: any;
  comp: any;
  format: string;
  url: string | ArrayBuffer;
  childcompany: string;
  rows2: any = [];

  imgshow1: boolean;
  checkdata: any;
  columns = [
    { name: 'Company Name', prop: 'companyMaster.companyName' },
    { name: 'Designation Name', prop: 'designation.designationName' },
    { name: 'Create By', prop: 'createBy' },
    { name: 'Created Date', prop: 'createdAt' },
    { name: 'Status', prop: 'status' },
    { name: 'Action' },
    { name: 'Update By', prop: 'updateBy' },
    { name: 'Updated Date', prop: 'updatedAt' },
  ];
  values: any = [];

  currentPage: number;
  formValue: any;
  tempSelectedYearMonth: any = '';

  // Page = 1;
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/skillsets/field-skillsets-form',
          this.adminRoot + '/skillsets/editMonthlySkillsetsForm',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('FieldSkillsetsFormComponent', false);
        }
      }
    });
  }

  ngOnInit(): void {
    this.childcompany = localStorage.getItem('childcompany');

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('FieldSkillsetsFormComponent')) {
      this.filterData = {
        userMasterID: [],
        yearmonth: '',
        page: 1,
        limit: 10,
      };
    } else {
      this.filterData = this.formValue.FieldSkillsetsFormComponent.body.filterData;
      this.tempSelectedYearMonth = this.formValue.FieldSkillsetsFormComponent.body.selectedYearMonth;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.alldata();
    this.checkpermission();
    this.getIPAddress();
  }

  alldata() {
    this.filterData.userMasterID = [localStorage.getItem('id')];
    this.spinner.start('alldata');
    this.api
      .callApi(
        this.constant.GETMONTHLYSKILLSETSFORMREPORTTOID,
        this.filterData,
        'POST',
        true,
        false,
        true,
      )
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

          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SkillSetsFormAuthorization' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'SkillSetsFormAuthorization' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  showdata(rowdata) {
    this.values = rowdata;
  }

  onSubmit() {
    if (!this.filterform.valid) {
      return;
    }

    this.filterData.userMasterID = [localStorage.getItem('id')];

    let startyear = this.filterform.value.fromyearmonth.slice(0, 4);
    let startmonth = this.filterform.value.fromyearmonth.slice(5, 7);
    let yearmonth = startyear.concat(startmonth);

    this.filterData.yearmonth = yearmonth;
    this.tempSelectedYearMonth = this.filterform.value.fromyearmonth;

    this.alldata();
  }

  clear() {
    this.filterform.resetForm();

    this.formValueStorageService.removeData('FieldSkillsetsFormComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
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

  navigateToEditMOnthlySkillsetsFormPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'FieldSkillsetsFormComponent',
      { filterData: this.filterData, selectedYearMonth: this.tempSelectedYearMonth },
      '/skillsets/editMonthlySkillsetsForm',
      rowData.monthlySkillsetsFormID,
    );
  }
}
