import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { UserFormValueStorageService } from 'src/app/services/user-form-value-storage.service';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-emppenalty',
    templateUrl: './emppenalty.component.html',
    styleUrls: ['./emppenalty.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmppenaltyComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('editcomp') editcomp: NgForm;
  @ViewChild('lgModal') lgModal: any;
  @ViewChild('addimportpenalty') addimportpenalty: NgForm;
  @ViewChild('closeModal2') closeModal2: any;

  mediumDateFormat = environment.mediumDateFormat;
  rows: any = [];
  apiURL = environment.apiUrl;
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
  limit = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    company_id: localStorage.getItem('company_id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  ipAddress: any;

  editbyid: any;
  company_id: any;

  usertype: any;
  penalty: any = [];
  ownerList: any;
  penaltya: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  allbranch: any;
  alluser: any;
  selected1: any;
  nguser: any;
  ngbranch: any;
  company: any;
  body1 = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    companyMasterID: +localStorage.getItem('company_id'),
    userMasterID: null,
    searchQuery: '',
    branchMasterID: '',
  };

  events: any;
  excelevents: any;
  allbranchadd: any = [];
  adduser: any = [];
  companyid: any;
  companyID: any;
  showdemoExcel: boolean = false;
  image: null;
  removeItem: any = 1;
  selectedUser: any

  display = false;

  adminRoot = environment.adminRoot;
  formValue: any;
  formUserID: any;
  currentPage: number;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear, CommonFilterButtonFields.Import];
  showRequiredFields: any = [CommonRequiredFields.Company]
  commonFilterData: any

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
    private userFormValueStorageService: UserFormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
    {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          const protectedRoutes = [
            this.adminRoot + '/finances/employeepenalty',
            this.adminRoot + '/userprofile',
          ];

          const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
          if (!isProtectedRoute) {
            formValueStorageService.removeComponentData('EmppenaltyComponent', false);
            formValueStorageService.removeData('commonFilterData', true);
          }
        }
      });
    }
    {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          const protectedRoutes = [
            this.adminRoot + '/finances/employeepenalty',
            this.adminRoot + '/userprofile',
          ];

          const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
          if (!isProtectedRoute) {
            userFormValueStorageService.removeData();
          }
        }
      });
    }
  }
  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = +localStorage.getItem('company_id');

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyComponent('EmppenaltyComponent')) {
      this.body1 = {
        page: 1,
        limit: 10,
        startdate: '',
        enddate: '',
        companyMasterID: +localStorage.getItem('company_id'),
        userMasterID: null,
        searchQuery: '',
        branchMasterID: '',
      };
    } else {
      this.body1 = this.formValue.EmppenaltyComponent;
    }
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getIPAddress();


    this.penaltya = '';
    this.checkpermission();
    this.getcompany();

    if (this.company_id) {
      this.companyID = this.company_id;
      this.showdemoExcel = true;
    }

    if (this.body1.companyMasterID) this.selectcompany(this.body1.companyMasterID, this.usertype);
    if (this.body1.branchMasterID) this.selectbranch(this.body1.branchMasterID, this.usertype);
  }

  Export() {
    const body = {
      page: '',
      limit: '',
      startdate: this.body1.startdate,
      enddate: this.body1.enddate,
      companyMasterID: this.body1.companyMasterID,
      userMasterID: this.body1.userMasterID,
      searchQuery: this.body1.searchQuery,
      export: true,
    };

    this.spinner.start('a');

    this.api.callApi(this.constant.GETALLPENALTY, body, 'POST', true, true, true, true).subscribe(
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
          saveAs(blob, 'EmployeePenalty.xlsx');

          this.spinner.stop('a');
        }
      },
      (err) => {
        this.notifications.create('', err.error.message, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('a');
      },
    );
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

  addPenaltyData() {
    if (!this.addimportpenalty.valid) {
      return;
    }

    const formData = new FormData();

    formData.append('file', this.file);
    formData.append('companyMasterID', this.companyID);
    formData.append('month', this.addimportpenalty.value.month.replace('-', ''));
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIP', this.ipAddress);
    formData.append('fileName', 'penalty');

    this.spinner.start('import');
    this.api
      .callApi(this.constant.UPLOADVARIABLEEXCEL, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });

            this.ngOnInit();
            this.closeModal2.nativeElement.click();
            this.addimportpenalty.resetForm();
            this.showdemoExcel = false;

            this.spinner.stop('import');
          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            }),
              this.addimportpenalty.resetForm();
            this.showdemoExcel = false;
            this.spinner.stop('import');
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.addimportpenalty.resetForm();
          this.showdemoExcel = false;
          this.spinner.stop('import');
        },
      );
  }

  showdemo(id) {
    if (id) {
      this.companyID = id;
      this.showdemoExcel = true;
    } else {
      this.companyID = '';
      this.showdemoExcel = false;
    }
  }

  downloadDemo() {
    this.spinner.start('a');

    const queryString = `?companyMasterID=${this.companyID}&fileName=penalty`;

    this.api
      .callApi(this.constant.GETVARIABLEDEMOEXCEL + queryString, {}, 'GET', true, true, true, true)
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
            saveAs(blob, 'penalty.xlsx');

            this.spinner.stop('a');
          }
        },
        (err) => {
          this.notifications.create('', err.error.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('a');
        },
      );
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('comapny');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company = res.data;

          this.spinner.stop('comapny');
        } else {
          this.spinner.stop('comapny');
        }
      },
      (err) => {
        this.spinner.stop('comapny');
      },
    );
  }

  selectcompany(id, type) {
    this.ngbranch = '';
    this.nguser = [];

    this.companyid = id;

    if (!id) {
      if (type == 'add') {
        this.addcomp.resetForm();
        this.adduser = [];
        this.allbranchadd = [];
        this.penalty = [];
      } else {
        this.datefilter.resetForm();
      }

      return;
    }

    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (type == 'add') {
          this.allbranchadd = res;
        } else {
          this.allbranch = res;
        }
        this.spinner.stop('branch');
      });

    const body = {
      companyMasterID: id,
    };
    this.spinner.start('user');
    this.api
      .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          if (type == 'add') {
            this.adduser = res.data;
          } else {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);
            let data1 = [];
            this.alluser.forEach(async (rating) => {
              data1.push(rating.userMasterID);
            });
            this.selected1 = data1;
          }

          this.spinner.stop('user');
        }
      });
  }

  selectbranch(id, type) {
    this.selectedUser = null;
    if (!id) {
      const body = {
        page: '',
        limit: '',
        companyMasterID: this.companyid,
      };
      this.spinner.start('user');
      this.api
        .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            if (type == 'add') {
              this.adduser = res.data;
            } else {
              this.alluser = res.data;
              this.selectAllForDropdownItems(this.alluser);
              let data1 = [];
              this.alluser.forEach(async (rating) => {
                data1.push(rating.userMasterID);
              });
              this.selected1 = data1;
            }

            this.spinner.stop('user');
          }
        });
    } else {
      this.nguser = [];

      const filterData = {
        branchMasterID: id,
      };

      this.spinner.start('branch');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            if (type == 'add') {
              this.adduser = res.data;
            } else {
              this.alluser = res.data;
              this.selectAllForDropdownItems(this.alluser);
              this.alluser.map((el) => {
                el.name = el.displayName;
              });

              let data1 = [];
              this.alluser.forEach(async (rating) => {
                data1.push(rating.userMasterID);
              });
              this.selected1 = data1;
            }

            this.spinner.stop('branch');
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
              permissionval.formName == 'AssignPenaltyEmp' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignPenaltyEmp' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignPenaltyEmp' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssignPenaltyEmp' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getpenaltylist(id) {
    this.spinner.start('penalty');
    this.api
      .callApi(this.constant.GETPENALTYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.penalty = res.data;
          this.spinner.stop('penalty');
        }
      });
  }

  alldata() {
    const filterData = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.ownerList = res.data;
          this.spinner.stop();
        }
      });
  }

  selectpenalty(event) {
    if (!event) {
      return;
    }
    this.spinner.start('penalty');
    this.api
      .callApi(this.constant.GETPENALTYBYID + event, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.penaltya = res.data.penaltyAmount;

          this.spinner.stop('penalty');
        }
      });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  showAddNewModal() {
    this.lgModal.show();
    this.company_id = +localStorage.getItem('company_id');
    this.selectcompany(this.company_id, 'add');
    this.getpenaltylist(this.company_id);
    this.image = null;
    this.removeItem = 1;
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    // let body = {
    //   userMasterID: this.addcomp.value.userMasterID,
    //   penaltyID: this.addcomp.value.penaltyID,
    //   penaltyAmount: this.addcomp.value.penaltyAmount,
    //   penaltyDate: this.addcomp.value.penaltyDate,
    //   description: this.addcomp.value.description,
    //   createBy: localStorage.getItem('id'),
    //   createByIp: this.ipAddress,
    // };

    var formData = new FormData();

    formData.append('userMasterID', this.addcomp.value.userMasterID);
    formData.append('penaltyID', this.addcomp.value.penaltyID);
    formData.append('penaltyAmount', this.addcomp.value.penaltyAmount);
    formData.append('penaltyDate', this.addcomp.value.penaltyDate);
    formData.append('description', this.addcomp.value.description);
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);
    formData.append('attachment', this.image);

    this.spinner.start('add');
    this.api.callApi(this.constant.CREATEPENALTY, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        this.addcomp.resetForm();
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          this.lgModal.hide();
          this.closeModal.nativeElement.click();
          setTimeout(() => {
            this.getItems();
            this.spinner.stop('add');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('add');
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('add');
      },
    );
  }

  edit(item: any) {
    this.image = null;
    this.removeItem = 1;
    this.editbyid = item;

    this.spinner.start('edit');
    this.api
      .callApi(
        this.constant.GETEMPPENALTYBYID + item.employeePenaltyID,
        {},
        'GET',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.editbyid = res.data;

            this.selectcompany(this.editbyid.employee.companyMasterId, 'add');
            this.getpenaltylist(this.editbyid.employee.companyMasterId);
            this.spinner.stop('edit');
          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('edit');
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('edit');
        },
      );
  }

  onSubmit1() {
    if (!this.editcomp.valid) {
      return;
    }
    // let body = {
    //   employeePenaltyID: this.editbyid.employeePenaltyID,
    //   userMasterID: this.editcomp.value.userMasterID,
    //   penaltyID: this.editcomp.value.penaltyID,
    //   penaltyAmount: this.editcomp.value.penaltyAmount,
    //   penaltyDate: this.editcomp.value.penaltyDate,
    //   description: this.editcomp.value.description,
    //   updateBy: localStorage.getItem('id'),
    //   updateByIp: this.ipAddress,
    // };

    var formData = new FormData();

    formData.append('employeePenaltyID', this.editbyid.employeePenaltyID);
    formData.append('userMasterID', this.editbyid.userMasterID);
    formData.append('penaltyID', this.editcomp.value.penaltyID);
    formData.append('penaltyAmount', this.editcomp.value.penaltyAmount);
    formData.append('penaltyDate', this.editcomp.value.penaltyDate);
    formData.append('description', this.editcomp.value.description);
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);
    if (this.image) formData.append('attachment', this.image);
    if (!this.editbyid.attachment) formData.append('removeFile', this.removeItem);

    this.spinner.start();
    this.api
      .callApi(this.constant.UPDATEEMPLOYEEPENALTY, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          this.editcomp.resetForm();
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.lgModal.hide();
            this.closeModal1.nativeElement.click();
            setTimeout(() => {
              this.getItems();
              this.spinner.stop();
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
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
          employeePenaltyID: id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEEMPLOYEEPENALTY, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.ngOnInit();
              this.spinner.stop();
            },
            (err) => {
              this.notifications.create('Error', err.error.message, NotificationType.Error, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
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
          employeePenaltyID: id,
          status: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.EMPLOYEEDPENALTYSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.ngOnInit();
              this.spinner.stop();
            },
            (err) => {
              this.notifications.create('Error', err.error.message, NotificationType.Error, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
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
          employeePenaltyID: id,
          status: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.EMPLOYEEDPENALTYSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.ngOnInit();
              this.spinner.stop();
            },
            (err) => {
              this.notifications.create('Error', err.error.message, NotificationType.Error, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop();
            },
          );
      }
    });
  }

  getItems(): void {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLPENALTY, this.body1, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          if (this.rows.length > 0) {
            this.showButtons.push(CommonFilterButtonFields.Excel);
          } else {
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear, CommonFilterButtonFields.Import];
          }
          this.spinner.stop();
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.body1.page;
            this.itemsPerPage = this.body1.limit;
          }, 100);
        } else {
        }
      });
  }

  onChange(e: any) {
    this.body1.page = e.offset + 1;
    this.getItems();
  }

  updateFilter(event): void {
    this.events = event;
    this.excelevents = event.target.value;
    const val = event.target.value.toLowerCase().trim();
    this.body1.searchQuery = val;
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLPENALTY, this.body1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          if (this.rows.length > 0) {
            this.showButtons.push(CommonFilterButtonFields.Excel);
          } else {
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear, CommonFilterButtonFields.Import];
          }
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }

  onLimitChange(ev: any) {
    this.body1.limit = ev;
    this.limit = this.body1.limit;
    this.getItems();
  }

  onSubmit2(val?: any) {
    this.commonFilterData = val;
    this.body1.companyMasterID = val.company;
    this.body1.startdate = val.startdate;
    this.body1.enddate = val.enddate;
    this.body1.userMasterID = val.user ? val.user : this.body1.userMasterID;
    this.spinner.start();
    this.getItems();
  }

  onFileChange(event: any) {
    this.image = null;

    if (event.target.files && event.target.files.length > 0) this.image = event.target.files[0];
    else this.image = null;
  }

  openAttachment(item: any) {
    window.open(this.apiURL + 'uploads/employee-penalty-attachments/' + item, '_blank');
  }

  changeRmoveItem() {
    this.editbyid.attachment = null;
  }

  clear() {
    this.commonFilterData = null;
    this.formValue = this.formValueStorageService.getData();
    this.userFormValueStorageService.removeData();
    this.rows = []
    this.body1 = {
      page: this.formValue.EmppenaltyComponent?.page ? this.formValue.EmppenaltyComponent?.page : 1,
      limit: this.formValue.EmppenaltyComponent?.limit ? this.formValue.EmppenaltyComponent?.limit : 10,
      startdate: '',
      enddate: '',
      companyMasterID: +localStorage.getItem('company_id'),
      userMasterID: null,
      searchQuery: '',
      branchMasterID: '',
    };
    this.formValueStorageService.removeComponentData('EmppenaltyComponent', true);
  }

  onActivate(event) {
    if (event.type == 'click') {
      this.display = false;
    }
    if (event.cellIndex == 0) {
      if (this.commonFilterData && this.commonFilterData != null && Object.keys(this.commonFilterData).length > 0)
      this.formValueStorageService.addData(
        'commonFilterData',
        this.commonFilterData
      );
      this.formValueStorageService.addData('EmppenaltyComponent', this.body1);
      this.userFormValueStorageService.navigate('/userprofile', event.row.employee.userMasterID);
    }
  }

  getCompany(val: any) {
    this.body1.companyMasterID = val
    this.getItems();
  }

  emitUsers(users: any){
    this.body1.userMasterID = users.map((x) => x.userMasterID);
  }

}
