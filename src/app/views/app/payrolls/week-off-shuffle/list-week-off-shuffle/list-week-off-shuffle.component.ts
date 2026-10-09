import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';


@Component({
    selector: 'app-list-week-off-shuffle',
    templateUrl: './list-week-off-shuffle.component.html',
    styleUrls: ['./list-week-off-shuffle.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListWeekOffShuffleComponent implements OnInit {

  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];

  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode.force;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: null,
    userMasterID: '',
    searchQuery: '',
    exportData: '',
    enddate: '',
    startdate: '',
  };

  page = {
    totalCount: 0,
    offset: 0,
  };

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;

  currentPage: number;
  adminRoot = environment.adminRoot;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/payrolls/weekoff_shuffle',
          this.adminRoot + '/payrolls/weekoff_shuffle/edit_weekoff_shuffle',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListWeekOffShuffleComponent', false);
        }
      }
    })
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListWeekOffShuffleComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: Number(localStorage.getItem('company_id')),
        userMasterID: '',
        searchQuery: '',
        enddate: '',
        startdate: '',
        exportData: ''
      };
    } else {
      this.filterData = this.formValue.ListWeekOffShuffleComponent.body;
    }
    this.checkpermission();

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

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
              permissionval.formName == 'WeekOffShuffle' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'WeekOffShuffle' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'WeekOffShuffle' &&
              permissionval.operationName.includes('View')
            );
          });
          
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'WeekOffShuffle' &&
              permissionval.operationName.includes('Create')
            );
          });

          this.spinner.stop();
        }
      });
  }


  onSubmit(val: any) {
    this.filterData.userMasterID = val?.user;
    this.filterData.companyMasterID = val?.company;
    this.filterData.startdate = val?.startdate;
    this.filterData.enddate = val?.enddate;
    this.getData();
  }

  getData() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETWEEKOFFSHUFLLE, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            if(this.rows.length > 0){
              this.showButtons.push(CommonFilterButtonFields.Excel);
            }else{
              this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
            }
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            }, 100);
            this.spinner.stop('data');
          } else {
            this.handleCatchError('res.message');

            this.spinner.stop('data');
          }
        },
        (err) => {
          this.handleCatchError(err.error.message);
          this.spinner.stop('data');
        },
      );
  }

  handleCatchError(message: string) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 2000,
      showProgressBar: false,
    });
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  clear() {
    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: null,
      userMasterID: '',
      searchQuery: '',
      exportData: '',
      enddate: '',
      startdate: '',
    };
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
    this.rows = []
    this.formValueStorageService.removeData('ListWeekOffShuffleComponent', false);
  }


  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();

    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getData();
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/payrolls/weekoff_shuffle/add_weekoff_shuffle']);
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListWeekOffShuffleComponent',
      this.filterData,
      '/payrolls/weekoff_shuffle/edit_weekoff_shuffle',
      rowData.weekoffShuffleId,
    );
  }


  downloadFile(val: any) {
    let body: any = {}
    body.page =  1;
    body.limit = 10;
    body.searchQuery =  '';
    body.exportData =  true;

    if(val?.user.length > 0)
      body.userMasterID = val?.user
    if(val?.startdate)
      body.startdate = val?.startdate;
    if(val?.enddate)
      body.enddate = val?.enddate;
    this.spinner.start('download');

    this.api
      .callApi(this.constant.GETWEEKOFFSHUFLLE, body, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('download');
        },
      );
  }

  alertConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETEWEEKOFFSHUFLLE + +id, {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getData();
                this.spinner.stop('confirm');
              } else {
                this.handleError(res.message);
                this.spinner.stop('confirm');
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('confirm');
            },
          );
      }
    });
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Weekoff Shuffle.xlsx');
    this.spinner.stop('download');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extracts YYYY-MM-DD
  }

  getCompany(companyMasterID: number){
    this.filterData.companyMasterID = companyMasterID;
    this.getData()
  }

}