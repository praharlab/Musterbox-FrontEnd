import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-district',
    templateUrl: './list-district.component.html',
    styleUrls: ['./list-district.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListDistrictComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  rows1 = [];
  selected: any = [];
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
    stateMasterID: null,
    searchQuery: ''
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
  company_id: any;
  alluser: any;
  stateData: any;
  designation1: any;
  image: any;
  target: any;
  resultColumns: any[];
  resultColumns1: any[];
  childcompany: string;
  selected1: any = [];
  companydata: any;
  allasset: any = [];
  selected2: any = [];
  salary: boolean;
  companymasterName: any;
  public users: Array<any> = [];
  employee: any;
  allbranch: any;
  branchfilter: boolean = false;
  employeedata: any;
  currentPage: number;


  alldesignation: any;
  alldepartment: any;
  divisionfilter: any;
  departmentfilter: any;
  designationfilter: any;
  workingareafilter: any;
  selecteddesig: any[];
  selectedDepartment: any[];

  selectedBranch: any[];
  isResetForm: boolean = false;
  adminRoot = environment.adminRoot;
  editData: any;

  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
    {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          const protectedRoutes = [
            '/app/superadminmenus/district',
            '/app/superadminmenus/district/edit_district',
          ];

          const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
          if (!isProtectedRoute) {
            formValueStorageService.removeData('ListDistrictComponent', false);
          }
        }
      });
    }
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();
    if (this.formValueStorageService.isEmptyObject('ListDistrictComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        searchQuery: '',
        stateMasterID: null,
      };
    } else {
      this.filterData = this.formValue.ListDistrictComponent.body;
    }

    this.checkpermission();
    this.getState();
    this.getDistrict();
  }

  getState() {
    const body = {
      page: '',
      limit: ''
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLSTATE, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.stateData = res.data;
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
  checkpermission() {

    this.permissioncreate = [1];
    this.permissionedit = [1];
    this.permissionview = [1];
    this.permissiondelete = [1];

  }

  getDistrict() {
    this.spinner.start('users');
    this.api
      .callApi(this.constant.LISTDISTRICT, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
        }
        this.spinner.stop('users');
      });
  }
  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }
    this.filterData.page = 1;
    this.filterData.limit = 10;
    this.filterData.stateMasterID = this.filterData.stateMasterID ? this.filterData.stateMasterID : null;
    this.getDistrict();
  }
  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/superadminmenus/district/add_district/']);
  }
  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getDistrict();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getDistrict();
    } else {
      console.log('error');
    }
  }
  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getDistrict();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getDistrict();
    }
  }
  clear() {
    this.datefilter.resetForm();

    setTimeout(() => {
      this.rows = [];
      this.filterData = {
        stateMasterID: null,
        page: 1,
        limit: 10,
        searchQuery: ''

      }
      this.page = {
        totalCount: 0,
        offset: 0,
      };
      this.ngOnInit();
    }, 200);
  }
  download() {
    let body1 = {
      page: '',
      limit: '',
      stateMasterID: this.filterData.stateMasterID ? this.filterData.stateMasterID : null,
      searchQuery: this.filterData.searchQuery,
      exportData: true,
    };

    this.spinner.start('start');
    this.api
      .callApi(this.constant.LISTDISTRICT, body1, 'POST', true, false, true, true)
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'District.xlsx');
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
      'ListDistrictComponent',
      this.filterData,
      '/superadminmenus/district/edit_district/',
      rowData.districtID,
    );
  }
}
