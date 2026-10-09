import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-resignation-process',
    templateUrl: './list-resignation-process.component.html',
    styleUrls: ['./list-resignation-process.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListResignationProcessComponent implements OnInit {
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
    companyMasterID: localStorage.getItem('company_id'),
    searchQuery: '',
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
  usertype: any;
  company_id: any;
  childcompany: string;
  comp: any;
  db: any;
  tabled: any;
  adminRoot = environment.adminRoot;

  currentPage: number;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/masters/resignation_process',
          this.adminRoot + '/masters/edit_resignation_process',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListResignationProcessComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListResignationProcessComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: localStorage.getItem('company_id'),
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.ListResignationProcessComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getdata();
    this.getcompany();
    this.checkpermission();
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
              permissionval.formName == 'ResignationProcess' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ResignationProcess' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ResignationProcess' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ResignationProcess' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }
  getbio(id: any) {
    const body = {
      companyMasterID: id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETTABLEANDDB, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.db = res.data;
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
  getdata() {
    this.spinner.start('oninit2');
    this.api
      .callApi(this.constant.GETALLRESIGNATION, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
            this.spinner.stop('oninit2');
          } else {
            this.handleError(res.message);
            this.spinner.stop('oninit2');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('oninit2');
        },
      );
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getdata();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getdata();
    }
  }

  // onSubmit() {
  //   if (!this.datefilter.valid) {
  //     return;
  //   }
  //   this.body1.company = this.datefilter.value.company;
  //   this.body1.database = this.datefilter.value.database;

  //   this.api
  //     .callApi(this.constant.GETALLBIOMETRICINTEGRATION, this.body1, 'POST', true, false, true)
  //     .subscribe((res: any) => {
  //       if (res.status == 200) {
  //         this.filter = 'filter';
  //         this.rows = res.data;
  //         this.temp = [...this.rows];
  //         this.page.totalCount = res.totalcount;
  //         this.spinner.stop();
  //       }
  //     });
  // }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getdata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getdata();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }
  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/masters/clearance-and-exit/add-clearance-and-exit']);
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
          resignProcessID: id,
          status: '2',
        };
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.CHANGERESIGNSTATUS, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getdata();
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
  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'These will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          resignProcessID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.CHANGERESIGNSTATUS, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getdata();
                this.spinner.stop('deactive');
              } else {
                this.handleError(res.message);
                this.spinner.stop('deactive');
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('deactive');
            },
          );
      }
    });
  }
  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'These will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          resignProcessID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.CHANGERESIGNSTATUS, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getdata();
              this.spinner.stop('active');
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('active');
            },
          );
      }
    });
  }

  // downloadFile() {
  //   if (this.usertype != 2) {
  //     let data = []
  //     if (this.filter == 'main') {
  //       let mainbody = {
  //         page: '',
  //         limit: '',
  //         id: localStorage.getItem('company_id'),
  //       }
  //       this.api
  //         .callApi(
  //           this.constant.getCompanyByParentCompany,
  //           mainbody,
  //           'POST',
  //           true,
  //           false,
  //           true,
  //         )
  //         .subscribe((res: any) => {
  //           if (res.status == 200) {
  //             this.export = res.data

  //             for (var i = 0; i < this.export.length; i++) {
  //               const data1 = {
  //                 CompanyMasterID: this.rows[i].companyMasterID,
  //                 CompanyName: this.rows[i].companyName,
  //                 CompanyAddress: this.rows[i].companyAddress,
  //                 CompanyWebsite: this.rows[i].companyWebsite,
  //                 CompanyEmail: this.rows[i].companyEmail,
  //                 CityName: this.rows[i]['cityMaster.cityName'],
  //                 StateName: this.rows[i]['cityMaster.stateMaster.stateName'],
  //                 CountryName: this.rows[i][
  //                   'cityMaster.stateMaster.countryMaster.countryName'
  //                 ],
  //                 CompanyType: this.rows[i]['companyType.companyTypename'],
  //                 Status: this.rows[i].status,
  //                 CreateBy: this.export[i].createBy,
  //                 CreateByIp: this.export[i].createByIp,
  //                 CreatedAt: this.export[i].createdAt,
  //                 updateBy: this.export[i].updateBy,
  //                 UpdateByIp: this.export[i].updateByIp,
  //                 UpdatedAt: this.export[i].updatedAt,
  //               }
  //               if (data1.Status == 1) {
  //                 data1.Status = 'Active'
  //               } else {
  //                 data1.Status = 'Deactive'
  //               }
  //               data.push(data1)
  //             }

  //             const replacer = (key, value) => (value === null ? '' : value) // specify how you want to handle null values here
  //             const header = Object.keys(data[0])
  //             let csv = data.map((row) =>
  //               header
  //                 .map((fieldName) => JSON.stringify(row[fieldName], replacer))
  //                 .join(','),
  //             )
  //             csv.unshift(header.join(','))
  //             let csvArray = csv.join('\r\n')

  //             var blob = new Blob([csvArray], { type: 'text/csv' })
  //             saveAs(blob, 'Company.csv')
  //           }
  //         })
  //     } else if (this.filter == 'search') {
  //       let mainbody = {
  //         page: '',
  //         limit: '',
  //         searchQuery: this.excelevents,
  //         id: localStorage.getItem('company_id'),
  //       }
  //       this.api
  //         .callApi(
  //           this.constant.getCompanyByParentCompany,
  //           mainbody,
  //           'POST',
  //           true,
  //           false,
  //           true,
  //         )
  //         .subscribe((res: any) => {
  //           if (res.status == 200) {
  //             this.export = res.data
  //             for (var i = 0; i < this.export.length; i++) {
  //               const data1 = {
  //                 CompanyMasterID: this.rows[i].companyMasterID,
  //                 CompanyName: this.rows[i].companyName,
  //                 CompanyAddress: this.rows[i].companyAddress,
  //                 CompanyWebsite: this.rows[i].companyWebsite,
  //                 CompanyEmail: this.rows[i].companyEmail,
  //                 CityName: this.rows[i]['cityMaster.cityName'],
  //                 StateName: this.rows[i]['cityMaster.stateMaster.stateName'],
  //                 CountryName: this.rows[i][
  //                   'cityMaster.stateMaster.countryMaster.countryName'
  //                 ],
  //                 CompanyType: this.rows[i]['companyType.companyTypename'],
  //                 Status: this.rows[i].status,
  //                 CreateBy: this.export[i].createBy,
  //                 CreateByIp: this.export[i].createByIp,
  //                 CreatedAt: this.export[i].createdAt,
  //                 updateBy: this.export[i].updateBy,
  //                 UpdateByIp: this.export[i].updateByIp,
  //                 UpdatedAt: this.export[i].updatedAt,
  //               }
  //               if (data1.Status == 1) {
  //                 data1.Status = 'Active'
  //               } else {
  //                 data1.Status = 'Deactive'
  //               }
  //               data.push(data1)
  //             }

  //             const replacer = (key, value) => (value === null ? '' : value) // specify how you want to handle null values here
  //             const header = Object.keys(data[0])
  //             let csv = data.map((row) =>
  //               header
  //                 .map((fieldName) => JSON.stringify(row[fieldName], replacer))
  //                 .join(','),
  //             )
  //             csv.unshift(header.join(','))
  //             let csvArray = csv.join('\r\n')

  //             var blob = new Blob([csvArray], { type: 'text/csv' })
  //             saveAs(blob, 'Company.csv')
  //           }
  //         })
  //     } else {
  //       let mainbody = {
  //         page: '',
  //         limit: '',
  //         startdate: this.datefilter.value.startdate,
  //         enddate: this.datefilter.value.enddate,
  //         id: localStorage.getItem('company_id'),
  //       }
  //       this.api
  //         .callApi(
  //           this.constant.getCompanyByParentCompany,
  //           mainbody,
  //           'POST',
  //           true,
  //           false,
  //           true,
  //         )
  //         .subscribe((res: any) => {
  //           if (res.status == 200) {
  //             this.export = res.data
  //             for (var i = 0; i < this.export.length; i++) {
  //               const data1 = {
  //                 CompanyMasterID: this.rows[i].companyMasterID,
  //                 CompanyName: this.rows[i].companyName,
  //                 CompanyAddress: this.rows[i].companyAddress,
  //                 CompanyWebsite: this.rows[i].companyWebsite,
  //                 CompanyEmail: this.rows[i].companyEmail,
  //                 CityName: this.rows[i]['cityMaster.cityName'],
  //                 StateName: this.rows[i]['cityMaster.stateMaster.stateName'],
  //                 CountryName: this.rows[i][
  //                   'cityMaster.stateMaster.countryMaster.countryName'
  //                 ],
  //                 CompanyType: this.rows[i]['companyType.companyTypename'],
  //                 Status: this.rows[i].status,
  //                 CreateBy: this.export[i].createBy,
  //                 CreateByIp: this.export[i].createByIp,
  //                 CreatedAt: this.export[i].createdAt,
  //                 updateBy: this.export[i].updateBy,
  //                 UpdateByIp: this.export[i].updateByIp,
  //                 UpdatedAt: this.export[i].updatedAt,
  //               }
  //               if (data1.Status == 1) {
  //                 data1.Status = 'Active'
  //               } else {
  //                 data1.Status = 'Deactive'
  //               }
  //               data.push(data1)
  //             }

  //             const replacer = (key, value) => (value === null ? '' : value) // specify how you want to handle null values here
  //             const header = Object.keys(data[0])
  //             let csv = data.map((row) =>
  //               header
  //                 .map((fieldName) => JSON.stringify(row[fieldName], replacer))
  //                 .join(','),
  //             )
  //             csv.unshift(header.join(','))
  //             let csvArray = csv.join('\r\n')

  //             var blob = new Blob([csvArray], { type: 'text/csv' })
  //             saveAs(blob, 'Company.csv')
  //           }
  //         })
  //     }
  //   } else {
  //     let data = []
  //     if (this.filter == 'main') {
  //       let mainbody = {
  //         page: '',
  //         limit: '',
  //         id: localStorage.getItem('company_id'),
  //       }
  //       this.api
  //         .callApi(
  //           this.constant.GETCOMPANYDATA,
  //           mainbody,
  //           'POST',
  //           true,
  //           false,
  //           true,
  //         )
  //         .subscribe((res: any) => {
  //           if (res.status == 200) {
  //             this.export = res.data

  //             for (var i = 0; i < this.export.length; i++) {
  //               const data1 = {
  //                 CompanyMasterID: this.rows[i].companyMasterID,
  //                 CompanyName: this.rows[i].companyName,
  //                 CompanyAddress: this.rows[i].companyAddress,
  //                 CompanyWebsite: this.rows[i].companyWebsite,
  //                 CompanyEmail: this.rows[i].companyEmail,
  //                 CityName: this.rows[i]['cityMaster.cityName'],
  //                 StateName: this.rows[i]['cityMaster.stateMaster.stateName'],
  //                 CountryName: this.rows[i][
  //                   'cityMaster.stateMaster.countryMaster.countryName'
  //                 ],
  //                 CompanyType: this.rows[i]['companyType.companyTypename'],
  //                 Status: this.rows[i].status,
  //                 CreateBy: this.export[i].createBy,
  //                 CreateByIp: this.export[i].createByIp,
  //                 CreatedAt: this.export[i].createdAt,
  //                 updateBy: this.export[i].updateBy,
  //                 UpdateByIp: this.export[i].updateByIp,
  //                 UpdatedAt: this.export[i].updatedAt,
  //               }
  //               if (data1.Status == 1) {
  //                 data1.Status = 'Active'
  //               } else {
  //                 data1.Status = 'Deactive'
  //               }
  //               data.push(data1)
  //             }

  //             const replacer = (key, value) => (value === null ? '' : value) // specify how you want to handle null values here
  //             const header = Object.keys(data[0])
  //             let csv = data.map((row) =>
  //               header
  //                 .map((fieldName) => JSON.stringify(row[fieldName], replacer))
  //                 .join(','),
  //             )
  //             csv.unshift(header.join(','))
  //             let csvArray = csv.join('\r\n')

  //             var blob = new Blob([csvArray], { type: 'text/csv' })
  //             saveAs(blob, 'Company.csv')
  //           }
  //         })
  //     } else if (this.filter == 'search') {
  //       let mainbody = {
  //         page: '',
  //         limit: '',
  //         searchQuery: this.excelevents,
  //         id: localStorage.getItem('company_id'),
  //       }
  //       this.api
  //         .callApi(
  //           this.constant.GETCOMPANYDATA,
  //           mainbody,
  //           'POST',
  //           true,
  //           false,
  //           true,
  //         )
  //         .subscribe((res: any) => {
  //           if (res.status == 200) {
  //             this.export = res.data
  //             for (var i = 0; i < this.export.length; i++) {
  //               const data1 = {
  //                 CompanyMasterID: this.rows[i].companyMasterID,
  //                 CompanyName: this.rows[i].companyName,
  //                 CompanyAddress: this.rows[i].companyAddress,
  //                 CompanyWebsite: this.rows[i].companyWebsite,
  //                 CompanyEmail: this.rows[i].companyEmail,
  //                 CityName: this.rows[i]['cityMaster.cityName'],
  //                 StateName: this.rows[i]['cityMaster.stateMaster.stateName'],
  //                 CountryName: this.rows[i][
  //                   'cityMaster.stateMaster.countryMaster.countryName'
  //                 ],
  //                 CompanyType: this.rows[i]['companyType.companyTypename'],
  //                 Status: this.rows[i].status,
  //                 CreateBy: this.export[i].createBy,
  //                 CreateByIp: this.export[i].createByIp,
  //                 CreatedAt: this.export[i].createdAt,
  //                 updateBy: this.export[i].updateBy,
  //                 UpdateByIp: this.export[i].updateByIp,
  //                 UpdatedAt: this.export[i].updatedAt,
  //               }
  //               if (data1.Status == 1) {
  //                 data1.Status = 'Active'
  //               } else {
  //                 data1.Status = 'Deactive'
  //               }
  //               data.push(data1)
  //             }

  //             const replacer = (key, value) => (value === null ? '' : value) // specify how you want to handle null values here
  //             const header = Object.keys(data[0])
  //             let csv = data.map((row) =>
  //               header
  //                 .map((fieldName) => JSON.stringify(row[fieldName], replacer))
  //                 .join(','),
  //             )
  //             csv.unshift(header.join(','))
  //             let csvArray = csv.join('\r\n')

  //             var blob = new Blob([csvArray], { type: 'text/csv' })
  //             saveAs(blob, 'Company.csv')
  //           }
  //         })
  //     } else {
  //       let mainbody = {
  //         page: '',
  //         limit: '',
  //         startdate: this.datefilter.value.startdate,
  //         enddate: this.datefilter.value.enddate,
  //         id: localStorage.getItem('company_id'),
  //       }
  //       this.api
  //         .callApi(
  //           this.constant.GETCOMPANYDATA,
  //           mainbody,
  //           'POST',
  //           true,
  //           false,
  //           true,
  //         )
  //         .subscribe((res: any) => {
  //           if (res.status == 200) {
  //             this.export = res.data
  //             for (var i = 0; i < this.export.length; i++) {
  //               const data1 = {
  //                 CompanyMasterID: this.rows[i].companyMasterID,
  //                 CompanyName: this.rows[i].companyName,
  //                 CompanyAddress: this.rows[i].companyAddress,
  //                 CompanyWebsite: this.rows[i].companyWebsite,
  //                 CompanyEmail: this.rows[i].companyEmail,
  //                 CityName: this.rows[i]['cityMaster.cityName'],
  //                 StateName: this.rows[i]['cityMaster.stateMaster.stateName'],
  //                 CountryName: this.rows[i][
  //                   'cityMaster.stateMaster.countryMaster.countryName'
  //                 ],
  //                 CompanyType: this.rows[i]['companyType.companyTypename'],
  //                 Status: this.rows[i].status,
  //                 CreateBy: this.export[i].createBy,
  //                 CreateByIp: this.export[i].createByIp,
  //                 CreatedAt: this.export[i].createdAt,
  //                 updateBy: this.export[i].updateBy,
  //                 UpdateByIp: this.export[i].updateByIp,
  //                 UpdatedAt: this.export[i].updatedAt,
  //               }
  //               if (data1.Status == 1) {
  //                 data1.Status = 'Active'
  //               } else {
  //                 data1.Status = 'Deactive'
  //               }
  //               data.push(data1)
  //             }

  //             const replacer = (key, value) => (value === null ? '' : value) // specify how you want to handle null values here
  //             const header = Object.keys(data[0])
  //             let csv = data.map((row) =>
  //               header
  //                 .map((fieldName) => JSON.stringify(row[fieldName], replacer))
  //                 .join(','),
  //             )
  //             csv.unshift(header.join(','))
  //             let csvArray = csv.join('\r\n')

  //             var blob = new Blob([csvArray], { type: 'text/csv' })
  //             saveAs(blob, 'Company.csv')
  //           }
  //         })
  //     }
  //   }
  // }

  clear() {
    this.datefilter.resetForm();

    this.formValueStorageService.removeData('ListResignationProcessComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  changeshowfields() {
    this.ngOnInit();
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
      'ListResignationProcessComponent',
      this.filterData,
      '/masters/clearance-and-exit/edit-clearance-and-exit',
      rowData.resignProcessID,
    );
  }
}
