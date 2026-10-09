import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-employee-list',
    templateUrl: './employee-list.component.html',
    styleUrls: ['./employee-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeListComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
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
    companyMasterID: '',
    searchQuery: '',
    userMasterID: [],
  };
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
  limit = 10;
  usertype: any;
  company_id: any;
  alldepartment: any;
  company1: any;
  image: any;
  enddate: Date;
  export: any;
  employeedata: any;
  deptfilter: boolean = false;
  employee: any;
  selected3: any[];
  selected4: any[];
  selected: any[];
  finalbranch: string;
  allbranch: any;
  excel: any;

  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) {}

  ngOnInit() {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');

    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: localStorage.getItem('company_id'),
      searchQuery: '',
      userMasterID: [],
    };

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

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
              permissionval.formName == 'EmployeeMaster' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    if (
      this.datefilter.value.userMasterID == '' ||
      !this.datefilter.value.userMasterID ||
      this.datefilter.value.userMasterID == null
    ) {
      this.filterData.userMasterID = this.selected3;
    } else {
      this.filterData.userMasterID = this.datefilter.value.userMasterID;
    }
    this.filterData.companyMasterID = this.datefilter.value.company;

    this.spinner.start('onSubmit');
    this.api
      .callApi(this.constant.GETALLUSERS, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            this.spinner.stop('onSubmit');
          } else {
            this.handleError(res.message);
            this.spinner.stop('onSubmit');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('onSubmit');
        },
      );
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.onSubmit();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.onSubmit();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  selectcompany(id) {
    this.selected = [];
    this.finalbranch = '';
    this.allbranch = [];
    this.employee = [];

    if (id) {
      this.company_id = id;

      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
          this.spinner.stop('branch');
        });

      let bb = {
        page: '',
        limit: '',
        companyMasterID: id,
      };
      this.spinner.start('compcont');
      this.api
        .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.employee = res.data;
            this.selectAllForDropdownItems(this.employee);
            let data1 = [];
            this.employee.forEach(async (rating) => {
              data1.push(rating.userMasterID);
            });
            this.selected3 = data1;
          }
          this.spinner.stop('compcont');
        });
    }
  }

  selectbranch(event) {
    this.selected = [];

    if (event) {
      const filterData = {
        companyMasterID: this.company_id,
        branchMasterID: event,
      };
      this.spinner.start('getalc');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.employee = res.data;
            this.selectAllForDropdownItems(this.employee);
            // this.ownerList.map((el) => {
            //   el.name =
            //     el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')'
            // })
            let data1 = [];
            this.employee.forEach(async (rating) => {
              data1.push(rating.userMasterID);
            });
            this.selected3 = data1;
          }
          this.spinner.stop('getalc');
        });
    } else {
      const filterData = {
        companyMasterID: this.company_id,
      };
      this.spinner.start('alluser');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.employee = res.data;
            this.selectAllForDropdownItems(this.employee);
            // this.ownerList.map(el => {
            //   el.name = el.firstName + " " + el.lastName + " (" + el.userNumber + ")"
            // })
            let data1 = [];
            this.employee.forEach(async (rating) => {
              data1.push(rating.userMasterID);
            });
            this.selected3 = data1;
          }
          this.spinner.stop('alluser');
        });
    }
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  editimage(image) {
    this.image = image.facePhoto;
  }

  downloadFile() {
    if (
      this.datefilter.value.userMasterID == '' ||
      !this.datefilter.value.userMasterID ||
      this.datefilter.value.userMasterID == null
    ) {
      this.filterData.userMasterID = this.selected3;
    } else {
      this.filterData.userMasterID = this.datefilter.value.userMasterID;
    }
    this.filterData.companyMasterID = this.datefilter.value.company;

    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.excel = res.data;
          let data = [];
          for (var i = 0; i < this.excel.length; i++) {
            const data1 = {
              userMasterID: this.excel[i].userMasterID,
              Name: this.excel[i].displayName,
              userNumber: this.excel[i].userNumber,
              gender: this.excel[i].gender,
              // dob: this.excel[i].dob,
              email: this.excel[i].email,
              joiningdate: '',
              biometric_code: '',
              biometric_serial_no: '',
              branch: '',
              department: '',
              designation: '',
            };

            if (this.excel[i].empJoining) {
              data1.joiningdate = this.excel[i].empJoining.joiningDate;
              data1.biometric_code = this.excel[i].empJoining.biometricCode;
              data1.biometric_serial_no = this.excel[i].empJoining.biometricSerialNo;
            }
            if (this.excel[i].branchName) {
              data1.branch = this.excel[i].branchName;
            }
            if (this.excel[i].departmentName) {
              data1.department = this.excel[i].departmentName;
            }
            if (this.excel[i].designationName) {
              data1.designation = this.excel[i].designationName;
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
          saveAs(blob, 'employeeList.csv');
          this.spinner.stop();
        }
      });
  }

  clear() {
    this.datefilter.resetForm();
    this.rows = [];
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
}
