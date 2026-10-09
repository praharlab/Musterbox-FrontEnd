import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import * as xlsx from 'xlsx';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-view-customer',
    templateUrl: './view-customer.component.html',
    styleUrls: ['./view-customer.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViewCustomerComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('lgModal') modal: any;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;

  rows: any = [];
  apiURL = environment.apiUrl;
  columns = [
    { name: 'Company Name', prop: 'companyName' },
    { name: 'Company City', prop: 'subCompanyRequired' },
    { name: 'Company Email', prop: 'companyEmail' },
    { name: 'Status', prop: 'status' },
    { name: 'Company ID', prop: 'companyMaster.companyName' },
  ];
  ColumnMode = ColumnMode;
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: +localStorage.getItem('company_id'),
    cityName: null,
    searchQuery: '',
    countryName: null,
    stateName: null,
    exportData: false,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  usertype: any;
  company_id: any;
  rows1: any = [];
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  childcompany: string;
  company: any;
  addcomp: any;
  comp: any;
  countryName1: any;
  stateName1: any;
  filter: string;
  adminRoot = environment.adminRoot;

  limit = 10;
  currentPage: number;
  formValue: any;

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
          this.adminRoot + '/masters/customer',
          this.adminRoot + '/masters/customer/edit_customer',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ViewCustomerComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');

    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ViewCustomerComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        companyMasterID: +localStorage.getItem('company_id'),
        cityName: null,
        searchQuery: '',
        countryName: null,
        stateName: null,
        exportData: false,
      };
    } else {
      this.filterData = this.formValue.ViewCustomerComponent.body;
    }

    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getIPAddress();
    this.checkpermission();
    this.getcompany();
    this.getallcountry();
    this.getAllData();

    if (this.filterData.countryName) this.getStateByCountry(this.filterData.countryName);
    if (this.filterData.stateName) this.getCityByState(this.filterData.stateName);
  }

  getStateByCountry(country: any) {
    if (!country) {
      return;
    }
    this.api
      .callApi(this.constant.GETSTATEBYCOUNTRY + country, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.state = res.data;
        },
        (err) => {
          this.handleError(err.error.message);
        },
      );
  }

  getCityByState(state: any) {
    if (!state) {
      return;
    }
    this.api
      .callApi(this.constant.GETCITYBYSTATE + state, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.city = res.data;
        },
        (err) => {
          this.handleError(err.error.message);
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Customer' && permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Customer' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Customer' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'Customer' && permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getAllData();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getAllData();
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
      this.getAllData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getAllData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/masters/customer/add_customer']);
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
          customerID: id,
          cityMasterID: this.finalcityid,
        };
        this.spinner.start('confirm');
        this.api.callApi(this.constant.DELETECUSTOMER, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getAllData();
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
      text: 'Customer will be Deleted!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          customerID: id,
          status: '0',
        };
        this.spinner.start('deactive');
        this.api
          .callApi(this.constant.CUSTOMERSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getAllData();
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
      text: 'Customer will be Added!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Add it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          customerID: id,
          status: '1',
        };
        this.spinner.start('active');
        this.api
          .callApi(this.constant.CUSTOMERSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.getAllData();
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

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.cityName = +this.datefilter.value.cityName;
    this.filterData.countryName = +this.datefilter.value.countryName;
    this.filterData.stateName = +this.datefilter.value.stateName;
    this.filterData.companyMasterID = this.datefilter.value.companyName;
    this.getAllData();
  }

  getAllData() {
    this.spinner.start('oninit2');
    // Call the API with the filterData object
    this.api
      .callApi(
        this.constant.getAllCUSTOMERDataByCompanyId,
        this.filterData,
        'POST',
        true,
        false,
        true,
      )
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

  // downloadFilteredData() {
  //   let data = [];

  //   const data2 = {
  //     page: "",
  //     limit: "",
  //     id: '',
  //     cityName: ''
  //   }

  //   if (!this.datefilter.valid) {
  //     data2.id = localStorage.getItem('company_id')
  //   }else{
  //     data2.cityName = this.datefilter.value.cityName
  //     data2.id = this.datefilter.value.companyName
  //   }
  //   data2.id = localStorage.getItem('company_id')
  //   // Call the API with the filterData object
  //   this.api.callApi(
  //     this.constant.getAllCUSTOMERDataByCompanyId,
  //     data2,
  //     'POST',
  //     true,
  //     false,
  //     true
  //   ).subscribe((res: any) => {
  //     if (res.status == 200) {
  //       data = res.data;
  //     }
  //   });

  //   // Use the filtered data instead of making a new API call
  //   const filteredData = data;

  //   this.spinner.start();
  //   for (var i = 0; i < filteredData.length; i++) {
  //     const data1 = {
  //       customerID: filteredData[i].customerID,
  //       customerName: filteredData[i].customerName,
  //       companyName: filteredData[i].companyName,
  //       currentLocation: filteredData[i].currentLocation,
  //       latitude: filteredData[i].latitude,
  //       longitude: filteredData[i].longitude,
  //       address: filteredData[i].address,
  //       zipcode: filteredData[i].zipcode,
  //       cityName: filteredData[i].cityMaster.cityName,
  //       Company: filteredData[i]['companyMaster.companyName'],
  //       stateName: filteredData[i].cityMaster.stateMaster.stateName,
  //       countryName: filteredData[i].cityMaster.stateMaster.countryMaster.countryName,
  //       status: filteredData[i].status,
  //       createdAt: filteredData[i].createdAt,
  //       updatedAt: filteredData[i].updatedAt,
  //     };

  //     if (data1.status == 1) {
  //       data1.status = 'Active';
  //     } else {
  //       data1.status = 'Deactive';
  //     }
  //     data.push(data1);
  //   }

  //   const replacer = (key, value) => (value === null ? '' : value);
  //   const header = Object.keys(data[0]);
  //   let csv = data.map((row) =>
  //     header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(',')
  //   );
  //   csv.unshift(header.join(','));
  //   let csvArray = csv.join('\r\n');

  //   var blob = new Blob([csvArray], { type: 'text/csv' });
  //   saveAs(blob, 'filtered_customer.csv');

  //   this.spinner.stop();
  // }

  demo1() {
    const data = {
      countryId: 103, // Replace 1 with the actual ID of India in the CountryMaster table
      page: '',
      limit: '',
    };

    // Fetch cities for India based on the countryId
    this.api
      .callApi(this.constant.GETALLINDIACITY, data, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status === 200) {
          const cityNames = res.data.map((city) => city.cityName);

          // Create workbook
          const workbook = xlsx.utils.book_new();

          // New worksheet data (only column names)
          const newWorksheetData = [
            [
              'customerName',
              'companyName',
              'mobileNumber1',
              'address',
              'zipcode',
              'city',
              'MobileNumber2',
              'Email',
              'Website',
              'Current Location',
              'Latitude',
              'Longitude',
            ],
          ];

          // Create the new worksheet with column names only
          const newWorksheet = xlsx.utils.aoa_to_sheet(newWorksheetData);
          xlsx.utils.book_append_sheet(workbook, newWorksheet, 'New Workbook');

          // Create the worksheet for India's City List
          const cityWorksheet = xlsx.utils.aoa_to_sheet([
            ['City Name'],
            ...cityNames.map((city) => [city]),
          ]);
          xlsx.utils.book_append_sheet(workbook, cityWorksheet, 'City List');

          // Generate Excel file for the combined data
          const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          });
          const excelBlob = new Blob([excelBuffer], {
            type: 'application/octet-stream',
          });
          saveAs(excelBlob, 'CombinedData.xlsx');
        }
      });
  }

  onSelectFile(event: any) {
    this.file = event.target.files && event.target.files[0];
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  submit() {
    if (this.file) {
      const formData = new FormData();
      if (this.childcompany == 'false') {
        formData.append('file', this.file);
        formData.append('companyMasterID', this.addimportuser.value.company);
        formData.append('createBy', localStorage.getItem('id'));
        formData.append('createByIp', this.ipAddress);
      } else {
        formData.append('file', this.file);
        formData.append('companyMasterID', localStorage.getItem('company_id'));
        formData.append('createBy', localStorage.getItem('id'));
        formData.append('createByIp', this.ipAddress);
      }
      this.spinner.start();
      this.api
        .callApi(this.constant.UPLOADEXCELCUSTOMER, formData, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              setTimeout(() => {
                this.modal.hide();
                this.ngOnInit();
                this.spinner.stop();
              }, 3000);
            } else {
              this.handleError(res.message);
              this.myInputVariable.nativeElement.value = '';
              this.spinner.stop();
            }
          },
          (err) => {
            this.handleError(err.error.message);
            this.myInputVariable.nativeElement.value = '';
            this.spinner.stop();
          },
        );
    }
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

  getallcountry() {
    let body = {
      page: '',
      limit: '',
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETCOUNTRYDATA, body, 'POST', true, false, false)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.country = res.data;
          this.spinner.stop();
        }
      });
  }
  selectcountry(country: any) {
    this.countryName1 = country;
    this.stateName1 = null;
    this.filterData.cityName = null;
    this.filterData.stateName = null;

    this.state = [];
    this.city = [];

    if (!country) {
      return;
    }
    this.api
      .callApi(this.constant.GETSTATEBYCOUNTRY + country, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.state = res.data;
        },
        (err) => {
          this.handleError(err.error.message);
        },
      );
  }

  selectstate(state: any) {
    this.stateName1 = state;
    this.filterData.cityName = null;
    this.city = [];

    if (!state) {
      return;
    }
    this.api
      .callApi(this.constant.GETCITYBYSTATE + state, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.city = res.data;
        },
        (err) => {
          this.handleError(err.error.message);
        },
      );
  }

  selectcity(city: any) {
    if (!city) {
      return;
    }
    this.filterData.cityName = city;
    this.finalcityid = city;
  }

  downloadFilteredData() {
    this.spinner.start('start');
    this.filterData.exportData = true
    this.api
      .callApi(
        this.constant.getAllCUSTOMERDataByCompanyId,
        this.filterData,
        'POST',
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
    saveAs(blob, 'filtered_customer.xlsx');
    this.filterData.exportData = false

    this.spinner.stop('start');
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
      'ViewCustomerComponent',
      this.filterData,
      '/masters/customer/edit_customer',
      rowData.customerID,
    );
  }

  clear() {
    this.datefilter.resetForm();

    this.formValueStorageService.removeData('ViewCustomerComponent', false);
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  importExcel() {
    this.router.navigate([this.adminRoot + '/masters/customer/import_customer/']);
  }
}
