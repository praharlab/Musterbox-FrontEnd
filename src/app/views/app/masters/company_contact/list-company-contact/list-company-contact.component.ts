import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { labelUtils } from 'src/app/constants/labelUtils';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-company-contact',
    templateUrl: './list-company-contact.component.html',
    styleUrls: ['./list-company-contact.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListCompanyContactComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addimportuser') addimportuser: NgForm;
  rows: any = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  columns = [
    { name: 'Id', prop: 'companyTypeID' },
    { name: 'Company Name', prop: 'companyTypename' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  file: any;
  format: any;
  url: any;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    searchQuery: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  ipAddress: any;
  rows1: any = [];
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  usertype: any;
  checkdata: any;
  companyName: any;
  rows2: any;

  allbranch1: any = [];
  ownerList1: any = [];
  allRoles1: any = [];
  filter: string;
  editData: any;
  userrights: any = [];
  editrights: any = [];
  formdata: any;
  showMyContainer: boolean = false;
  selected3: any[];
  event: any;
  events: any;
  formValue: any;
  searchValue: any;
  currentPage: number;
  limit = 10;
  pfNumber: any = labelUtils.pfNumber;
  pfJoiningDate: any = labelUtils.pfJoiningDate;
  pfBank: any = labelUtils.pfBank;
  pfBankIFSCCode: any = labelUtils.pfBankIFSCCode;
  pfBankAccountNumber: any = labelUtils.pfBankAccountNumber;
  esicNumber: any = labelUtils.esicNumber;
  esicJoiningDate: any = labelUtils.esicJoiningDate;
  esicEndMonth: any = labelUtils.esicEndMonth;
  salaryCalculationAct: any = labelUtils.salaryCalculationAct;
  aadharCardNumber: any = labelUtils.aadharCardNumber;
  nameOnAadhar: any = labelUtils.nameOnAadhar;
  viewAadhar: any = labelUtils.viewAadhar;
  showBankBranch: any = labelUtils.showBankBranch;
  bankIfscCodeLabel: any = labelUtils.bankIfscCodeLabel;
  tankhwaPatraNameLabel: any = labelUtils.tankhwaPatraNameLabel;
  showUanNumber: any = labelUtils.showUanNumber;
  showpfbankAccountNo: any = labelUtils.showpfbankAccountNo;
  showPanCard: any = labelUtils.showPanCard;
  showpfbankMasterID: any = labelUtils.showpfbankMasterID;
  showpfbankIFSC: any = labelUtils.showpfbankIFSC;
  showesicEndMonth: boolean = labelUtils.showesicEndMonth;
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
    public activatedRoute: ActivatedRoute,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          '/app/masters/add_company_contact',
          '/app/masters/edit_company_contact',
          '/app/masters/company_contact',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListCompanyContactComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.usertype = localStorage.getItem('usertype');
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListCompanyContactComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: this.formValue.ListCompanyMasterComponent.id,
        searchQuery: '',
      };
    } else {
      this.filterData = this.formValue.ListCompanyContactComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getCompanyName();
    this.getCompanyContactData();

    this.file = [];
    this.checkpermission();
    this.getIPAddress();
  }

  downloadFile() {
    let body = {
      companyMasterID: this.formValue.ListCompanyMasterComponent.id,
      status: 1,
      exportData: true,
      branchMasterID: null,
      department: null,
      designation: null,
      searchQuery: '',
      workingAreaId: null,
      divisionId: null,
      // For Field Name change
      pfNumber: this.pfNumber,
      pfJoiningDate: this.pfJoiningDate,
      pfBank: this.pfBank,
      pfBankIFSCCode: this.pfBankIFSCCode,
      pfBankAccountNumber: this.pfBankAccountNumber,
      esicNumber: this.esicNumber,
      esicJoiningDate: this.esicJoiningDate,
      esicEndMonth: this.esicEndMonth,
      salaryCalculationAct: this.salaryCalculationAct,
      aadharCardNumber: this.aadharCardNumber,
      nameOnAadhar: this.nameOnAadhar,
      viewAadhar: this.viewAadhar,
      showBankBranch: this.showBankBranch,
      bankIfscCodeLabel: this.bankIfscCodeLabel,
      tankhwaPatraNameLabel: this.tankhwaPatraNameLabel,
      showUanNumber: this.showUanNumber,
      showpfbankAccountNo: this.showpfbankAccountNo,
      showPanCard: this.showPanCard,
      showpfbankMasterID: this.showpfbankMasterID,
      showpfbankIFSC: this.showpfbankIFSC,
      showesicEndMonth: this.showesicEndMonth
    };
    // this.employeedata = [];

    this.spinner.start('main');
    this.api
      .callApi(this.constant.EXPORTUSERSALLDATA, body, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, 'EmployeeData.xlsx');
          this.spinner.stop('main');
        },
        (err) => {
          this.notifications.create('Error', 'Something Went Wrong!', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('main');
        },
      );
  }

  getCompanyName() {
    this.api
      .callApi(
        this.constant.VIEWCOMPANYDATA + this.formValue.ListCompanyMasterComponent.id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows2 = res.data;
        }
      });
  }

  getCompanyContactData() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, this.filterData, 'POST', true, false, true)
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
    if (this.usertype != 2 && this.usertype != 3 && this.usertype != 4) {
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
                permissionval.formName == 'EmployeeMaster' &&
                permissionval.operationName.includes('Delete')
              );
            });
            this.permissionedit = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'EmployeeMaster' &&
                permissionval.operationName.includes('Edit')
              );
            });
            this.permissionview = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'EmployeeMaster' &&
                permissionval.operationName.includes('View')
              );
            });
            this.permissioncreate = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'EmployeeMaster' &&
                permissionval.operationName.includes('Create')
              );
            });
            this.spinner.stop();
          }
        });
    } else {
      this.permissioncreate = [1];
      this.permissionedit = [1];
      this.permissionview = [1];
      this.permissiondelete = [1];
    }
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.ngOnInit();
      this.filterData.searchQuery = '';
    } else {
      this.filterData.searchQuery = inputValue;
      this.filterData.companyMasterID = this.formValue.ListCompanyMasterComponent.id;
      this.getCompanyContactData();
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

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getCompanyContactData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getCompanyContactData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
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
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEOMPANYCONTACTDATA, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getCompanyContactData();
              this.spinner.stop();
            },
            (err) => {
              console.log('error', err);
              this.spinner.stop();
            },
          );
      }
    });
  }
  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          userMasterID: id,
          status: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.COMPANYCONTACTSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', 'User deactivated successfully', NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getCompanyContactData();
              this.spinner.stop();
            },
            (err) => {
              console.log('error', err);
              this.spinner.stop();
            },
          );
      }
    });
  }
  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          userMasterID: id,
          status: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.COMPANYCONTACTSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', ' User activated successfully', NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getCompanyContactData();
              this.spinner.stop();
            },
            (err) => {
              console.log('error', err);
              this.spinner.stop();
            },
          );
      }
    });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
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


  view(id1: any) {
    this.formdata = [];

    this.spinner.start('loader-1');
    this.api
      .callApi(
        this.constant.VIEWFORMDATA +
        '?companyMasterID=' +
        this.formValue.ListCompanyMasterComponent.id,
        {},
        'GET',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.formdata = res.data;
            for (var i = 0; i < this.formdata.length; i++) {
              for (var j = 0; j < this.formdata[i].parentFormMasterID.length; j++) {
                this.formdata[i].parentFormMasterID[j].parentid = '';
                this.formdata[i].parentFormMasterID[j].disable = '';
              }
              this.formdata[i].parentid = '';
              this.formdata[i].disable = false;
            }

            for (var i = 0; i < this.formdata.length; i++) {
              this.formdata[i].status = false;
              for (var j = 0; j < this.formdata[i].parentFormMasterID.length; j++) {
                this.formdata[i].parentFormMasterID[j].status = false;
                for (var a = 0; a < this.formdata[i].parentFormMasterID[j].operation.length; a++) {
                  this.formdata[i].parentFormMasterID[j].operation[a].status = true;
                }
              }
            }

            let id = id1;
            this.spinner.start('start');
            this.api
              .callApi(this.constant.GETROLEMASTERBYID + id, {}, 'GET', true, true, true)
              .subscribe(
                (res: any) => {
                  this.editData = res.roleMaster;

                  this.editrights = res.data;
                  this.userrights = this.editrights;

                  if (this.editrights.length != 0) {
                    for (var i = 0; i < this.formdata.length; i++) {
                      for (var k = 0; k < this.editrights.length; k++) {
                        if (this.formdata[i].formMasterID == this.editrights[k].formMasterID) {
                          this.formdata[i].status = true;
                          this.formdata[i].parentid = this.editrights[k].formMasterID;
                        } else {
                        }
                      }
                    }
                    for (var i = 0; i < this.formdata.length; i++) {
                      for (var j = 0; j < this.formdata[i].parentFormMasterID.length; j++) {
                        for (
                          var a = 0;
                          a < this.formdata[i].parentFormMasterID[j].operation.length;
                          a++
                        ) {
                          for (var k = 0; k < this.editrights.length; k++) {
                            if (
                              this.formdata[i].parentFormMasterID[j].formMasterID ==
                              this.editrights[k].formMasterID &&
                              this.formdata[i].parentFormMasterID[j].operation[a].operationID ==
                              this.editrights[k].operationID
                            ) {
                              this.formdata[i].parentFormMasterID[j].parentid =
                                this.editrights[k].formMasterID;
                              this.formdata[i].parentFormMasterID[j].status = true;
                              this.formdata[i].parentFormMasterID[j].operation[
                                a
                              ].operationselected = this.editrights[k].operationID;
                              this.formdata[i].parentFormMasterID[j].operation[a].status = true;
                            }
                          }
                        }
                      }
                    }
                  }

                  this.showMyContainer = true;
                  this.spinner.stop('start');
                },
                (err) => {
                  console.log('error', err);
                  this.spinner.stop('start');
                },
              );
          }
          this.spinner.stop('loader-1');
        },
        (err) => {
          console.log('error', err);
          this.spinner.stop('loader-1');
        },
      );
  }


  navigateToEditPage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListCompanyContactComponent',
      this.filterData,
      '/masters/edit_company_contact',
      rowData.userMasterID,
    );
  }

  navigateToAddPage(): void {
    this.formValueStorageService.navigate(
      'ListCompanyContactComponent',
      this.filterData,
      '/masters/add_company_contact',
      this.formValue.ListCompanyMasterComponent.id,
    );
  }
}
