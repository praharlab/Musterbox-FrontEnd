import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-previous-salary',
    templateUrl: './previous-salary.component.html',
    styleUrls: ['./previous-salary.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PreviousSalaryComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('importprevioussalry') importprevioussalry: NgForm;
  @ViewChild('closeModal') closeModal: any;

  rows = [];
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  limit = 10;
  allbranch: any[];
  alluser: any[];
  selectedEmployees: any[];
  selectedBranch: string;
  childcompany: string;
  company_id: any;
  cid: string;
  usertype: string;
  company: any;
  permissionview: any = [];
  filterData = {
    companyMasterID: '',
    branchMasterID: '',
    userMasterID: [],
    month: '',
    page: 1,
    limit: 10,
    Export: ''
  }

  page = {
    totalCount: 0,
    offset: 0,
  };
  resultColumns: any = [];
  currentPage: number;
  file: any;
  format: string;
  url: string | ArrayBuffer;
  companyID: string | Blob;
  showdemoExcel: boolean;
  permissiondelete: any = [];
  permissioncreate: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.rows = [];
    this.resultColumns = []
    this.childcompany = localStorage.getItem('childcompany');
    this.company_id = +localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.checkpermission();
    this.getcompany();

  }


  getcompany() {

    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;

          this.spinner.stop('company');
        }
      });

  }


  checkpermission() {
    this.spinner.start('permission');
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
              permissionval.formName == 'PreviousSalary' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'PreviousSalary' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'PreviousSalary' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  selectcompany(id) {
    this.allbranch = [];

    this.alluser = [];
    (this.selectedEmployees = []), (this.selectedBranch = '');

    if (id) {
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
      this.spinner.start('user');
      this.api
        .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);

            this.spinner.stop('user');
          }
        });
    }
  }

  selectbranch(id) {

    this.alluser = [];
    this.selectedEmployees = [];
    const filterData = {
      branchMasterID: id,
    };
    if (id) {
      this.spinner.start('user');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);
            this.alluser.map((el) => {
              el.name = el.displayName;
            });

            this.spinner.stop('user');
          }
        });
    } else {
      const body = {
        page: '',
        limit: '',
        companyMasterID: this.datefilter.value.cid,
      };
      this.spinner.start('user')
      this.api
        .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);
            this.spinner.stop('user');
          }
        });
    }
  }

  getPreviousSalaryData() {
    if (!this.filterData.companyMasterID && !this.filterData.month) return;
    this.filterData.Export = ''
    this.spinner.start('getData');
    this.api
      .callApi(this.constant.GETPREVIOUSSALARYDATA, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          // this.temp = [...this.rows];
          this.page.totalCount = res.totalcount
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 100);
          this.resultColumns = [];
          for (var key in this.rows[0]) {
            if (key != 'userMasterID') {
              this.resultColumns.push({
                name: key,
                prop: key,
                flexGrow: 1.2,
                minWidth: 200,
              });
            }
          }

          this.spinner.stop('getData');
        }
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) return

    this.resultColumns = [];

    this.filterData.page = 1;

    this.filterData.companyMasterID = this.datefilter.value.cid
    this.filterData.branchMasterID = this.datefilter.value.branch
    this.filterData.userMasterID = this.datefilter.value.user ? this.datefilter.value.user : []
    this.filterData.month = this.datefilter.value.YearMM.replace('-', '');
    this.filterData.Export = ''

    this.getPreviousSalaryData();

  }

  Export() {

    this.filterData.Export = 'true'

    this.spinner.start('a');
    this.api
      .callApi(this.constant.GETPREVIOUSSALARYDATA, this.filterData, 'POST', true, true, true, true)
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
            saveAs(blob, `Previous Salary Data - ${this.filterData.month}.xlsx`);

            this.spinner.stop('a');
          }
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
          this.spinner.stop('a');
        },
      );
  }


  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getPreviousSalaryData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;

      this.getPreviousSalaryData();
    } else {

      console.log('error');
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
          userMasterID: id,
          yearMonth: this.filterData.month
        };
        this.spinner.start('delete');
        this.api
          .callApi(this.constant.DELETEPREVIOUSSALARY, body, 'POST', true, true, true)
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
                this.getPreviousSalaryData();
              } else {
                this.notifications.create(
                  'Error',
                  res.message || 'Someting Went Wrong!',
                  NotificationType.Error,
                  {
                    theClass: 'outline primary',
                    timeOut: 3000,
                    showProgressBar: false,
                  },
                );
              }

              this.spinner.stop('delete');
            },
            (err) => {
              console.log('error', err);
              this.spinner.stop('delete');
            },
          );
      }
    });
  }


  onSelectFiles(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);

    this.file = event.target.files && event.target.files[0];
    if (this.file) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      if (this.file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
    }
  }

  addPreviousSalary() {
    if (!this.importprevioussalry.valid) {
      return;
    }

    const formData = new FormData();

    formData.append('file', this.file);
    formData.append('companyMasterID', this.importprevioussalry.value.company1);
    formData.append('month', this.importprevioussalry.value.month.replace('-', ''));


    this.spinner.start('upload');
    this.api
      .callApi(this.constant.UPLOADPREVIOUSSALARYEXCEL, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });

            this.closeModal.nativeElement.click();
            this.importprevioussalry.resetForm();
            this.showdemoExcel = false;
            this.ngOnInit();
          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            }),
              this.importprevioussalry.resetForm();
            this.showdemoExcel = false;

          }
          this.spinner.stop('upload');
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.importprevioussalry.resetForm();
          this.showdemoExcel = false;
          this.spinner.stop('upload');
        },
      );
  }

  showdemo() {
    if (this.importprevioussalry.value.company1 && this.importprevioussalry.value.month) {
      this.showdemoExcel = true;
      this.companyID = this.importprevioussalry.value.company1
    } else {
      this.showdemoExcel = false;

    }

  }


  downloadDemo() {
    this.spinner.start('a');

    const queryString = `?companyMasterID=${this.companyID}&month=${this.importprevioussalry.value.month.replace('-', '')}`;

    this.api
      .callApi(this.constant.PREVIOUSSALARYDEMOEXCEL + queryString, {}, 'GET', true, true, true, true)
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
            saveAs(blob, 'Previous Salary Demo.xlsx');

            this.spinner.stop('a');
          }
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
          this.spinner.stop('a');
        },
      );
  }


  clear() {
    this.datefilter.resetForm();
    this.ngOnInit();
  }

  closeModel() {
    this.importprevioussalry.resetForm();
    this.showdemoExcel = false;
  }

}
