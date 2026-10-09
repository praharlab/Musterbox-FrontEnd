import { Component, ViewChild, OnInit, ViewContainerRef, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-monthly-tax-deductions-of-employees',
    templateUrl: './monthly-tax-deductions-of-employees.component.html',
    styleUrls: ['./monthly-tax-deductions-of-employees.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MonthlyTaxDeductionsOfEmployeesComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  permissionview = []
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    branchMasterID: '',
    userMasterID: [],
    financialYear: ''
  }
  page = {
    totalCount: 0,
    offset: 0,
  };
  financialYears: any;
  selectedFiscalYear: any;
  company_id: any;
  permissionedit: any = [];
  permissiondelete: any = []
  company: any;
  allbranch: any;
  alluser: any;
  rows: any = [];
  yearmonth: any;
  currentmonth: number;
  edit: boolean = false
  deepCopy: any = [];
  ipAddress: any;
  query: string;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.checkpermission();
    this.company_id = +localStorage.getItem('company_id')
    this.getcompany();
    this.selectcompany(this.company_id);
    this.getFinancialYears();
    this.getIPAddress();

    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID:localStorage.getItem('company_id'),
      branchMasterID: '',
      userMasterID: [],
      financialYear: this.selectedFiscalYear
    }
    this.page = {
      totalCount: 0,
      offset: 0,
    };


  }

  checkpermission() {

    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.spinner.start('permission')
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;

          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MonthlyTaxDeductionsOfEmployees' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MonthlyTaxDeductionsOfEmployees' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'MonthlyTaxDeductionsOfEmployees' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.spinner.stop('permission');
        }
      });
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
          this.company = res.data;

          this.spinner.stop();
        }
      });

  }

  selectcompany(id: any) {
    if (!id) {
      this.allbranch = []
      this.alluser = []
    }

    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {

        this.allbranch = res;
        this.spinner.stop('branch');

      });

    const body = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start('contact');
    this.api
      .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;
          this.selectAllForDropdownItems(this.alluser);
          this.spinner.stop('contact');
        }
      });
  }

  selectbranch(id) {

    const filterData = {
      branchMasterID: id,
    };
    if (id) {
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);
            this.alluser.map((el) => {
              el.name = el.displayName;
            });
            this.spinner.stop();
          }
        });
    } else {

      const body = {
        page: '',
        limit: '',
        companyMasterID: this.datefilter.value.cid,
      };
      this.api
        .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);
          }
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


  getFinancialYears() {

    this.spinner.start('financialyear');
    this.api.callApi(this.constant.GETFINANCIALYEARS, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.financialYears = res.data
          // to selected current financial year
          this.selectedFiscalYear = this.financialYears[1]
          this.filterData.financialYear = this.selectedFiscalYear
          this.getData();

        } else {
          this.handleError('Something Went Wrong!');

        }
        this.spinner.stop('financialyear');
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('financialyear');
      },
    );

  }

  getData() {
    let queryString = `?page=${this.filterData.page}&limit=${this.filterData.limit}`
    if (this.filterData.companyMasterID) queryString += `&companyMasterID=${this.filterData.companyMasterID}`
    if (this.filterData.branchMasterID) queryString += `&branchMasterID=${this.filterData.branchMasterID}`
    if (this.filterData.userMasterID.length > 0) {
      this.filterData.userMasterID.map(e => {
        queryString += `&userMasterID[]=${e}`
      });
    }
    if (this.filterData.financialYear) queryString += `&financialYear=${this.filterData.financialYear}`
    this.query = queryString

    this.spinner.start('data')
    this.api
      .callApi(this.constant.GETMONTHLYTAXDEDUCTIONSOFEMPLOYEES + queryString, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
          }

          this.spinner.stop('data');
        },
        (err) => {
          this.handleError(err.error.message || 'Someting Went Wrong!');
          this.spinner.stop('data');
        },
      );

  }

  onSubmit() {
    if (!this.datefilter.valid) return
    this.filterData.companyMasterID = this.datefilter.value.cid
    this.filterData.branchMasterID = this.datefilter.value.branch
    this.filterData.financialYear = this.datefilter.value.financialYear
    this.filterData.userMasterID = this.datefilter.value.user ? this.datefilter.value.user : []
    this.getData();
  }


  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.page;
      this.getData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev
      this.getData();
    } else {
      console.log('error');

    }

  }

  clear() {
    this.datefilter.resetForm();
    setTimeout(() => {
      this.ngOnInit();
    }, 100);

  }

  editData(data: any) {
    data.editMode = true
  }
  cancelData(item: any, data: any) {
    this.getData();
  }


  saveData(item: any, data: any) {
    const body = {
      userMasterID: item.userMasterID,
      yearMonth: data.yearMonth,
      previousMonth: item.previousMonth,
      amount: data.amount,
      lastMonth: item.data[item.data.length - 1].yearMonth,
      remainingAmount: item.remainingAmount,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress
    }

    this.spinner.start('submit');
    this.api
      .callApi(this.constant.ADDMANUALINCOMETAXAMOUNT, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          this.getData()
          this.spinner.stop('submit');
        } else {
          this.notifications.create('Validation', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit');
        }
      }, (err) => {
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
        this.spinner.stop('submit');
      },);

  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  deleteData(item: any, data: any) {

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
          userMasterID: item.userMasterID,
          yearMonth: data.yearMonth
        }

        this.spinner.start('delete');
        this.api
          .callApi(this.constant.DELETEMANUALINCOMETAXAMOUNT, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getData();

              } else {
                this.notifications.create('Error', res.message, NotificationType.Error, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
              }
              this.spinner.stop('delete');
            },
            (err) => {
              this.handleError(err.error.message || 'Something went Wrong!');
              this.spinner.stop('delete');
            },
          );
      }
    });

  }

  download() {
    this.spinner.start('a');
    this.api
      .callApi(
        this.constant.GETMONTHLYTAXDEDUCTIONSOFEMPLOYEES + this.query + `&Export=true`,
        {},
        'GET',
        true,
        true,
        true,
        true,
      )
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
            saveAs(blob, `Monthly Income Tax Of Employees ${this.filterData.financialYear}.xlsx`);

            this.spinner.stop('a');
          }
        },
        (err) => {
          this.handleError(err.error.message || 'Someting Went Wrong!');
          this.spinner.stop('a');
        },
      );

  }

}
