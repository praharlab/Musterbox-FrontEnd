import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, NgModel } from '@angular/forms';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-assign-role',
    templateUrl: './assign-role.component.html',
    styleUrls: ['./assign-role.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AssignRoleComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addcomp2') addcomp2: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  temp = [];

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];

  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected: any;
  rows: any = [];
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: [],
    companyMasterID: localStorage.getItem('company_id'),
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  apiURL = environment.apiUrl;

  ipAddress: any;
  allbranch: any = [];
  ownerList: any;

  permissionCreate: any = [];
  permissionView: any = [];
  permissionEdit: any = [];
  allcomp: any;

  company_id: any;
  usertype: any;

  finalbranch: any;
  selectedRole: string;
  allRoles: any = [];

  allbranch1: any = [];
  ownerList1: any = [];
  allRoles1: any = [];

  userrights: any = [];
  editrights: any = [];
  formdata: any;
  showMyContainer: boolean = false;
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.company_id = +localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.getIPAddress();
    this.checkpermission();
  }
  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.getAllUserPermission()
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.getAllUserPermission()
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
          this.permissionCreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'UserPermission' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.permissionView = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'UserPermission' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissionEdit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'UserPermission' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.spinner.stop();
        }
      });
  }


  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  onSubmit1(val: any) {
    this.filterData.userMasterID = val.user;
    this.filterData.page = 1;
    this.getAllUserPermission()
  }

  getAllUserPermission() {
    this.spinner.start('main');
    this.api
      .callApi(this.constant.LISTUSERPERMISSION, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop('main');
        }
      });
  }

  getCompanyData() {
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
            this.allcomp = res.data;
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
            this.allcomp = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  onSubmit2() {
    if (!this.addcomp2.valid) {
      return;
    }
    let body = {
      userMasterID: this.addcomp2.value.userMasterID,
      roleMasterID: this.addcomp2.value.role,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };

    this.spinner.start('getAll');
    this.api
      .callApi(this.constant.ASSIGNROLE, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.closeModal.nativeElement.click();

          this.getAllUserPermission();

          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          this.addcomp2.resetForm();
        } else {
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        }
        this.spinner.stop('getAll');
      });
  }

  selectcompany(event: any, id: any) {
    if (Number(id) == 1) {
      this.allbranch1 = [];
      this.ownerList1 = [];
      this.allRoles1 = [];
    } else {
      this.selected = '';
      this.allbranch = [];
      this.ownerList = [];
      this.finalbranch = '';
      this.allRoles = [];
      this.selectedRole = '';
    }

    if (event) {
      this.company_id = event;
      const filterData = {
        companyMasterID: event,
      };
      this.spinner.start('alluser');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            if (Number(id) == 1) {
              this.ownerList1 = res.data;
              this.selectAllForDropdownItems(this.ownerList1);
              let data1 = [];
              this.ownerList1.forEach(async (rating) => {
                data1.push(rating.userMasterID);
              });
            } else {
              this.ownerList = res.data;
              this.selectAllForDropdownItems(this.ownerList);
              let data1 = [];
              this.ownerList1.forEach(async (rating) => {
                data1.push(rating.userMasterID);
              });
            }
          }
          this.spinner.stop('alluser');
        });

      this.spinner.start('allbranch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
        .subscribe((res: any) => {

          if (id == 1) {
            this.allbranch1 = res;
          } else {
            this.allbranch = res;
          }

          this.spinner.stop('allbranch');
        });

      let body = {
        companyMasterID: event,
      };
      this.spinner.start('allroles');
      this.api
        .callApi(this.constant.LISTROLEMASTER, body, 'POST', true, true, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            if (id == 1) {
              this.allRoles1 = res.data;
            } else {
              this.allRoles = res.data;
            }
          }
          this.spinner.stop('allroles');
        });
    }
  }

  getAllListRole(companyMasterID) {
    let body = {
      companyMasterID: companyMasterID,
    };
    this.spinner.start('allroles');
    this.api
      .callApi(this.constant.LISTROLEMASTER, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allRoles = res.data;
        }
        this.spinner.stop('allroles');
      });
  }

  selectbranch(event: any, id: any) {
    if (id == 1) {
      this.selected = '';
    }

    if (event) {
      const filterData = {
        companyMasterID: this.company_id,
        branchMasterID: event,
      };
      this.spinner.start('allcont');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            if (id == 1) {
              this.ownerList1 = res.data;
              this.selectAllForDropdownItems(this.ownerList1);
            } else {
              this.ownerList = res.data;
              this.selectAllForDropdownItems(this.ownerList);
            }
          }
          this.spinner.stop('allcont');
        });
    } else {
      const filterData = {
        companyMasterID: this.company_id,
      };
      this.spinner.start('alluser');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            if (id == 1) {
              this.ownerList1 = res.data;
              this.selectAllForDropdownItems(this.ownerList1);
            } else {
              this.ownerList = res.data;
              this.selectAllForDropdownItems(this.ownerList);
            }
          }
          this.spinner.stop('alluser');
        });
    }
  }
  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
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

                  this.editrights = res.data;

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

  getCompany(companyMasterID: string) {
    this.filterData.companyMasterID = companyMasterID;
    this.getAllUserPermission()
  }

  clear() {
    this.rows = [];
    this.filterData = {
      page: 1,
      limit: 10,
      userMasterID: [],
      companyMasterID: localStorage.getItem('company_id'),
    };
  }

  initData(companyMasterID: number) {
    this.getAllListRole(companyMasterID)
    this.getCompanyData()
  }
}
