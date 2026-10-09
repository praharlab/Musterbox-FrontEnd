import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import * as xlsx from 'xlsx';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';


@Component({
    selector: 'app-list-job-role-classification',
    templateUrl: './list-job-role-classification.component.html',
    styleUrls: ['./list-job-role-classification.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListJobRoleClassificationComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  rows1 = [];
  selected: any = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: +localStorage.getItem('company_id'),
    searchQuery: ''
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  filter: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  company_id: any;
  alluser: any;
  company1: any;
  designation1: any;
  image: any;
  target: any;
  resultColumns: any[];
  resultColumns1: any[];
  childcompany: string;
  selected1: any = [];
  companydata: any;
  allasset: any = [];
  selected2: any = [];
  salary: boolean;
  companymasterName: any;
  public users: Array<any> = [];
  employee: any;
  allbranch: any;
  branchfilter: boolean = false;
  employeedata: any;
  currentPage: number;


  alldesignation: any;
  alldepartment: any;
  divisionfilter: any;
  departmentfilter: any;
  designationfilter: any;
  workingareafilter: any;
  selecteddesig: any[];
  selectedDepartment: any[];

  selectedBranch: any[];
  isResetForm: boolean = false;
  adminRoot = environment.adminRoot;
  editData: any;


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
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
    {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          const protectedRoutes = [
            this.adminRoot + '/masters/jobRoleClassification',
            this.adminRoot + '/masters/jobRoleClassification/edit_jobRoleClassification',
          ];

          const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
          if (!isProtectedRoute) {
            formValueStorageService.removeData('ListJobRoleClassificationComponent', false);
          }
        }
      });
    }
  }

  ngOnInit() {
    this.getcompany();
    // this.company_id = +localStorage.getItem('company_id');
    this.checkpermission();
    this.getJobRoleClassificationData();
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
              permissionval.formName == 'JobRoleType' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'JobRoleType' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'JobRoleType' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'JobRoleType' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }


  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
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
  getJobRoleClassificationData() {
    this.spinner.start('users');
    this.api
      .callApi(this.constant.LISTJOBROLECLASSIFICATION, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
        }
        this.spinner.stop('users');
      });
  }
  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.page = 1;
    this.filterData.limit = 10;
    this.getJobRoleClassificationData();
  }
  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/masters/jobRoleClassification/add_jobRoleClassification/']);
  }
  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getJobRoleClassificationData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getJobRoleClassificationData();
    } else {
      console.log('error');
    }
  }
  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getJobRoleClassificationData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getJobRoleClassificationData();
    }
  }
  clear() {
    this.datefilter.resetForm();

    setTimeout(() => {
      this.rows = [];
      this.filterData = {
        companyMasterID: +localStorage.getItem('company_id'),
        page: 1,
        limit: 10,
        searchQuery: ''

      }
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.ngOnInit();
    }, 200);
  }
  download() {
    let body1 = {
      page: '',
      limit: '',
      companyMasterID: this.filterData.companyMasterID,
      searchQuery: this.filterData.searchQuery,
      exportData: true,
    };

    this.spinner.start('start');
    this.api
      .callApi(this.constant.LISTJOBROLECLASSIFICATION, body1, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Job Role Classification.xlsx');
    this.spinner.stop('start');
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
      'ListJobRoleClassificationComponent',
      this.filterData,
      '/masters/jobRoleClassification/edit_jobRoleClassification/',
      rowData.jobRoleClassificationID,
    );
  }

  alertConfirmation(jobRoleClassificationID: any) {
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
          jobRoleClassificationID: jobRoleClassificationID,
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETEJOBROLECLASSIFICATION, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.getJobRoleClassificationData()
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
}
