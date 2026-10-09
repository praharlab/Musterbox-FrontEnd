import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NgForm, NgModel } from '@angular/forms';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { saveAs } from 'file-saver';
import * as xlsx from 'xlsx';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-asignassettoemp',
    templateUrl: './asignassettoemp.component.html',
    styleUrls: ['./asignassettoemp.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AsignassettoempComponent implements OnInit {

  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('lgModal') modal: any;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('addcomp1') addcomp1: NgForm;
  @ViewChild('addcomp2') addcomp2: NgForm;
  temp = [];
  columns = [
    { prop: 'title', name: 'Title' },
    { prop: 'sales', name: 'Sales' },
    { prop: 'stock', name: 'Stock' },
    { prop: 'category', name: 'Category' },
    { prop: 'id', name: 'Id' },
  ];
  itemsPerPage = 10;
  limit = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected: any = [];
  selectAllState = '';
  itemOrder = 'Title';
  itemOptionsOrders = ['Title', 'Category', 'Status', 'Label'];
  displayOptionsCollapsed = false;
  todoItems: any;
  rows: any;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: localStorage.getItem('company_id'),
    searchQuery: '',
    userMasterID: '',
    assetCategoryID: '',
    assetMasterID: '',
    fromDate: '',
    toDate: ''
  };
  bb = {
    companyMasterID: localStorage.getItem('company_id'),
    assetCategoryID: 0,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  alldata1: any;
  ipAddress: any;
  current_date = new Date().toISOString().slice(0, 10);
  allbranch: any = [];
  ownerList: any;
  ownerList1: any;
  asset: any;
  images: any = [];
  editbyid: any = [];
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  assetN: any;
  allcomp: any;

  product: any = [];
  company_id: any;
  usertype: any;
  tempcomp: any;
  asset1: any;
  assetN1: any;
  currDate: any = new Date().toISOString().slice(0, 10);

  currentPage: number;
  formValue: any;
  selectedUser: string;
  selectedName: string;
  selectedCategory: string;
  selectedCompany: any = +localStorage.getItem('company_id');
  minDate: any;
  file: any;
  assetCayegory: any;
  selectedCategory1: string;
  companyId: number;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/assets/assetassigntoemp',
          this.adminRoot + '/assets/assetassigntoemp/edit_assign_asset',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('AsignassettoempComponent', false);
        }
      }
    });
  }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.companyId = +localStorage.getItem('company_id');
    this.getAssetCategory(this.companyId);
    this.usertype = localStorage.getItem('usertype');

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('AsignassettoempComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: localStorage.getItem('company_id'),
        searchQuery: '',
        userMasterID: '',
        assetCategoryID: '',
        assetMasterID: '',
        fromDate: '',
        toDate: ''
      };
    } else {
      this.filterData = this.formValue.AsignassettoempComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getItems();
    this.alldata(this.selectedCompany);
    this.getIPAddress();
    this.checkpermission();
    this.getcompany();
    this.getproduct();
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.allcomp = res.data;
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

  getproduct() {
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
            this.product = res.data;
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
            this.product = res.data;

            this.spinner.stop();
          }
        });
    }
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
              permissionval.formName == 'AssetAsignEmp' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssetAsignEmp' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssetAsignEmp' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AssetAsignEmp' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/assets/assetassigntoemp/add_assign_asset']);
  }
  editROW(id: any) {
    this.router.navigate([this.adminRoot + '/assets/assetassigntoemp/edit_assign_asset' + id]);
  }

  alldata(ids: any) {
    this.ownerList = [];
    this.allbranch = [];
    this.assetN = [];
    this.asset = [];
    this.selectedName = '';
    this.selectedUser = '';
    this.selectedCategory = '';

    if (!ids) return;


    this.tempcomp = ids;
    const filterData = {
      page: '',
      limit: '',
      companyMasterID: ids,
    };
    this.spinner.start('user');
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.ownerList = res.data;
        }
        this.spinner.stop('user');
      });


    this.spinner.start('asset')
    this.api
      .callApi(this.constant.GETASSETCATEGORYDATA1 + ids, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.asset = res.data;
        }
        this.spinner.stop('asset');
      });
  }

  assetNameselect(id: any) {
    this.assetN = [];
    this.selectedName = '';

    if (!id) return;

    this.bb.assetCategoryID = id;
    this.bb.companyMasterID = this.tempcomp;

    this.spinner.start('asset')
    this.api
      .callApi(this.constant.GETBYASSETCATEGORYID, this.bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.assetN = res.data;
        }
        this.spinner.stop('asset');

      });
  }

  alldata11() {
    const filterData11 = {
      page: '',
      limit: '',
      companyMasterID: this.editbyid.employee.companyMasterId,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, filterData11, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.ownerList1 = res.data;
          this.spinner.stop();
        }
      });
  }
  alldata21() {
    this.api
      .callApi(
        this.constant.GETASSETCATEGORYDATA1 + this.editbyid.employee.companyMasterId,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.asset1 = res.data;

          this.spinner.stop();
        }
      });
  }

  assetNameselect1() {
    this.bb.assetCategoryID = this.editbyid.assetCategoryID;
    this.bb.companyMasterID = this.tempcomp;
    this.assetN1 = [];
    if (this.editbyid.length != 0) {
      this.editbyid.assetName = '';
    }

    this.api
      .callApi(this.constant.GETBYASSETCATEGORYID, this.bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.assetN1 = res.data;

          this.spinner.stop();
        }
      });
  }
  assetNameupdate(id: any) { }

  getItems(): void {
    this.spinner.start('oninit2');
    this.api
      .callApi(this.constant.GETALLassignasset, this.filterData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
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
        this.getItems();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getItems();
    }
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getItems();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getItems();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        this.images.push(event.target.files[i]);
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  edit(item: any) {
    this.bb.assetCategoryID = item.assetCategoryID;
    this.assetN = [];
    this.minDate = item.assignDate;

    this.spinner.start('asset')
    this.api
      .callApi(this.constant.GETBYASSETCATEGORYID, this.bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.assetN = res.data;
        }
        this.spinner.stop('asset');
      });
    //this.assetNameselect(item.assetCategoryID)
    this.editbyid = item;
    for (var i = 0; i < this.editbyid.assetImages.length; i++) {
      this.editbyid.assetImages[i] =
        this.apiURL + 'uploads/user/assets/' + this.editbyid.assetImages[i];
    }
  }
  downloadFile() {
    this.spinner.stop('start');

    let mainbody: any = {
      companyMasterID: this.filterData.companyMasterID,
      searchQuery: this.filterData.searchQuery,
      userMasterID: this.filterData.userMasterID,
      assetCategoryID: this.filterData.assetCategoryID,
      assetMasterID: this.filterData.assetMasterID,
      fromDate: this.filterData.fromDate,
      toDate: this.filterData.toDate,
      exportData: true
    };

    this.api
      .callApi(this.constant.GETALLassignasset, mainbody, 'POST', true, false, true, true)
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
    saveAs(blob, 'AssignAsset.xlsx');
    this.spinner.stop('start');
  }

  onSubmit() {

    if (!this.addcomp.valid) {
      return;
    }

    this.filterData.companyMasterID = this.addcomp.value.companyMasterID
    this.filterData.userMasterID = this.addcomp.value.userMasterID
    this.filterData.assetCategoryID = this.addcomp.value.assetCategoryID
    this.filterData.assetMasterID = this.addcomp.value.assetName
    this.filterData.fromDate = this.addcomp.value.fromDate
    this.filterData.toDate = this.addcomp.value.toDate
    this.getItems();


  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }
  onSubmit1() {
    if (!this.addcomp1.valid) {
      return;
    }

    const formData = new FormData();
    formData.append('assignAssetToEmployeeID', this.editbyid.assignAssetToEmployeeID);
    formData.append('userMasterID', this.addcomp1.value.userMasterID);
    formData.append('assetCategoryID', this.addcomp1.value.assetCategoryID);
    formData.append('assetMasterID', this.addcomp1.value.assetName);
    formData.append('description', this.addcomp1.value.description);
    formData.append('assignDate', this.addcomp1.value.assignDate);
    for (var i = 0; i < this.images.length; i++) {
      formData.append('assetImages', this.images[i]);
    }
    formData.append('updateBy', localStorage.getItem('id'));
    formData.append('updateByIp', this.ipAddress);

    this.spinner.start();
    this.api
      .callApi(this.constant.UPDATEEMPLOYEEASSIGN, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.spinner.stop();
              this.router.navigate([this.adminRoot + '/assets/assetassigntoemp']).then(() => {
                window.location.reload();
                this.spinner.stop();
              });
            }, 3000);
          } else {
            this.handleError(res.message);
            this.spinner.stop();
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop();
        },
      );
  }
  onSubmit2() {
    if (!this.addcomp2.valid) {
      return;
    }

    const body = {
      assignAssetToEmployeeID: this.editbyid.assignAssetToEmployeeID,
      returnDate: this.addcomp2.value.returnDate,
    };

    this.spinner.start();
    this.api.callApi(this.constant.RETURNEMPLOYEEASSIGN, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop();
            this.router.navigate([this.adminRoot + '/assets/assetassigntoemp']).then(() => {
              window.location.reload();
              this.spinner.stop();
            });
          }, 3000);
        } else {
          this.handleError(res.message);
          this.spinner.stop();
        }
      },
      (err) => {
        this.handleError(err.error.message);
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
          assignAssetToEmployeeID: id,
        };
        this.spinner.start('active');
        this.api.callApi(this.constant.DELETEASSET, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.getItems();
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
          assignAssetToEmployeeID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api.callApi(this.constant.ASSETSTATUSCHANGE, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.getItems();
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
          assignAssetToEmployeeID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api.callApi(this.constant.ASSETSTATUSCHANGE, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.getItems();
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

  selectcompany(event) {
    const filterData = {
      page: '',
      limit: '',
      companyMasterID: event,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.ownerList = res.data;
          this.selectAllForDropdownItems(this.ownerList);
          this.ownerList.map((el) => {
            el.name = el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')';
          });
          this.spinner.stop();
        }
      });
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
      'AsignassettoempComponent',
      this.filterData,
      '/assets/assetassigntoemp/edit_assign_asset',
      rowData.assignAssetToEmployeeID,
    );
  }
  clear() {
    window.location.reload();
  }

  // demo() {
  //   window.open('/assets/Demo Division.xlsx', '_blank');
  // }
  demo() {


    const AssetNames = this.assetN.map((assetName) => assetName.assetName);

    // Create workbook
    const workbook = xlsx.utils.book_new();

    // New worksheet data (only column names)
    const newWorksheetData = [
      [
        'User Number',
        'Asset Name',
        'Description',
        'Quantity',
        'Assign Date (YYYY-MM-DD)',
        'Return Date (YYYY-MM-DD)',
      ],
    ];

    // Create the new worksheet with column names only
    const newWorksheet = xlsx.utils.aoa_to_sheet(newWorksheetData);
    xlsx.utils.book_append_sheet(workbook, newWorksheet, 'New Workbook');

    // Create the worksheet for India's City List
    const AssetWorkSheet = xlsx.utils.aoa_to_sheet([
      ['Asset Name'],
      ...AssetNames.map((assetName) => [assetName]),
    ]);
    xlsx.utils.book_append_sheet(workbook, AssetWorkSheet, 'Asset Names');

    // Generate Excel file for the combined data
    const excelBuffer = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    saveAs(excelBlob, 'AssetDemoFile.xlsx');

  }

  downloadDemoExcel() {
    this.spinner.start('start');

    let mainbody: any = {
      assetCategoryID: this.addimportuser.value.assetCategoryID,
      companyMasterID: this.addimportuser.value.companyMasterID,
    };

    this.api
      .callApi(
        this.constant.EXPORTEMPLOYEEASSET,
        mainbody,
        'POST',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => this.handleDemoFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }
  private handleDemoFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Import Asset.xlsx');
    this.spinner.stop('start');
  }
  onSelectFile(event: any) {
    this.file = event.target.files && event.target.files[0];
  }


  submit() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('companyMasterID', this.addimportuser.value.companyMasterID);
      formData.append('assetCategoryID', this.addimportuser.value.assetCategoryID)
      formData.append('createBy', localStorage.getItem('id'));
      formData.append('createByIp', this.ipAddress);

      this.spinner.start('upload');
      this.api
        .callApi(this.constant.UPLOADASSET, formData, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });

              this.file = {};
              this.addimportuser.resetForm();
              this.closeModal.nativeElement.click();
              this.selectedCompany = +localStorage.getItem('company_id');

              setTimeout(() => {
                this.modal.hide();
                this.ngOnInit();
                this.spinner.stop('upload');
              }, 3000);
            } else {
              this.handleError(res.message);
              this.spinner.stop('upload');
            }
          },
          (err) => {
            this.handleError(err.error.message);

            this.file = {};
            this.addimportuser.resetForm();
            this.closeModal.nativeElement.click();
            this.spinner.stop('upload');
          },
        );
    }
  }

  resetForm() {
    this.addimportuser.resetForm();
    this.assetCayegory = [];
    // this.companyId = +localStorage.getItem('company_id');
    // this.getAssetCategory(this.companyId);
  }

  getAssetCategory(ids: any) {
    this.assetCayegory = [];
    this.selectedCategory1 = ''

    if (!ids) return;

    this.spinner.start('asset')
    this.api
      .callApi(this.constant.GETASSETCATEGORYDATA1 + ids, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.assetCayegory = res.data;
        }
        this.spinner.stop('asset');
      });
  }


}
