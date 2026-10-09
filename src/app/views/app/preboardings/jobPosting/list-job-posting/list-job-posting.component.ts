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
    selector: 'app-list-job-posting',
    templateUrl: './list-job-posting.component.html',
    styleUrls: ['./list-job-posting.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListJobPostingComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  elementType = 'url' as const;
  correctionLevel = 'H' as const;
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
  // filterData = {
  //   page: 1,
  //   limit: 10,
  //   userMasterID: '',
  //   companyMasterID: '',
  //   startdate: '',
  //   enddate: '',
  // };
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
  usertype: any;
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
  users_Body = {
    companyMasterID: '',
    branchMasterID: [],
    departmentId: [],
    designationId: [],
    page: 1,
    limit: 10,
    searchQuery: ''
  }
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
            this.adminRoot + '/preboardings/jobPosting',
            this.adminRoot + '/preboardings/jobPosting/edit_jobPosting',
          ];

          const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
          if (!isProtectedRoute) {
            formValueStorageService.removeData('ListJobPostingComponent', false);
          }
        }
      });
    }
  }

  ngOnInit() {
    this.company_id = +localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();

    this.users_Body = {
      companyMasterID: '',
      branchMasterID: [],
      departmentId: [],
      designationId: [],
      page: 1,
      limit: 10,
      searchQuery: ''
    }

    this.selectcompany(this.company_id);

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

  getJobPostingData() {
    if (this.isResetForm) return;

    this.users_Body.branchMasterID = this.users_Body.branchMasterID && this.users_Body.branchMasterID.length > 0 ? this.users_Body.branchMasterID : null
    this.users_Body.departmentId = this.users_Body.departmentId && this.users_Body.departmentId.length > 0 ? this.users_Body.departmentId : null
    this.users_Body.designationId = this.users_Body.designationId && this.users_Body.designationId.length > 0 ? this.users_Body.designationId : null

    this.spinner.start('users');
    this.api
      .callApi(this.constant.LISTJOBPOSTING, this.users_Body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          // this.showForm = true;
          this.selectAllForDropdownItems(this.rows);
        }
        this.spinner.stop('users');
      });
  }

  selectcompany(id: any) {
    this.rows = [];
    this.allbranch = [];
    this.alldepartment = [];
    this.alldesignation = []
    this.selectedBranch = [];
    this.selectedDepartment = [];
    this.selecteddesig = [];

    this.users_Body = {
      companyMasterID: '',
      branchMasterID: null,
      departmentId: null,
      designationId: null,
      page: 1,
      limit: 10,
      searchQuery: ''
    }

    if (!id) return;
    this.isResetForm = false;


    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.selectAllForDropdownItems(this.allbranch);
        this.spinner.stop('branch');
      });

    this.spinner.start('dep');
    this.api
      .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.alldepartment = res.data;
        this.selectAllForDropdownItems(this.alldepartment);
        this.spinner.stop('dep');
      });

    this.spinner.start('desig')
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;
          this.selectAllForDropdownItems(this.alldesignation);

          // this.page.totalCount = res.totalcount;
          this.spinner.stop('desig');
        }
      });

    this.users_Body.companyMasterID = id;
    this.getJobPostingData();
  }

  selectbranch() {
    this.rows = [];
    this.users_Body.branchMasterID = this.datefilter.value.branch;
    this.getJobPostingData();
  }

  selectdepartment() {
    this.rows = [];
    this.users_Body.departmentId = this.datefilter.value.department;
    this.getJobPostingData();
  }

  selectdesig() {
    this.rows = [];
    this.users_Body.designationId = this.datefilter.value.designation;
    this.getJobPostingData();
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
              permissionval.formName == 'JobPosting' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'JobPosting' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'JobPosting' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'JobPosting' &&
              permissionval.operationName.includes('Create')
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
    if (!this.datefilter.valid) {
      return;
    }
    this.users_Body.page = 1;
    this.users_Body.limit = 10;
    this.getJobPostingData();
  }


  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.users_Body.page = e.offset + 1;
      this.getJobPostingData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.users_Body.limit = ev;
      this.limit = this.users_Body.limit;
      this.getJobPostingData();
    } else {
      console.log('error');
    }
  }

  clear() {
    this.isResetForm = true;
    this.datefilter.resetForm();

    setTimeout(() => {
      this.rows = [];
      this.users_Body = {
        companyMasterID: '',
        branchMasterID: [],
        departmentId: [],
        designationId: [],
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
    this.isResetForm = false;
  }

  download() {
    let body1 = {
      page: '',
      limit: '',
      companyMasterID: this.users_Body.companyMasterID,
      branchMasterID: this.users_Body.branchMasterID,
      departmentId: this.users_Body.departmentId,
      designationId: this.users_Body.designationId,
      searchQuery: this.users_Body.searchQuery,
      exportData: true,
    };

    this.spinner.start('start');
    this.api
      .callApi(this.constant.LISTJOBPOSTING, body1, 'POST', true, false, true, true)
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
    saveAs(blob, 'Job Posts.xlsx');
    this.spinner.stop('start');
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/preboardings/jobPosting/add_jobPosting']);
  }
  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.users_Body.searchQuery = '';
      setTimeout(() => {
        this.getJobPostingData();
      }, 100);
    } else {
      this.users_Body.searchQuery = inputValue;
      this.getJobPostingData();
    }
  }
  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListJobPostingComponent',
      this.users_Body,
      '/preboardings/jobPosting/edit_jobPosting',
      rowData.jobPostingID,
    );
  }

  alertConfirmation(jobPostingID: any) {
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
          jobPostingID: jobPostingID,
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETEJOBPOSTING, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.getJobPostingData()
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

  showdata(jobPostingID: any) {

    let queryString = `?jobPostingID=${jobPostingID}`;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETJOBPOSTINGBYID + queryString, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.editData = res.data;
          this.editData.url = environment.appUrl2 + this.editData.secretKey;
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.handleError(err.error.message);
        },
      );
  }
  public downloadQRCode(i: any) {
    const fileNameToDownload = 'image_qrcode';

    const base64Img = document.getElementsByClassName('coolQRCode')[0].children[0]['src'];
    fetch(base64Img)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileNameToDownload;
        link.click();
      });
  }
  copyToClipboard(value: string) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        this.notifications.create('Done', 'Link Copied', NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: true,
        });
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }
}

