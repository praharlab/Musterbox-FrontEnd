import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-grade',
    templateUrl: './list-grade.component.html',
    styleUrls: ['./list-grade.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListGradeComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = ['GradeName', 'GradeFrom', 'GradeTo', 'Contractor', 'Company', 'Status'];
  tabledata = [
    'GradeId',
    'GradeName',
    'GradeFrom',
    'GradeTo',
    'Company',
    'applicableYYYYMM',
    'skillCategory',
    'Status',
    'CreateBy',
    'CreateByIp',
    'CreatedAt',
    'updateBy',
    'UpdateByIp',
    'UpdatedAt',
  ];
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: [+localStorage.getItem('company_id')],
    searchQuery: '',
  };
  limit = 10;
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  adminRoot = environment.adminRoot;
  comp: any;

  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/masters/grade',
          this.adminRoot + '/masters/grade/edit_grade',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListGradeComponent', false);
        }

        // clone add
        const protectedRoutesClone = [
          this.adminRoot + '/masters/grade',
          this.adminRoot + '/masters/grade/add_grade',
        ];

        const isProtectedRouteClone = protectedRoutesClone.some((route) =>
          event.url.includes(route),
        );
        if (!isProtectedRouteClone) {
          formValueStorageService.removeData('grade_cloneData', true);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    if (
      this.formValueStorageService.isEmptyObject('ListGradeComponent') &&
      this.formValueStorageService.isEmptyObject('grade_cloneData')
    ) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: [+localStorage.getItem('company_id')],
        searchQuery: '',
      };
    } else {
      // this.filterData = this.formValue.ListGradeComponent.body;
      this.filterData =
        this.formValue.ListGradeComponent && this.formValue.ListGradeComponent.body
          ? this.formValue.ListGradeComponent.body
          : this.formValue.grade_cloneData && this.formValue.grade_cloneData.body
          ? this.formValue.grade_cloneData.body
          : {
              page: 1,
              limit: 10,
              companyMasterID: [+localStorage.getItem('company_id')],
              searchQuery: '',
            };
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getgrade();
    this.checkpermission();
    this.getcompany();
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

  getgrade() {
    this.spinner.start('main');
    this.api.callApi(this.constant.GETGRADE, this.filterData, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
          this.spinner.stop('main');
        } else {
          this.handleError(res.message);
          this.spinner.stop('main');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('main');
      },
    );
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
              permissionval.formName == 'Grade' && permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Grade' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Grade' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Grade' && permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getgrade();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getgrade();
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.companyMasterID = this.datefilter.value.companyMasterID;
    this.getgrade();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getgrade();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getgrade();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.formValueStorageService.removeData('grade_cloneData', true);
    this.router.navigate([this.adminRoot + '/masters/grade/add_grade']);
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
        const body = {
          gradeStructureID: id,
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETEGRADE, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getgrade();
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

  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          gradeStructureID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api.callApi(this.constant.GRADESTATUSCHANGE, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getgrade();
              this.spinner.stop('deactive');
            } else {
              this.handleError(res.message);
              this.spinner.stop('deactive');
            }
          },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop('deactive');
          },
        );
      }
    });
  }
  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          gradeStructureID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api.callApi(this.constant.GRADESTATUSCHANGE, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.getgrade();
            this.spinner.stop('active');
          },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop('active');
          },
        );
      }
    });
  }

  clear() {
    this.datefilter.resetForm();

    this.formValueStorageService.removeData('ListGradeComponent', false);
    this.formValueStorageService.removeData('grade_cloneData', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListGradeComponent',
      this.filterData,
      '/masters/grade/edit_grade',
      rowData.gradeStructureID,
    );
  }

  navigateToClonePage(gradeStructureID: any): void {
    this.formValueStorageService.navigate(
      'grade_cloneData',
      this.filterData,
      '/masters/grade/add_grade',
      gradeStructureID,
    );
  }
}
