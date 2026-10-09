import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-gatepass',
    templateUrl: './list-gatepass.component.html',
    styleUrls: ['./list-gatepass.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListGatepassComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('addrefund') addrefund: NgForm;
  @ViewChild('addrefund1') addrefund1: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  commonFilterData: any

  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [
    'Whom To Meet',
    'VisitorName',
    'VisitorCompany',
    'VisitorsPhone',
    'VisitorPhoto',
    'Date',
    'CheckInTime',
    'CheckOutTime',
    'attachment',
  ];
  SelectionType = SelectionType;
  tabledata = [
    'Whom To Meet',
    'VisitorName',
    'VisitorCompany',
    'VisitorsPhone',
    'VisitorPhoto',
    'MeetingLocation',
    'Date',
    'CheckInTime',
    'CheckOutTime',
    'FromTime',
    'ToTime',
    'Remarks',
    'attachment',
    'checkINattachment',
    'checkOUTattachment',
    'CreateBy',
    'CreatedAt',
    'updateBy',
    'UpdatedAt',
  ];
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  // filterData = {
  //   page: 1,
  //   limit: 10,
  //   id: localStorage.getItem('company_id'),
  // };
  // body = {
  //   page: 1,
  //   limit: 10,
  //   searchQuery: '',
  //   id: localStorage.getItem('company_id'),
  // };
  filterData = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    companyMasterID: Number(localStorage.getItem('company_id')),
    status: '',
    userMasterID: '',
    searchQuery: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  displayname: any;
  filter: any;

  finalcompanyid: any;
  excelevents: any;
  databyemp: any;
  user: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  usertype: any;
  company_id: any;
  users: any;
  comp: any;
  ipAddress: any;
  rows1: any;
  category: any;
  depositid: any;
  image: any;
  base64textString: string = '';

  currentPage: number;
  formValue: any;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/gatepasses/gatepass',
          this.adminRoot + '/gatepasses/gatepass/edit_gatepass',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListGatepassComponent', false);
          formValueStorageService.removeData('commonFilterData', true);
        }
      }
    });
  }

  ngOnInit() {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.checkpermission();
    // this.getGatepass();
    // this.getcompany();
    // this.getvisitor(this.filterData.companyMasterID);
    // this.getuser(this.filterData.companyMasterID);
  }
  getGatepass() {
    this.spinner.start('main');

    this.api
      .callApi(this.constant.GATEPASSBYCOMPANYDATA, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            if(this.rows.length > 0){
              this.showButtons.push(CommonFilterButtonFields.Excel)
            }else{
              this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
            }
            this.filter = 'main';
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
              this.itemsPerPage = this.filterData.limit;
            }, 100);
            this.spinner.stop('main');
          } else {
            this.handleError(res.message);
            this.spinner.stop('main');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('main');
        },
      );
  }

  export() {
    const body = {
      page: '',
      limit: '',
      startdate: this.filterData.startdate,
      enddate: this.filterData.enddate,
      id: this.filterData.companyMasterID,
      status: this.filterData.status,
      userMasterID: this.filterData.userMasterID,
      searchQuery: this.filterData.searchQuery,
      export: true,
    };

    this.spinner.start('export');
    this.api
      .callApi(this.constant.GATEPASSBYCOMPANYDATA, body, 'POST', true, true, true, true)
      .subscribe((res: any) => {
        var blob = new Blob([res], { type: 'text/xlsx' });
        saveAs(blob, 'GatePasses.xlsx');
        this.spinner.stop('export');
      });
  }

  checkpermission() {
    this.spinner.start('perm');
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
              permissionval.formName == 'GatePassEntry' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'GatePassEntry' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'GatePassEntry' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'GatePassEntry' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop('perm');
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getGatepass();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getGatepass();
    }
  }

  view(att: any) {
    window.open(this.apiURL + att, '_blank');
  }

  onSubmit(val?: any) {
    this.commonFilterData = val;
    this.filterData.startdate = val.startdate;
    this.filterData.enddate = val.enddate;
    this.filterData.userMasterID = val.user;

    this.filterData.status = val.gpStatus;
    this.filterData.companyMasterID = val.company;
    this.getGatepass();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getGatepass();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getGatepass();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/gatepasses/gatepass/add_gatepass']);
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
          gatePassid: id,
        };
        this.spinner.start('confirm');
        this.api
          .callApi(this.constant.DELETEGATEPASSDATA, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.getGatepass();
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
          gatePassid: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.GATEPASSSTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.getGatepass();
              this.spinner.stop('deactive');
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
      text: 'User will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          gatePassid: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.GATEPASSSTATUSCHANGES, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.getGatepass();
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

  clear() {
    this.formValue = this.formValueStorageService.getData();

    this.commonFilterData = null;
    this.rows = [];
    this.filterData = {
      page: this.formValue.ListGatepassComponent?.body?.page ? this.formValue.ListGatepassComponent?.body?.page : 1,
      limit: this.formValue.ListGatepassComponent?.body?.limit ? this.formValue.ListGatepassComponent?.body?.limit : 10,
    startdate: '',
    enddate: '',
    companyMasterID: null,
    status: '',
    userMasterID: '',
    searchQuery: '',
  };

    this.formValueStorageService.removeData('ListGatepassComponent', false);
  }

  changeshowfields() {
    this.ngOnInit();
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  depositdata(data: any) {
    this.depositid = data.gatePassid;
  }
  refundSubmit() {
    if (!this.addrefund.valid) {
      return;
    }
    let body = {
      gatePassid: this.depositid,
      inTime: this.addrefund.value.inTime,
      checkINattachment: this.base64textString,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.api.callApi(this.constant.UPDATEGATEPASS1, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModal.nativeElement.click();
          this.ngOnInit();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });

          setTimeout(() => {
            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });

          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.base64textString = '';
        this.spinner.stop();
      },
    );
  }

  refundSubmit1() {
    if (!this.addrefund1.valid) {
      return;
    }
    let body = {
      gatePassid: this.depositid,
      outTime: this.addrefund1.value.outTime,
      checkOUTattachment: this.base64textString,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.api.callApi(this.constant.UPDATEGATEPASS1, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModal1.nativeElement.click();
          this.ngOnInit();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });

          setTimeout(() => {
            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });

          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.base64textString = '';
        this.spinner.stop();
      },
    );
  }

  downloadFile() {
    let data = [];
    let data2 = {
      page: 1,
      limit: 10,
      startdate: this.filterData.startdate,
      enddate: this.filterData.enddate,
      id: this.filterData.companyMasterID,
      status: this.filterData.status,
      userMasterID: this.filterData.userMasterID,
      searchQuery: this.filterData.searchQuery,
    };

    this.api
      .callApi(this.constant.GATEPASSBYCOMPANYDATA, data2, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows1 = res.data;

          for (var i = 0; i < this.rows1.length; i++) {
            let displayname;
            if (this.rows1[i].userMasterID == null) {
              displayname = '';
            } else {
              displayname = this.rows1[i].userMaster.displayName;
            }

            let meetingplace;
            if (this.rows1[i].meetingPlaceID == null) {
              meetingplace = '';
            } else {
              meetingplace = this.rows1[i].meetingPlace.meetingPlaceName;
            }

            const data1 = {
              gatePassid: this.rows1[i].gatePassid,
              visitor:
                this.rows1[i].visitor.visitorsFirstName +
                '' +
                this.rows1[i].visitor.visitorsLastName,
              visitorCompany: this.rows1[i].visitor.visitorsComapny,
              CompanyName: this.rows1[i].companyMaster.companyName,
              userName: this.rows1[i].userMaster.displayName,
              date: this.rows1[i].date,
              inTime: this.rows1[i].inTime,
              outTime: this.rows1[i].outTime,
              fromTime: this.rows1[i].fromTime,
              toTime: this.rows1[i].toTime,
              MeetingPlace: meetingplace,
              remarks: this.rows1[i].remarks,
              status: this.rows1[i].status,
              createBy: this.rows1[i].createBy,
              createdAt: this.rows1[i].createdAt,
              updatedAt: this.rows1[i].updatedAt,
              updateBy: this.rows1[i].updateBy,
            };

            if (data1.status == 1) {
              data1.status = 'Active';
            } else {
              data1.status = 'Deactive';
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
          saveAs(blob, 'GatePass.csv');
        }
      });
  }

  editimage(image) {
    this.image = image;
  }

  onUploadChange(evt: any) {
    const file = evt.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e) {
    // this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
    this.base64textString = btoa(e.target.result);
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  navigateToEditPage(rowData: any): void {
    if (this.commonFilterData && this.commonFilterData != null && Object.keys(this.commonFilterData).length > 0)
      this.formValueStorageService.addData(
        'commonFilterData',
        this.commonFilterData
      );
    this.formValueStorageService.navigate(
      'ListGatepassComponent',
      this.filterData,
      '/gatepasses/gatepass/edit_gatepass',
      rowData.gatePassid,
    );
  }

  init(val: any){
    this.filterData.userMasterID = val.map((x) => x.userMasterID)
    this.getGatepass()
  }
}
