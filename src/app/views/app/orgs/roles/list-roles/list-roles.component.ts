import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm, NgModel } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-roles',
    templateUrl: './list-roles.component.html',
    styleUrls: ['./list-roles.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListRolesComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('addcomp1') addcomp1: NgForm;
  @ViewChild('addcomp2') addcomp2: NgForm;
  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  columns = [
    { name: 'Id', prop: 'checkListID' },
    { name: 'Company Name', prop: 'companyName' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = ['checkListID', 'checkListName', 'designationName', 'Company', 'Status'];
  SelectionType = SelectionType;
  tabledata = ['checkListID', 'checkListName', 'designationName', 'Company', 'Status'];
  // selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    searchQuery: '',
    companyMasterID: +localStorage.getItem('company_id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  rows1: any = [];

  permissioncreate = [];
  permissionedit = [];
  permissionview: any = [];
  permissiondelete = [];
  events: any;
  filter: string;
  date: any;
  allChecklist: any = [];
  checkedCheckedList: any;
  company: any;
  editData: any;
  userrights: any = [];
  editrights: any = [];
  formdata: any;
  showMyContainer: boolean = false;

  limit = 10;
  currentPage: number;
  formValue: any;
  allBranches: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private notifications: AppNotificationService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const protectedRoutes = [
          this.adminRoot + '/orgs/roles',
          this.adminRoot + '/orgs/roles/edit_roles',
          this.adminRoot + '/orgs/roles/clonerole',
        ];

        const isProtectedRoute = protectedRoutes.some((route) => event.url.includes(route));
        if (!isProtectedRoute) {
          formValueStorageService.removeData('ListRolesComponent', false);
        }
      }
    });
  }

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    if (this.formValueStorageService.isEmptyObject('ListRolesComponent')) {
      this.filterData = {
        page: 1,
        limit: 10,
        searchQuery: '',
        companyMasterID: +localStorage.getItem('company_id'),
      };
    } else {
      this.filterData = this.formValue.ListRolesComponent.body;
    }

    this.getlistRoleMaster();
    this.getCompany();
    this.checkpermission();
  }

  getlistRoleMaster() {
    this.spinner.start('main');
    this.api
      .callApi(this.constant.LISTROLEMASTER, this.filterData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.date = res.date;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
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

  getCompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company = res.data;
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
              permissionval.formName == 'RoleMaster' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'RoleMaster' && permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'RoleMaster' && permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'RoleMaster' &&
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
        this.getlistRoleMaster();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getlistRoleMaster();
    }
  }

  onSelect({ selected }): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.rows];
    } else {
      this.selected = [];
    }
    // this.setSelectAllState();
  }

  onSubmit2() {
    if (!this.addcomp2.valid) {
      return;
    }
    this.filterData.companyMasterID = this.addcomp2.value.companyMasterID;
    this.getlistRoleMaster();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getlistRoleMaster();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getlistRoleMaster();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/orgs/roles/add_roles']);
  }

  view(id1: any) {
    this.formdata = [];

    this.spinner.start('loader-1');
    this.api
      .callApi(
        this.constant.VIEWFORMDATA + '?companyMasterID=' + localStorage.getItem('company_id'),
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
                  this.handleError(err.error.message);
                  this.spinner.stop('start');
                },
              );
          }
          this.spinner.stop('loader-1');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('loader-1');
        },
      );
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
      'ListRolesComponent',
      this.filterData,
      '/orgs/roles/edit_roles',
      rowData.roleMasterID,
    );
  }

  navigateToCloneRolePage(rowData: any): void {
    this.formValueStorageService.navigate(
      'ListRolesComponent',
      this.filterData,
      '/orgs/roles/clonerole',
      rowData.roleMasterID,
    );
  }
  viewBranches(item: any) {
    this.allBranches = item;
  }
}
