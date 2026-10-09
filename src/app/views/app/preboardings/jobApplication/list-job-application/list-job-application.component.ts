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
    selector: 'app-list-job-application',
    templateUrl: './list-job-application.component.html',
    styleUrls: ['./list-job-application.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListJobApplicationComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('closeModal1') closeModal: ElementRef;
  @ViewChild('acceptJobApplicationForm') acceptJobApplicationForm: NgForm;
  @ViewChild('lgModal1') lgModal1;
  @ViewChild('lgModal2') lgModal2;
  @ViewChild('rejectJobApplicationForm') rejectJobApplicationForm: NgForm;
  @ViewChild('closeModal2') closeModal1: ElementRef;
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
    companyMasterID: localStorage.getItem('company_id'),
    branchMasterID: [],
    departmentId: [],
    designationId: [],
    jobPostingID: [],
    page: 1,
    limit: 10,
    searchQuery: '',
    jobApplicationStatus: null
  }
  selecteddesig: any[];
  selectedDepartment: any[];

  selectedBranch: any[];
  isResetForm: boolean = false;
  adminRoot = environment.adminRoot;
  editData: any;
  alljobpost: any;
  selectedJobPost: any[];
  jobApplicationID: any;
  selectedInterViewType: any
  selectedJobAppicationStatus: any
  allForm: any[];

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
  }

  ngOnInit() {
    this.company_id = +localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();

    this.users_Body = {
      companyMasterID: localStorage.getItem('company_id'),
      branchMasterID: [],
      departmentId: [],
      designationId: [],
      jobPostingID: [],
      page: 1,
      limit: 10,
      searchQuery: '',
      jobApplicationStatus: null
    }
    this.getApplicationData();
    this.selectcompany(this.company_id);

  }


  getcompany() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.company1 = res.data;
            this.spinner.stop();
          }
        });
    } else {
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
  }

  getApplicationData() {
    if (this.isResetForm) return;
        
    this.users_Body.companyMasterID = this.company_id;
    this.users_Body.branchMasterID = this.users_Body.branchMasterID && this.users_Body.branchMasterID.length > 0 ? this.users_Body.branchMasterID : null
    this.users_Body.departmentId = this.users_Body.departmentId && this.users_Body.departmentId.length > 0 ? this.users_Body.departmentId : null
    this.users_Body.designationId = this.users_Body.designationId && this.users_Body.designationId.length > 0 ? this.users_Body.designationId : null
    this.users_Body.jobPostingID = this.users_Body.jobPostingID && this.users_Body.jobPostingID.length > 0 ? this.users_Body.jobPostingID : null
    this.users_Body.jobApplicationStatus = this.users_Body.jobApplicationStatus ? this.users_Body.jobApplicationStatus : null

    this.spinner.start('users');
    this.api
      .callApi(this.constant.LISTJOBAPPLICATION, this.users_Body, 'POST', true, false, true)
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
          this.alljobpost = res.data;
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
    this.alljobpost = [];
    this.selectedJobPost = [];
    this.allForm = [];
    this.selectedJobAppicationStatus = null
    this.users_Body = {
      companyMasterID: localStorage.getItem('company_id'),
      branchMasterID: null,
      departmentId: null,
      designationId: null,
      jobPostingID: null,
      page: 1,
      limit: 10,
      searchQuery: '',
      jobApplicationStatus: ''
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
    const body = { companyMasterID: id };
    this.spinner.start('preboardingForm');
    this.api
      .callApi(this.constant.GETPREBOARDINGMASTER, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allForm = res.data;
          this.spinner.stop('preboardingForm');
        } else {
          this.spinner.stop('preboardingForm');
        }
      });
    this.users_Body.companyMasterID = id;

    this.getJobPostingData()
  }

  selectbranch() {
    this.rows = [];
    this.users_Body.branchMasterID = this.datefilter.value.branch;
    this.getApplicationData();
    this.getJobPostingData()
  }

  selectdepartment() {
    this.rows = [];
    this.users_Body.departmentId = this.datefilter.value.department;
    this.getApplicationData();
    this.getJobPostingData()

  }

  selectdesig() {
    this.rows = [];
    this.users_Body.designationId = this.datefilter.value.designation;
    this.getApplicationData();
    this.getJobPostingData()
  }
  selectdedJobPost() {
    this.rows = [];
    this.users_Body.jobPostingID = this.datefilter.value.jobpost;
    this.getApplicationData();
  }
  selectApplicationStatus() {
    this.rows = [];
    this.users_Body.jobApplicationStatus = this.datefilter.value.jobApplicationStatus;
    this.getApplicationData();
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
              permissionval.formName == 'JobApplication' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'JobApplication' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'JobApplication' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'JobApplication' &&
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
    this.getApplicationData();
  }


  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.users_Body.page = e.offset + 1;
      this.getApplicationData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.users_Body.limit = ev;
      this.limit = this.users_Body.limit;
      this.getApplicationData();
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
        companyMasterID: localStorage.getItem('company_id'),
        branchMasterID: [],
        departmentId: [],
        designationId: [],
        jobPostingID: [],
        page: 1,
        limit: 10,
        searchQuery: '',
        jobApplicationStatus: null
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
      jobPostingID: this.users_Body.jobPostingID,
      searchQuery: this.users_Body.searchQuery,
      jobApplicationStatus: this.users_Body.jobApplicationStatus,
      exportData: true,
    };

    this.spinner.start('start');
    this.api
      .callApi(this.constant.LISTJOBAPPLICATION, body1, 'POST', true, false, true, true)
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
    saveAs(blob, 'Job Applications.xlsx');
    this.spinner.stop('start');
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
      this.users_Body.searchQuery = '';
      setTimeout(() => {
        this.getApplicationData();
      }, 100);
    } else {
      this.users_Body.searchQuery = inputValue;
      this.getApplicationData();
    }
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
              this.getApplicationData()
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

  showdata(jobApplicationID: any) {
    let queryString = `?jobApplicationID=${jobApplicationID}`;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETJOBAPPLICATIONBYID + queryString, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.editData = res.data;
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.handleError(err.error.message);
        },
      );
  }
  getData(id: any) {
    this.jobApplicationID = id
  }
  openAcceptModalAndSubmit(id: any) {
    this.getData(id);
    this.lgModal1.show();
  }

  openRejectModalAndSubmit(id: any) {
    this.getData(id);
    this.lgModal2.show();
  }
  acceptJobApplication() {
    if (!this.acceptJobApplicationForm.valid) {
      return;
    }
    if (!this.jobApplicationID) return;

    const body = {
      jobApplicationID: this.jobApplicationID,
      jobApplicationStatus: 2,
      acceptRemarks: this.acceptJobApplicationForm.value.acceptRemarks,
      interViewType: this.selectedInterViewType,
      interViewDate: this.acceptJobApplicationForm.value.interViewDate,
      interViewTime: this.acceptJobApplicationForm.value.interViewTime,
      preboardingMasterID: this.acceptJobApplicationForm.value.preboardingMasterID,
      interViewLink: this.selectedInterViewType == 'virtual' ? this.acceptJobApplicationForm.value.interViewLink : null,
      interViewBranchMasterID: this.selectedInterViewType == 'inperson' ? this.acceptJobApplicationForm.value.interViewBranchMasterID : null,
    };
    this.spinner.start('acceptJobApplication');
    this.api
      .callApi(this.constant.JOBAPPLICATIONACCEPTREJECT, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create(
              'Done',
              res.message,
              NotificationType.Bare,
              {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              },
            );
            setTimeout(() => {
              this.selectedInterViewType == ''
              this.closeModal.nativeElement.click();
              this.acceptJobApplicationForm.resetForm();
              setTimeout(() => {
                this.getApplicationData();
              }, 1000);
              this.spinner.stop('acceptJobApplication');
            }, 200);
          } else {
            this.handleError(res.message);
            this.spinner.stop('acceptJobApplication');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('acceptJobApplication');
        },
      );
  }

  rejectJobApplication() {
    if (!this.rejectJobApplicationForm.valid) {
      return;
    }
    if (!this.jobApplicationID) return;
    const body = {
      jobApplicationID: this.jobApplicationID,
      jobApplicationStatus: 0,
      rejectionRemarks: this.rejectJobApplicationForm.value.rejectionRemarks,
      // coffMasterID:  this.authData.coffMasterID,
      companyMasterID: localStorage.getItem('company_id'),
      createBy: localStorage.getItem('id'),
    };

    this.spinner.start('rejectjobapplication');
    this.api
      .callApi(this.constant.JOBAPPLICATIONACCEPTREJECT, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create(
              'Done',
              res.message,
              NotificationType.Bare,
              {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              },
            );

            setTimeout(() => {
              this.closeModal1.nativeElement.click();
              this.rejectJobApplicationForm.resetForm();
              setTimeout(() => {
                this.getApplicationData();
              }, 1000);
              this.spinner.stop('rejectjobapplication');
            }, 200);

            this.spinner.stop('rejectjobapplication');
          } else {
            this.handleError(res.message);
            this.spinner.stop('rejectjobapplication');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('rejectjobapplication');
        },
      );
  }
}

