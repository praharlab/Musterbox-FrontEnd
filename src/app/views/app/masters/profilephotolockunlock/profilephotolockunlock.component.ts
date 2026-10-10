import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { FilterStatusService } from 'src/app/services/filter-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
@Component({
    selector: 'app-profilephotolockunlock',
    templateUrl: './profilephotolockunlock.component.html',
    styleUrls: ['./profilephotolockunlock.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ProfilephotolockunlockComponent implements OnInit {
  @ViewChild('filterform') filterform: NgForm;
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild('updateimportuser') updateimportuser: NgForm;
  @ViewChild('addimportCompanyData') addimportCompanyData: NgForm;
  companyDataFile: any;
  selectedStatus: any = 2; // Initialize to select "All"


  rows: any = [];
  myInputVariable: ElementRef;
  file: any;
  apiURL = environment.apiUrl;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  adminRoot = environment.adminRoot;

  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: +localStorage.getItem('company_id'),
    departmentID: null,
    designationID: null,
    branchMasterID: null,
    // status: 1,
    searchQuery: '',
    isPhotoLock: [0, 1],
    status: [0, 1],
  };
  body = {
    company: '',
    departmentID: '',
    designationID: '',
    status: '',
    page: 1,
    limit: 10,
    searchQuery: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  ipAddress: any;
  rows1: any = [];
  alldepartment: any = [];
  alldesignation: any;
  excel: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  filter: string;
  limit = 10;
  events: any;
  excelevents: any;
  comp: any;
  format: string;

  childcompany: string;
  allbranch: any;
  selectedbranch: any;
  selecteddept: any;
  selecteddesig: any;
  selectedCompany: any;
  currentPage: number;
  searchvalue: any;
  selectedRows: any = [];
  isAllSelected: boolean = false;



  selectedItems: any[] = [];
  allSelected: boolean = false;

  constructor(
    private spinner: NgxUiLoaderService,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private filterService: FilterStatusService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,

  ) { }

  ngOnInit(): void {
    this.childcompany = localStorage.getItem('childcompany');

    if (this.filterService.filterCompany) this.filterData.companyMasterID = this.filterService.filterCompany
    if (this.filterService.filterDepartment) this.filterData.departmentID = this.filterService.filterDepartment
    if (this.filterService.filterDesignation) this.filterData.designationID = this.filterService.filterDesignation
    if (this.filterService.filterBranch) this.filterData.branchMasterID = this.filterService.filterBranch
    this.filter = 'main';
    this.getcompany();
    this.getIPAddress();
    if (this.filterData.companyMasterID) this.selectedCompany = this.filterData.companyMasterID;
    this.SelectedCompany(this.selectedCompany);
    if (this.filterData.branchMasterID) this.selectedbranch = this.filterData.branchMasterID;
    if (this.filterData.departmentID) this.selecteddept = this.filterData.departmentID;
    if (this.filterData.designationID) this.selecteddesig = this.filterData.designationID;
    if (this.filterData.searchQuery) this.searchvalue = this.filterData.searchQuery;
    this.page.offset = (this.filterData.page - 1) * this.filterData.limit;
    this.alldata();
    this.filterService.clearFilterData();
    this.selectedStatus = 2
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }


  alldata() {
    this.spinner.start('alldata');
    if (this.filterData.companyMasterID) this.selectedCompany = this.filterData.companyMasterID;
    this.api
      .callApi(this.constant.GETALLUSERS, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.allSelected = false;
          this.selectedItems = [];
          setTimeout(() => {
            this.currentPage = this.filterData.page;
            this.itemsPerPage = this.filterData.limit;
          }, 200);
        }
        this.spinner.stop('alldata');
      });
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.comp = res.data;

          this.spinner.stop();
        }
      });
  }

  selectedcolumns() {
    this.onSubmit();
  }



  onChange(event: any) {
    this.filterData.page = event.page;
    if (this.filter == 'main') {
      this.alldata();
    } else if (this.filter == 'search') {
      this.updateFilter(this.events);
    } else if (this.filter == 'filt') {
      this.onSubmit();
    }
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.limit = this.filterData.limit;
    if (this.filter == 'main') {
      this.alldata();
    } else if (this.filter == 'search') {
      this.updateFilter(this.events);
    } else if (this.filter == 'filt') {
      this.onSubmit();
    }
  }
  updateFilter(event): void {

    if (event.target) {
      const val = event.target.value.toLowerCase().trim();
      this.events = val;
      this.filterData.searchQuery = val
    } else {
      this.filterData.searchQuery = this.events
    }
    this.filter = 'search';
    this.alldata();
  }
  onSubmit() {
    if (!this.filterform.valid) {
      return;
    }

    // Ensure selectedStatus is always an array
    if (this.selectedStatus == 2) this.filterData.isPhotoLock = [0, 1]
    else if (this.selectedStatus == 0) this.filterData.isPhotoLock = [0]
    else this.filterData.isPhotoLock = [1]
    // const isPhotoLockArray = Array.isArray(this.selectedStatus) ? this.selectedStatus : [this.selectedStatus];

    this.filterData.departmentID = this.filterform.value.departmentID;
    this.filterData.designationID = this.filterform.value.designationID;
    this.filterData.branchMasterID = this.filterform.value.branch;
    this.filterData.companyMasterID = this.filterform.value.company;
    this.filterData.isPhotoLock = this.filterData.isPhotoLock; // Assign the processed array

    this.filter = 'filt';
    this.alldata();
    this.allSelected = false;
  }

  clear() {
    window.location.reload();
  }

  SelectedCompany(id: any) {
    // getDepartmenData() { }

    this.alldepartment = []
    this.alldesignation = []
    this.allbranch = []

    this.selectedbranch = ""
    this.selecteddept = ""
    this.selecteddesig = ""

    if (!id) return;
    this.api
      .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldepartment = res.data;
          // this.filter = 'filt'

          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });

    // getDesignationData() {}

    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;

          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });

    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;

        this.page.totalCount = res.totalcount;
        this.spinner.stop();
      });
  }


  alertLockConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User Profile Photo Lock!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Lock it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          userMasterID: [id],
          isPhotoLock: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.PROFILEPHOTO, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              if (this.filter == 'main') {
                this.alldata();
              } else if (this.filter == 'search') {
                this.updateFilter(this.events);
              } else if (this.filter == 'filt') {
                this.onSubmit();
              }
              this.spinner.stop();
            },
            (err) => {
              this.notifications.create('Error', err.error.message, NotificationType.Bare, {
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

  alertUnclockConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User Profile Photo Unlock!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Unlock it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          userMasterID: [id],
          isPhotoLock: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.PROFILEPHOTO, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              if (this.filter == 'main') {
                this.alldata();
              } else if (this.filter == 'search') {
                this.updateFilter(this.events);
              } else if (this.filter == 'filt') {
                this.onSubmit();
              }
              this.spinner.stop();
            },
            (err) => {
              this.notifications.create('Error', err.error.message, NotificationType.Bare, {
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

  onRowSelect(row: any) {
    const index = this.selectedRows.findIndex(r => r.userMasterID === row.userMasterID);
    if (row.selected && index === -1) {
      this.selectedRows.push(row); // Add to selected rows if not already selected
    } else if (!row.selected && index !== -1) {
      this.selectedRows.splice(index, 1); // Remove from selected rows if deselected
    }

    // Update the "Select All" checkbox status
    this.isAllSelected = this.selectedRows.length === this.rows.length;
  }

  // This method toggles the "Select All" checkbox
  toggleSelectAll(event: any) {
    this.isAllSelected = event.target.checked;
    this.selectedRows = this.isAllSelected ? [...this.rows] : [];
    this.rows.forEach(row => row.selected = this.isAllSelected);
  }

  // Unlock selected users
  unlockSelected() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User Profile Photo Unlock!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Unlock it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          userMasterID: this.selectedItems.map(e => e.userMasterID),
          isPhotoLock: '0',
        };
        this.spinner.start('unlock');
        this.api
          .callApi(this.constant.PROFILEPHOTO, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.alldata();
              this.clearSelection();
              this.spinner.stop('unlock');
            },
            (err) => {
              this.notifications.create('Error', err.error.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop('unlock');
            },
          );
      }
    });
  }

  // Lock selected users
  lockSelected() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User Profile Photo Lock!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Lock it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          userMasterID: this.selectedItems.map(e => e.userMasterID),
          isPhotoLock: '1',
        };
        this.spinner.start('lock');
        this.api
          .callApi(this.constant.PROFILEPHOTO, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.alldata();
              this.clearSelection();
              this.spinner.stop('lock');
            },
            (err) => {
              this.notifications.create('Error', err.error.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop('lock');
            },
          );
      }
    });

  }


  clearSelection() {
    this.selectedRows = [];
    this.isAllSelected = false;
    this.rows.forEach(row => row.selected = false);
  }




  selectAll(event: any) {
    this.allSelected = event.target.checked;

    this.rows.forEach((row) => (row.selected = this.allSelected));
    this.updateSelectedItems();
  }

  selectRow(row: any, event: any) {
    row.selected = event.target.checked;

    this.updateSelectedItems();
    this.cd.detectChanges();
  }

  private updateSelectedItems() {
    this.selectedItems = this.rows.filter((row) => row.selected);
  }
}
