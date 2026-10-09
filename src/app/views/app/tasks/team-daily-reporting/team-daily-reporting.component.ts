import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { NavigationStart, Router } from '@angular/router';
import { UserFormValueStorageService } from 'src/app/services/user-form-value-storage.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
@Component({
    selector: 'app-team-daily-reporting',
    templateUrl: './team-daily-reporting.component.html',
    styleUrls: ['./team-daily-reporting.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TeamDailyReportComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addcomp2') addcomp2: NgForm;
  items: any;
  Username: any;
  number: any;
  limit = 10;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  copersonlist: any;
  empId: any;
  rows: any = [];
  selected: any[];

  apiURL = environment.apiUrl;

  filterData = {
    page: 1,
    limit: 10,
    fromdate: '',
    todate: '',
    userMasterID: [],
    exportData: ''
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  permissionview: any = [];
  filter: string;

  scrollBarHorizontal = window.innerWidth < 1201;
  adminRoot = environment.adminRoot;
  formValue: any;
  display = false;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private userFormValueStorageService: UserFormValueStorageService,
    private notifications: AppNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
    {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          const protectedRoutes = [
            this.adminRoot + '/tasks/Team-Daily-Reporting',
            this.adminRoot + '/userprofile',
          ];

          const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
          if (!isProtectedRoute) {
            formValueStorageService.removeComponentData('TeamDailyReportComponent', false);
          }
        }
      });
    }
    {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          const protectedRoutes = [
            this.adminRoot + '/tasks/Team-Daily-Reporting',
            this.adminRoot + '/userprofile',
          ];

          const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
          if (!isProtectedRoute) {
            userFormValueStorageService.removeData();
          }
        }
      });
    }
  }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyComponent('TeamDailyReportComponent')) {
      
      this.filterData = {
        page: 1,
        limit: 10,
        fromdate: '',
        todate: '',
        userMasterID: [],
        exportData: ''
      };
    } else {
      this.filterData = this.formValue.TeamDailyReportComponent;
      
    }
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.checkpermission();

    let id = localStorage.getItem('id');
    this.spinner.start('user');
    this.api
      .callApi(this.constant.REPORTTO2 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.copersonlist = res.data;

          this.selectAllForDropdownItems(this.copersonlist);

          this.copersonlist.map((el) => {
            el.name = el.employee.displayName;
          });
          let data1 = [];
          this.copersonlist.forEach(async (rating) => {
            data1.push(rating.userMasterID);
          });
          this.selected = data1;
          this.filterData.userMasterID = this.selected;
          this.filterData.exportData = ''

          this.getAllData();

          this.spinner.stop('user');
        }
      });
  }

  getAllData() {

       this.filterData.exportData = ''
    this.spinner.start('getdata');
    this.api
      .callApi(this.constant.GETALLDAILYTASK_V2, this.filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
        }
        this.spinner.stop('getdata');
      });
  }

  view(attachment: any) {
    window.open(this.apiURL + 'uploads/dailyTask/' + attachment, '_blank');
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
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'TeamDailyReporting' &&
              permissionval.operationName.includes('View')
            );
          });

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

  onSubmit() {
    if (!this.addcomp2.valid) {
      return;
    }

    this.filterData.fromdate = this.addcomp2.value.startdate;
    this.filterData.todate = this.addcomp2.value.enddate;

    if (!this.addcomp2.value.user) {
      this.filterData.userMasterID = this.selected;
    } else {
      this.filterData.userMasterID = this.addcomp2.value.user;
    }

   

      this.getAllData();

  }

  onChange(e: any) {
    if(e){
      this.filterData.page = e.offset + 1;
      this.getAllData();
    }
  }

  onLimitChange(ev: any) {
    if(ev){
      this.filterData.limit = ev;
      this.getAllData();
    }
  }

  export() {
    this.filterData.exportData = 'true'

    this.spinner.start('a');
    this.api
      .callApi(this.constant.GETALLDAILYTASK_V2, this.filterData, 'POST', true, true, true, true)
      .subscribe(
        (res: any) => {
          if (res.type == 'application/json') {
            this.notifications.create('No data found to export!', '', NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, `DailyTask.xlsx`);

            this.spinner.stop('a');
          }
        },
        (err) => {
          this.notifications.create(
            '',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('a');
        },
      );
  }

  clear() {
    this.addcomp2.resetForm();
    this.formValueStorageService.removeComponentData('TeamDailyReportComponent', false);
    this.userFormValueStorageService.removeData();
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  onActivate(event) {
    if (event.type == 'click') {
      this.display = false;
    }
    if (event.cellIndex == 1) {
      this.formValueStorageService.addData('TeamDailyReportComponent', this.filterData);
      this.userFormValueStorageService.navigate('/userprofile', event.row.userMaster.userMasterID);
    }
  }
}
