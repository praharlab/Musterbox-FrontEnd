import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { Lightbox } from 'ngx-lightbox';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-gatepass-request',
    templateUrl: './gatepass-request.component.html',
    styleUrls: ['./gatepass-request.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class GatepassRequestComponent implements OnInit {
  @ViewChild('companyfilter') companyfilter: NgForm;
  @ViewChild('rejectionRemarksForm') rejectionRemarksForm: NgForm;
  @ViewChild('closeRejectionModal') closeRejectionModal: ElementRef;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  myInputVariable: ElementRef;

  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  Order = { label: 'Description', value: 'description' };
  changeOrderBy = [
    { label: 'Description', value: 'description' },
    { label: 'Date', value: 'date' },
  ];

  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    company_id: localStorage.getItem('company_id'),
    userMasterId: '',
    sortByField: '',
    sortByValue: 'ASC',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  permissioncreate: any = [1];
  permissionedit: any = [1];
  permissionview: any = [1];
  permissiondelete: any = [1];
  limit = 10;
  company_id: any;
  file: any;
  comp: any;
  selectedValue: string;
  query: string;
  employeeGatepassId: any;
  image: any;
  referencedata: any;

  allbranch: any;
  empList: any;
  employeeGatepassRowData: any = [];

  openLightbox(src: string): void {
    this.lightbox.open([{ src, thumb: '' }], 0, {
      centerVertically: true,
      positionFromTop: 0,
      disableScrolling: true,
      wrapAround: true,
    });
  }

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private lightbox: Lightbox,
  ) { }

  ngOnInit() {
    this.limit = 10;
    this.body = {
      page: 1,
      limit: 10,
      searchQuery: '',
      company_id: localStorage.getItem('company_id'),
      userMasterId: '',
      sortByField: '',
      sortByValue: 'ASC',
    };
    this.image = [];
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.company_id = +localStorage.getItem('company_id');
    this.getEmployeeGatepassData();
    this.getcompany();
    this.checkpermission();
  }

  getEmployeeGatepassData() {
    this.spinner.start('start');
    let queryString = `?page=${this.body.page}&pageSize=${this.body.limit}&status=Pending`;
    if (this.body.company_id) {
      queryString += `&companyMasterID=${this.body.company_id}`;
    }
    if (this.body.userMasterId) {
      queryString += `&userMasterID=${this.body.userMasterId}`;
    }
    if (this.body.searchQuery) {
      queryString += `&search=${this.body.searchQuery}`;
    }
    if (this.body.sortByField) {
      queryString += `&sortByField=${this.body.sortByField}&sortByValue=${this.body.sortByValue}`;
    }

    this.query = queryString;
    this.api
      .callApi(this.constant.GETALLEMPLOYEEGATEPASS + queryString, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop('start');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  // navigate(row) {
  //   this.router.navigate([this.adminRoot + '/employeegatepasses/edit_emp_gatepass/' + row.id]);
  // }

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
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeGatepassRequest' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeGatepassRequest' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
  }

  convertTo12HourFormat(time24: string): string {
    if (!time24) return '';

    let [hours, minutes] = time24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
  }

  onChangeOrderBy(event): void {
    this.body.sortByField = event.value;
    this.getEmployeeGatepassData();
  }

  updateFilter(event): void {
    if (!event) {
      return;
    }
    const inputValue = event.target.value.trim().toLowerCase();

    if (inputValue.length == 0) {
      this.ngOnInit();
    }

    if (inputValue.length >= 3) {
      this.body.searchQuery = inputValue;
      this.body.company_id = localStorage.getItem('company_id');
      this.getEmployeeGatepassData();
    }
  }

  onSubmit() {
    if (!this.companyfilter.valid) {
      return;
    }
    this.body.page = 1;
    this.body.company_id = this.companyfilter.value.company;
    this.body.userMasterId = this.companyfilter.value.employee;
    this.getEmployeeGatepassData();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.getEmployeeGatepassData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.getEmployeeGatepassData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  // alertConfirmation(id: any) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You will not be able to recover!',
  //     icon: 'success',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'No, keep it',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const body = {};
  //       this.spinner.start();
  //       this.api
  //         .callApi(this.constant.DELETEEMPLOYEEGATEPASS + id, {}, 'DELETE', true, true, true)
  //         .subscribe(
  //           (res: any) => {
  //             this.getEmployeeGatepassData();
  //             this.notifications.create('Done', res.message, NotificationType.Success, {
  //               theClass: 'outline primary',
  //               timeOut: 3000,
  //               showProgressBar: false,
  //             });
  //             this.spinner.stop();
  //           },
  //           (err) => {
  //             this.handleError(err.error.message);
  //             this.spinner.stop();
  //           },
  //         );
  //     }
  //   });
  // }

  alertAccept(rowData: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You Want to Accpet Gate pass!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          description: rowData.description,
          userMasterID: rowData.userMasterId,
          fromTime: rowData.fromTime,
          toTime: rowData.toTime,
          date: rowData.date,
          status: 'Approved',
          purposeFor: rowData.purposeFor,
        };
        this.spinner.start('start');
        this.api
          .callApi(this.constant.UPDATEEMPLOYEEGATEPASS + rowData.id, body, 'PUT', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', 'Employee Gatepass Accepted Successfully.', NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              setTimeout(() => {
                this.ngOnInit();
                this.spinner.stop('start');
              }, 3000);
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('start');
            },
          );
      }
    });
  }

  clear() {
    this.companyfilter.resetForm();
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
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
          setTimeout(() => {
            this.selectcompany(this.company_id);
          }, 100);
          this.spinner.stop('company');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  onOptionSelect() {
    if (!this.selectedValue && this.selectedValue == null) {
      return;
    }

    if (this.rows.length == 0) {
      this.handleError('No Data To Export Excel!');
      return;
    }

    this.spinner.start('a');
    this.api
      .callApi(
        this.constant.GETALLEMPLOYEEGATEPASS +
        this.query +
        `&exportFileType=${this.selectedValue}&exportData=true`,
        {},
        'GET',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (this.selectedValue == 'csv') {
            var blob = new Blob([res], { type: 'text/csv' });
            saveAs(blob, 'EmployeeGatepass.csv');
            this.selectedValue = null;
            this.spinner.stop('a');
          } else {
            var blob = new Blob([res], { type: 'text/xlsx' });
            saveAs(blob, 'EmployeeGatepass.xlsx');
            this.selectedValue = null;
            this.spinner.stop('a');
          }
        },
        (err) => {
          this.selectedValue = null;
          this.handleError(err.error.message);
          this.spinner.stop('a');
        },
      );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  employeeGatepassData(data: any) {
    this.employeeGatepassRowData = [];
    this.employeeGatepassRowData = data;
  }

  rejectionSubmit() {
    if (!this.rejectionRemarksForm.valid) {
      return;
    }

    this.spinner.start();
    const body = {
      description: this.employeeGatepassRowData.description,
      userMasterID: this.employeeGatepassRowData.userMasterId,
      fromTime: this.employeeGatepassRowData.fromTime,
      toTime: this.employeeGatepassRowData.toTime,
      date: this.employeeGatepassRowData.date,
      status: 'Reject',
      purposeFor: this.employeeGatepassRowData.purposeFor,
      rejectionRemarks: this.rejectionRemarksForm.value.rejectionRemarks,
    };
    this.api
      .callApi(
        this.constant.UPDATEEMPLOYEEGATEPASS + this.employeeGatepassRowData.id,
        body,
        'PUT',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.closeRejectionModal.nativeElement.click();
          this.notifications.create('Done', 'Employee Gatepass Rejected Successfully.', NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.rejectionRemarksForm.resetForm();
            this.ngOnInit();
          }, 3000);
          this.spinner.stop();
        },
        (err) => {
          this.closeRejectionModal.nativeElement.click();
          this.rejectionRemarksForm.resetForm();
          this.ngOnInit();
          this.handleError(err.error.message);
          this.spinner.stop();
        },
      );
  }

  resetForm(formName) {
    if (formName == 'rejectionModal') {
      this.rejectionRemarksForm.resetForm();
    }
  }

  selectcompany(id) {
    if (!id) {
      this.companyfilter.resetForm();
      setTimeout(() => {
        this.clear();
      }, 100);
      return;
    }
    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.allbranch = res;
          this.spinner.stop('branch');
        },
        () => {
          this.spinner.stop('branch');

          this.handleError('something went wrong!');
        },
      );

    const body = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start('employee');
    this.api
      .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.empList = res.data;
            this.selectAllForDropdownItems(this.empList);

            this.spinner.stop('employee');
          } else {
            this.handleError('Something Went Wrong!');
            this.spinner.stop('employee');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('employee');
        },
      );
  }

  selectbranch(id) {
    if (!id) {
      return;
    }
    const filterData = {
      branchMasterID: id,
    };
    if (id != '' && id != null) {
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.empList = res.data;
              this.spinner.stop();
            } else {
              this.handleError('Something Went Wrong!');
              this.spinner.stop();
            }
          },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop();
          },
        );
    } else {
      const body = {
        page: '',
        limit: '',
        companyMasterID: this.companyfilter.value.company,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.empList = res.data;

              this.spinner.stop();
            } else {
              this.handleError('Something Went Wrong!');
              this.spinner.stop();
            }
          },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop();
          },
        );
    }
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }
}
