import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { UserFormValueStorageService } from 'src/app/services/user-form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
@Component({
    selector: 'app-list-user-ip',
    templateUrl: './list-user-ip.component.html',
    styleUrls: ['./list-user-ip.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListUserIpComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [
    'TaskName',
    'TaskDescription',
    'attachment',
    'priority',
    'tasktype',
    'tasks_stage',
    'taskStatus',
  ];
  SelectionType = SelectionType;
  tabledata = [
    'TaskName',
    'TaskDescription',
    'attachment',
    'priority',
    'tasktype',
    'startDate',
    'startTime',
    'endDate',
    'tasks_stage',
    'taskStatus',
  ];
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    searchQuery: '',
    companyMasterID: +localStorage.getItem('company_id'),
    userMasterID: [],

  };

  page = {
    totalCount: 0,
    offset: 0,
  };

  events: any;
  getStatus: any;
  userid: any = [];
  export: any;
  authdata: any;
  childcompany: any;
  rows1: any;
  allcomp: any;
  userID: any;
  dataprogess: any;
  referencedata: any;
  displayName: any;
  finalbranch: any;
  alldepartment: any;
  allbranch: any;
  ownerList: any;
  finalholidaypolicy: any;
  empList: any;
  excelevents: any;
  permissioncreate: any = [1];
  permissionedit: any = [1];
  permissionview: any = [1];
  permissiondelete: any = [1];
  limit = 10;
  usertype: any;
  company_id: any;
  selectedemp: any;
  allStages: any;
  finalstage: string;
  TaskINFO: any;
  TaskRemarks: any = [];
  adminRoot = environment.adminRoot;
  selectedValue: any;

  currentPage: number;
  formValue: any;
  display: boolean;
  // alldepartment: any[];
  selectedbranch: any;
  selecteddept: any;
  selecteddesig: any;
  allWorkingArea: any[];
  alldesignation: any[];
  allDivision: any[];
  selectedDivision: null;
  selectedWorkingArea: null;
  selectedEmployees: any = [];
  employee: any = [];

  users_Body = {
    companyMasterID: '',
    branchMasterID: '',
    departmentID: '',
    designationID: '',
    divisionId: '',
    workingAreaId: ''
  }
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private notifications: AppNotificationService,
    private userFormValueStorageService: UserFormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };


    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/masters/userIp',
          this.adminRoot + '/masters/userIp/edit_userIp',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListUserIpComponent', false);
        }
      }
    });

  }
  ngOnInit() {
    this.checkpermission()
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.userid = localStorage.getItem('id');
    this.childcompany = localStorage.getItem('childcompany');


    this.formValue = this.formValueStorageService.getData();
    this.getData();

    this.users_Body = {
      companyMasterID: '',
      branchMasterID: '',
      departmentID: '',
      designationID: '',
      divisionId: '',
      workingAreaId: ''
    }

    this.filterData = {
      page: 1,
      limit: 10,
      searchQuery: '',
      userMasterID: [],
      companyMasterID: +localStorage.getItem('company_id'),
    };
    if (this.formValueStorageService.isEmptyComponent('ListUserIpComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        searchQuery: '',
        userMasterID: [],
        companyMasterID: +localStorage.getItem('company_id'),
      };
    } else {
      this.filterData = this.formValue.ListUserIpComponent;
    }


    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.selectcompany(this.company_id);
    this.getcompany();
    this.selectcompany(this.company_id);
    this.getData();

  }

  getData() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETUSERIP, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
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
              permissionval.formName == 'IPWhitelisting' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'IPWhitelisting' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'IPWhitelisting' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'IPWhitelisting' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
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

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/masters/userIp/add_userIp']);
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
          useripID: id,
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETETASK1, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.getData();
            this.spinner.stop('confirm');
          },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop('confirm');
          },
        );
      }
    });
  }

  clear() {
    this.datefilter.resetForm();
    this.formValueStorageService.removeComponentData('ListUserIpComponent', false);
    this.userFormValueStorageService.removeData();
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  changeshowfields() {
    this.ngOnInit();
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  // getcompany() {
  //   if (this.usertype == 2) {
  //     const body = {
  //       page: '',
  //       limit: '',
  //     };
  //     this.spinner.start('company');
  //     this.api.callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true).subscribe(
  //       (res: any) => {
  //         if (res.status == 200) {
  //           this.allcomp = res.data;
  //           this.spinner.stop('company');
  //         } else {
  //           this.handleError(res.message);
  //           this.spinner.stop('company');
  //         }
  //       },
  //       (err) => {
  //         this.handleError(err.error.message);
  //         this.spinner.stop('company');
  //       },
  //     );
  //   } else {
  //     const body = {
  //       companyMasterID: this.company_id,
  //     };
  //     this.spinner.start('company');
  //     this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
  //       (res: any) => {
  //         if (res.status == 200) {
  //           this.allcomp = res.data;
  //           this.spinner.stop('company');
  //         } else {
  //           this.handleError(res.message);
  //           this.spinner.stop('company');
  //         }
  //       },
  //       (err) => {
  //         this.handleError(err.error.message);
  //         this.spinner.stop('company');
  //       },
  //     );
  //   }
  // }


  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.allcomp = res.data;
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


  selectcompany(id) {
    this.filterData.userMasterID = null;
    this.alldepartment = []
    this.alldesignation = []
    this.allbranch = []
    this.allDivision = []
    this.allWorkingArea = []
    this.employee = []

    this.selectedbranch = null;
    this.selecteddept = null;
    this.selecteddesig = null;
    this.selectedDivision = null;
    this.selectedWorkingArea = null;

    this.users_Body = {
      companyMasterID: '',
      branchMasterID: '',
      departmentID: '',
      designationID: '',
      divisionId: '',
      workingAreaId: ''
    }


    if (!id) return;
    this.spinner.start('depart')
    this.api
      .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldepartment = res.data;
          // this.filter = 'filt'

          // this.page.totalCount = res.totalcount;
          this.spinner.stop('depart');
        }
      });

    // getDesignationData() {}
    this.spinner.start('desig')
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;

          // this.page.totalCount = res.totalcount;
          this.spinner.stop('desig');
        }
      });

    this.spinner.start('branch')

    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;

        // this.page.totalCount = res.totalcount;
        this.spinner.stop('branch');
      });

    this.spinner.start('workingArea');
    this.api
      .callApi(this.constant.LISTWORKINGAREA + "?companyMasterID=" + id + "&status=1", {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allWorkingArea = res.data;

        // this.page.totalCount = res.totalcount;
        this.spinner.stop('workingArea');
      });

    this.spinner.start('Division');
    this.api
      .callApi(this.constant.LISTDIVISION + "?companyMasterID=" + id + "&status=1", {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allDivision = res.data;
         
        this.spinner.stop('Division');
      });

    this.users_Body.companyMasterID = id;
    this.getUsers();
  }



  selectbranch(id) {
    this.filterData.userMasterID = null;
    this.employee = [];
    this.selectedEmployees = [];
    this.users_Body.branchMasterID = id;
    this.getUsers();
  }

  selectdepart(id) {
    this.filterData.userMasterID = null;
    this.employee = [];
    this.selectedEmployees = [];
    this.users_Body.departmentID = id;
    this.getUsers();


  }

  selectdesig(id) {
    this.filterData.userMasterID = null;
    this.employee = [];
    this.selectedEmployees = [];
    this.users_Body.designationID = id;
    this.getUsers();
  }


  selectdivision(id) {
    this.filterData.userMasterID = null;
    this.employee = [];
    this.selectedEmployees = [];
    this.users_Body.divisionId = id;
    this.getUsers();
  }

  selectWorkingArea(id) {
    this.filterData.userMasterID = null;
    this.employee = [];
    this.selectedEmployees = [];
    this.users_Body.workingAreaId = id;
    this.getUsers();
  }


  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.companyMasterID = +this.datefilter.value.company;

    if (this.filterData.userMasterID.length > 0) {
      this.filterData.userMasterID = this.datefilter.value.userMasterID;
    }


    this.getData();
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

  // download() {
  //   if (!this.selectedValue && this.selectedValue == null) {
  //     return;
  //   }

  //   let body1 = {
  //     page: '',
  //     limit: '',
  //     searchQuery: this.filterData.searchQuery,
  //     companyMasterID: this.filterData.companyMasterID,
  //     userMasterID: this.filterData.userMasterID,
  //     exportData: true,
  //     exportFileType: this.selectedValue,
  //   };

  //   this.spinner.start('download');
  //   this.api
  //     .callApi(this.constant.GETUSERIP, body1, 'POST', true, false, true, true)
  //     .subscribe(
  //       (res: any) => {
  //         if (this.selectedValue == 'csv') {
  //           var blob = new Blob([res], { type: 'text/csv' });
  //           saveAs(blob, 'Task.csv');
  //         } else {
  //           var blob = new Blob([res], { type: 'text/xlsx' });
  //           saveAs(blob, 'Task.xlsx');
  //         }
  //         this.spinner.stop('download');
  //       },
  //       (err) => {
  //         this.handleError(err.error.message);
  //         this.spinner.stop('download');
  //       },
  //     );
  // }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.addData('ListUserIpComponent', this.filterData);
    this.userFormValueStorageService.navigate('/masters/userIp/edit_userIp', rowData.useripID);
  }

  onActivate(event) {
    if (event.type == 'click') {
      this.display = false;
    }
    if (event.cellIndex == 1) {
      this.formValueStorageService.addData('ListUserIpComponent', this.filterData);
      this.userFormValueStorageService.navigate('/userprofile', event.row.userMasterID);
    }
  }


  getUsers() {

    this.spinner.start('users');
    this.api
      .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          this.selectAllForDropdownItems(this.employee);
        }
        this.spinner.stop('users');
      });
  }


  downloadFile() {
    let body1 = {
      page: '',
      limit: '',
      searchQuery: this.filterData.searchQuery,
      companyMasterID: this.filterData.companyMasterID,
      userMasterID: this.filterData.userMasterID,
      Export: true,
    };

    this.spinner.start('download');
    this.api
      .callApi(this.constant.GETUSERIP, body1, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('download');
        },
      );
  }


  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Users Ip Adress.xlsx');
    this.spinner.stop('download');
  }
}


