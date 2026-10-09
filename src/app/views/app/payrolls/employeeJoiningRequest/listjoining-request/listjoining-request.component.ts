import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Lightbox } from 'ngx-lightbox';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
@Component({
    selector: 'app-listjoining-request',
    templateUrl: './listjoining-request.component.html',
    styleUrls: ['./listjoining-request.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListjoiningRequestComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('rejectionRemarksForm') rejectionRemarksForm: NgForm;
  @ViewChild('closeRejectionModal') closeRejectionModal: ElementRef;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  myInputVariable: ElementRef;
  adminRoot = environment.adminRoot;
  apiURL = environment.apiUrl;
  scrollBarHorizontal = window.innerWidth < 1201;
  company_id: any;
  comp: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  allbranch: any;

  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: +localStorage.getItem('company_id'),
    searchQuery: '',
    JoiningRequestStatus: '',
    branchMasterID: '',
    exportData: false,
    startdate: '',
    enddate: '',
  };
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  limit = 10;
  page = {
    totalCount: 0,
    offset: 0,
  };
  formValue: any;
  ipAddress: any;
  rows: any = [];
  currentPage: number;
  joiningRequestRowData: any;
  currentDate: string;
  editEmployeejoiningData: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private lightbox: Lightbox,
  ) {
    {
      window.onresize = () => {
        this.scrollBarHorizontal = window.innerWidth < 1201;
      };
    }
  }

  ngOnInit() {
    this.currentDate = new Date().toISOString().slice(0, 10);
    this.company_id = localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
    this.selectcompany(localStorage.getItem('company_id'));
    this.getJoiningRequest();
    this.getIPAddress();
  }

  getcompany() {
    const body = {
      companyMasterID: +localStorage.getItem('company_id'),
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
  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
  selectfrom() {
    this.filterData.enddate = this.currentDate;
  }
  clear() {
    this.datefilter.resetForm();
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
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

          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeJoiningRequest' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeJoiningRequest' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }
  downloadFile() {
    this.spinner.start('start');

    let queryString = `?&exportData=true`;
    if (this.filterData.companyMasterID) {
      queryString += `&companyMasterID=${this.filterData.companyMasterID}`;
    }
    if (this.filterData.branchMasterID) {
      queryString += `&branchMasterID=${this.filterData.branchMasterID}`;
    }
    if (this.filterData.searchQuery) {
      queryString += `&searchQuery=${this.filterData.searchQuery}`;
    }
    if (this.filterData.JoiningRequestStatus) {
      queryString += `&JoiningRequestStatus=${this.filterData.JoiningRequestStatus}`;
    }
    if (this.filterData.startdate) {
      queryString += `&startdate=${this.filterData.startdate}`;
    }
    if (this.filterData.enddate) {
      queryString += `&enddate=${this.filterData.enddate}`;
    }
    this.api
      .callApi(
        this.constant.GETALLEMPLOYEEJOININGREQUESTS + queryString,
        {},
        'GET',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err);
          this.spinner.stop('start');
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Employee Joining Request.xlsx');
    this.spinner.stop('start');
  }
  selectcompany(id) {
    if (!id) {
      this.clear();
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
          this.handleError('something went wrong!');
          this.spinner.stop('branch');
        },
      );
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.companyMasterID = this.datefilter.value.company;
    this.getJoiningRequest();
  }
  getJoiningRequest() {
    let queryString = `?page=${this.filterData.page}&limit=${this.filterData.limit}`;
    if (this.filterData.companyMasterID) {
      queryString += `&companyMasterID=${this.filterData.companyMasterID}`;
    }
    if (this.filterData.branchMasterID) {
      queryString += `&branchMasterID=${this.filterData.branchMasterID}`;
    }
    if (this.filterData.searchQuery) {
      queryString += `&searchQuery=${this.filterData.searchQuery}`;
    }
    if (this.filterData.JoiningRequestStatus) {
      queryString += `&JoiningRequestStatus=${this.filterData.JoiningRequestStatus}`;
    }
    if (this.filterData.startdate && this.filterData.enddate) {
      queryString += `&startdate=${this.filterData.startdate}`;
      queryString += `&enddate=${this.filterData.enddate}`;
    }
    this.spinner.start('Requests');
    this.api
      .callApi(
        this.constant.GETALLEMPLOYEEJOININGREQUESTS + queryString,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
            this.spinner.stop('Requests');
          } else {
            this.handleError(res.message);
            this.spinner.stop('Requests');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('Requests');
        },
      );
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getJoiningRequest();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getJoiningRequest();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }
  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getJoiningRequest();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getJoiningRequest();
    }
  }
  alertAccept(rowData: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You Want to Accept Joining Request!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          employeeJoiningRequestID: rowData,
          JoiningRequestStatus: 'Approved',
          updateBy: localStorage.getItem('id'),
          updateByIp: this.ipAddress,
        };
        this.spinner.start('start');
        this.api
          .callApi(this.constant.EDITSTATUSEMPLOYEEJOININGREUEST, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
              } else {
                this.handleError(res.message);
              }
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
  rejectionSubmit() {
    if (!this.rejectionRemarksForm.valid) {
      return;
    }

    this.spinner.start();

    const body = {
      employeeJoiningRequestID: this.joiningRequestRowData,
      JoiningRequestStatus: 'Reject',
      rejectionRemarks: this.rejectionRemarksForm.value.rejectionRemarks,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.api
      .callApi(this.constant.EDITSTATUSEMPLOYEEJOININGREUEST, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          this.closeRejectionModal.nativeElement.click();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
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

  joiningRequestData(rowData: any) {
    this.joiningRequestRowData = rowData;
  }

  showdata(row) {
    this.spinner.start('show');
    this.api
      .callApi(
        this.constant.GETEMPLOYEEJOININGREQUESTBYID + row.employeeJoiningRequestID,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.editEmployeejoiningData = res.data;
            this.spinner.stop('show');
          } else {
            this.handleError(res.message);
            this.spinner.stop('show');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('show');
        },
      );
  }

  openLightbox(src: string): void {
    this.lightbox.open([{ src, thumb: '' }], 0, {
      centerVertically: true,
      positionFromTop: 0,
      disableScrolling: true,
      wrapAround: true,
    });
  }


  downloadPDF(employeeJoiningRequestID) {

    if (!this.datefilter.valid) return

    const filterData = {

      userMasterID: this.datefilter.value.user ? this.datefilter.value.user : [],
      startDate: this.datefilter.value.startDate,
      endDate: this.datefilter.value.endDate,
      companyMasterID: this.datefilter.value.cid,
      branchMasterID: this.datefilter.value.branch,
      departmentId: this.datefilter.value.department,
      Export: 'pdf'
    };

    let querystring = `?employeeJoiningRequestID=${employeeJoiningRequestID}`
    // if (filterData.branchId) querystring += `&branchMasterID=${filterData.branchId}`
    // if (filterData.departmentId) querystring += `&departmentId=${filterData.departmentId}`

    // filterData.userId.map(e => {
    //   querystring += `&userMasterID[]=${e}`
    // })

    this.spinner.start('pdf')
    this.api
      .callApi(
        this.constant.EMPLOYEEJOININGREQUESTFROMPDF + querystring,
        {},
        'GET',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            let base64String = res.data;
            this.downloadPdf(base64String, 'Joining Request Form');
          }
          this.spinner.stop('pdf');
        },
        (err) => {
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
          this.spinner.stop('pdf');
        },
      );
  }

  downloadPdf(base64String: string, fileName: string) {
    const blob = this.convertBase64ToBlob(base64String);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  convertBase64ToBlob(base64String: string) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/pdf' });
  }
}
