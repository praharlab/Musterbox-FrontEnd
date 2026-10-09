import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-resignation-task',
    templateUrl: './resignation-task.component.html',
    styleUrls: ['./resignation-task.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ResignationTaskComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('lgModal1') lgModal1: ElementRef;
  @ViewChild('closeModal') closeModal: ElementRef;

  adminRoot = environment.adminRoot;
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: localStorage.getItem('id'),
    user: [],
    searchQuery: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  rows1: any = [];
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  resignTaskAssignID: any;
  ipAddress: any;

  childcompany: string;
  cid: string;
  usertype: any;
  company_id: any;
  alluser: any;
  company1: any;
  employee: any;
  allbranch: any;

  allWorkingArea: any;
  alldesignation: any;
  alldepartment: any;
  allDivision: any;
  divisionfilter: any;
  departmentfilter: any;
  designationfilter: any;
  workingareafilter: any;
  selectedbranch: null;
  selecteddept: null;
  selecteddesig: null;
  selectedDivision: null;
  selectedWorkingArea: null;
  selectedEmployees: any = [];
  users_Body = {
    companyMasterID: '',
    branchMasterID: '',
    departmentID: '',
    designationID: '',
    divisionId: '',
    workingAreaId: '',
  };

  referenceData: any = [];
  userResignation: any = [];

  employeeComment: any;
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private http: HttpClient,
    private notifications: AppNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = +localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');

    this.getcompany();

    this.selectcompany(this.company_id);

    this.filterData = {
      page: 1,
      limit: 10,
      userMasterID: localStorage.getItem('id'),
      user: [],
      searchQuery: '',
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.rows1 = [];
    this.getData();
    this.checkpermission();
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

  selectcompany(id: any) {
    this.alldepartment = [];
    this.alldesignation = [];
    this.allbranch = [];
    this.allDivision = [];
    this.allWorkingArea = [];
    this.employee = [];

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
      workingAreaId: '',
    };

    if (!id) return;
    this.spinner.start('depart');
    this.api
      .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldepartment = res.data;
          this.spinner.stop('depart');
        }
      });

    this.spinner.start('desig');
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;
          this.spinner.stop('desig');
        }
      });

    this.spinner.start('branch');

    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.spinner.stop('branch');
      });

    this.spinner.start('workingArea');
    this.api
      .callApi(
        this.constant.LISTWORKINGAREA + '?companyMasterID=' + id + '&status=1',
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        this.allWorkingArea = res.data;
        this.spinner.stop('workingArea');
      });

    this.spinner.start('Division');
    this.api
      .callApi(
        this.constant.LISTDIVISION + '?companyMasterID=' + id + '&status=1',
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        this.allDivision = res.data;
        this.spinner.stop('Division');
      });

    this.users_Body.companyMasterID = id;
    this.getUsers();
  }

  selectbranch(id) {
    this.employee = [];
    this.selectedEmployees = [];
    this.rows = [];
    this.users_Body.branchMasterID = id;
    this.getUsers();
  }

  selectdepart(id) {
    this.employee = [];
    this.selectedEmployees = [];
    this.rows = [];
    this.users_Body.departmentID = id;
    this.getUsers();
  }

  selectdesig(id) {
    this.employee = [];
    this.selectedEmployees = [];
    this.rows = [];
    this.users_Body.designationID = id;
    this.getUsers();
  }

  selectdivision(id) {
    this.employee = [];
    this.selectedEmployees = [];
    this.rows = [];
    this.users_Body.divisionId = id;
    this.getUsers();
  }

  selectWorkingArea(id) {
    this.employee = [];
    this.selectedEmployees = [];
    this.rows = [];
    this.users_Body.workingAreaId = id;
    this.getUsers();
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  clear() {
    this.datefilter.resetForm();

    setTimeout(() => {
      this.rows = [];
      this.filterData = {
        page: 1,
        limit: 10,
        userMasterID: '',
        user: [],
        searchQuery: '',
      };
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.ngOnInit();
    }, 200);
  }

  getData() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLRESIGNTASK, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
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
              permissionval.formName == 'ResignationTask' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ResignationTask' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ResignationTask' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  Approve(id: any) {
    this.resignTaskAssignID = id;
  }
  Reject(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are going to Reject these Resignation',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          AuthorizationRequestId: id,
        };
        this.spinner.start();
        this.api.callApi(this.constant.REJECTRESIGNATION, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.getData();
            this.spinner.stop();
          },
          (err) => {
            this.spinner.stop();
          },
        );
      }
    });
  }

  onFilterSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.page = 1;
    this.filterData.user = this.datefilter.value.user;
    this.getData();
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }

    let body = {
      resignTaskAssignID: this.resignTaskAssignID,
      remarks: this.addcomp.value.remark,
      isApplicable: this.addcomp.value.isApplicable,
      isRecovered: this.addcomp.value.isRecovered ? this.addcomp.value.isRecovered : '',
      amount: this.addcomp.value.amount ? this.addcomp.value.amount : 0,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };

    this.spinner.start();
    this.api.callApi(this.constant.UPDATERESIGNTASK, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.closeModal.nativeElement.click();
            this.addcomp.reset();
            this.ngOnInit();
            this.spinner.stop();
          }, 3000);
        } else {
          this.closeModal.nativeElement.click();
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.closeModal.nativeElement.click();
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
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
  onSelect({ selected }): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.setSelectAllState();
  }

  setSelectAllState(): void {
    if (this.selected.length === this.rows.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.rows];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.getData();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.getData();
  }
  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/offboardings/add_tax_challan']);
  }

  showData(row) {
    this.api
      .callApi(
        this.constant.GETRESIGNATIONBYREFERENCEID + row.resignationID,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.referenceData = res.data;

            this.employeeComment = this.referenceData.employeeComment;

            var s = this.referenceData.employeeComment ? this.referenceData.employeeComment : '';
            var htmlObject = document.getElementById('employeeComment');
            htmlObject.innerHTML = s;
            this.spinner.stop();
          } else {
            this.handleError(res.message);
          }
        },
        (err) => {
          this.handleError(err.error.message);
        },
      );
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
