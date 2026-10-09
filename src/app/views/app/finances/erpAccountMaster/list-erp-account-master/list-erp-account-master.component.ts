import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-erp-account-master',
    templateUrl: './list-erp-account-master.component.html',
    styleUrls: ['./list-erp-account-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListErpAccountMasterComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected: any = [];
  SelectionType = SelectionType;
  tabledata = ['UserName', 'ErpAccountID'];
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: localStorage.getItem('company_id'),
    userMasterID: '',
  };
  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    companyMasterID: localStorage.getItem('company_id'),
  };
  body1 = {
    page: 1,
    limit: 10,
    companyMasterID: localStorage.getItem('company_id'),
    userMasterID: '',
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
  ipAddress: any;
  depositid: any;
  alluser: any;
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.checkpermission();
    this.getuser();
    this.geterpmaster();
  }
  getuser() {
    const body = {
      page: '',
      limit: '',
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('user');
    this.api
      .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            this.selectAllForDropdownItems(this.alluser);
            this.spinner.stop('user');
          } else {
            this.spinner.stop('user');
          }
        },
        (err) => {
          this.spinner.stop('user');
        },
      );
  }
  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
      allSelect(items);
    };
  }
  geterpmaster() {
    this.spinner.start('erpMaster');

    this.api
      .callApi(this.constant.ERPACCOUNTBYCOMPANYDATA, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.filter = 'main';
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            this.spinner.stop('erpMaster');
          } else {
            this.spinner.stop('erpMaster');
          }
        },
        (err) => {
          this.spinner.stop('erpMaster');
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
              permissionval.formName == 'ErpAccountLink' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ErpAccountLink' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ErpAccountLink' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ErpAccountLink' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {
    this.events = event;
    this.excelevents = event.target.value;
    const val = event.target.value.toLowerCase().trim();
    this.body.searchQuery = val;
    this.spinner.start('search');
    this.api
      .callApi(this.constant.ERPACCOUNTBYCOMPANYDATA, this.body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.filter = 'search';
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            this.spinner.stop('search');
          } else {
            this.spinner.stop('search');
          }
        },
        (err) => {
          this.spinner.stop('search');
        },
      );
  }

  onSubmit() {
    this.spinner.start('search');
    this.body1.userMasterID = this.selected;
    this.api
      .callApi(this.constant.ERPACCOUNTBYCOMPANYDATA, this.body1, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.filter = 'filter';
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            this.spinner.stop('search');
          } else {
            this.spinner.stop('search');
          }
        },
        (err) => {
          this.spinner.stop('search');
        },
      );
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (this.filter == 'main') {
      this.filterData.page = e.offset + 1;
      this.ngOnInit();
    } else if (this.filter == 'search') {
      this.body.page = e.offset + 1;
      this.updateFilter(this.events);
    } else if (this.filter == 'filter') {
      this.body1.page = e.offset + 1;
      this.onSubmit();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (this.filter == 'main') {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.ngOnInit();
    } else if (this.filter == 'search') {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.updateFilter(this.events);
    } else if (this.filter == 'filter') {
      this.body1.limit = ev;
      this.limit = this.body1.limit;
      this.onSubmit();
    } else {
      console.log('error');
    }
  }
  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/finances/erpAccountMaster/add_erpAccountMaster']);
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
          erpAcountMasterID: id,
        };
        this.spinner.start('delete');
        this.api
          .callApi(this.constant.DELETEERPACCOUNTDATA, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.ngOnInit();
              this.spinner.stop('delete');
            },
            (err) => {
              this.spinner.stop('delete');
            },
          );
      }
    });
  }

  clear() {
    window.location.reload();
  }
  
  changeshowfields() {
    this.ngOnInit();
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
