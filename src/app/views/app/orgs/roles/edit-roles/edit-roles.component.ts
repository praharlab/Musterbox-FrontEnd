import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-roles',
    templateUrl: './edit-roles.component.html',
    styleUrls: ['./edit-roles.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditRolesComponent implements OnInit {
  @ViewChild('addform') addform: NgForm;
  formdata: any;
  userrights: any = [];
  parentcheck: any;
  childcheck: any;
  operationcheck = false;
  parentid: any;
  isDisabled = false;
  ownerList: any;
  showMyContainer: boolean = false;
  userid: any;
  ipAddress: any;
  editrights: any = [];
  company: any;
  editData: any;
  checkedd: boolean = true;
  adminRoot = environment.adminRoot;
  editRoleName: boolean = false;
  formValue: any;
  selectedRoleType: any;
  allbranch: any;
  selected: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.getformdata();
    this.allCompany();

    this.getIPAddress();
  }
  editdata() {
    let id = this.formValue.ListRolesComponent.id;
    this.spinner.start('start');
    this.api.callApi(this.constant.GETROLEMASTERBYID + id, {}, 'GET', true, true, true).subscribe(
      (res: any) => {
        this.editData = res.roleMaster;

        this.editrights = res.data;
        this.userrights = this.editrights;
        this.selectedRoleType = this.editData.roleType;

        let temp = this.editData.companyAccessType;
        this.changeRoleType(this.selectedRoleType);
        this.editData.companyAccessType = temp;
        this.selected = res.allBranch;


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
              for (var a = 0; a < this.formdata[i].parentFormMasterID[j].operation.length; a++) {
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
                    this.formdata[i].parentFormMasterID[j].operation[a].operationselected =
                      this.editrights[k].operationID;
                    this.formdata[i].parentFormMasterID[j].operation[a].status = true;
                  }
                }
              }
            }
          }
        }
        if (this.editData.roleName == 'Admin' || this.editData.roleName == 'Employee') {
          this.editRoleName = true;
        }

        this.showMyContainer = true;
        this.spinner.stop('start');
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('start');
      },
    );
  }
  getformdata() {
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
            this.editdata();
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
          }
          this.spinner.stop('loader-1');
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('loader-1');
        },
      );
  }
  parentform(formdatas, value) {
    if (value == true) {
      let remainingdata = this.userrights.filter(function (e) {
        return e.formMasterID === formdatas.formMasterID;
      });
      if (remainingdata.length == 0) {
        var data = {
          formMasterID: formdatas.formMasterID,
          operationID: Number(formdatas.operation[0]),
        };
        this.userrights.push(data);
      } else {
        data = {
          formMasterID: formdatas.formMasterID,
          operationID: Number(formdatas.operation[0]),
        };
      }
    } else {
      while (this.userrights.findIndex((e) => e.formMasterID === formdatas.formMasterID) >= 0)
        this.userrights.splice(
          this.userrights.findIndex((f) => f.formMasterID === formdatas.formMasterID),
          1,
        );
    }
  }
  childform(parentFormMasterID, value) {
    if (value == true) {
      var data = {
        formMasterID: parentFormMasterID.formMasterID,
        operatonID: parentFormMasterID.operation[0].operationID,
      };
      this.userrights.push(data);
    } else {
      while (
        this.userrights.findIndex((e) => e.formMasterID === parentFormMasterID.formMasterID) >= 0
      )
        this.userrights.splice(
          this.userrights.findIndex(
            (f) => (f.formMasterID === f.formMasterID) === parentFormMasterID.formMasterID,
          ),
          1,
        );
    }
  }
  operations(formdatas, parentFormMasterID, operation, value) {
    if (value == true) {
      for (var i = 0; i < this.formdata.length; i++) {
        for (var j = 0; j < this.formdata[i].parentFormMasterID.length; j++) {
          if (
            this.formdata[i].parentFormMasterID[j].formMasterID == parentFormMasterID.formMasterID
          ) {
            this.formdata[i].parentFormMasterID[j].parentid = parentFormMasterID.formMasterID;
            this.formdata[i].parentFormMasterID[j].disable = true;
          } else if (this.formdata[i].formMasterID == formdatas.formMasterID) {
            this.formdata[i].parentid = formdatas.formMasterID;
            this.formdata[i].disable = true;
          }
        }
      }

      var data = {
        formMasterID: parentFormMasterID.formMasterID,
        operationID: operation.operationID,
        parent: formdatas.formMasterID,
      };
      this.parentform(formdatas, true);
      this.userrights.push(data);
    } else {
      var remainingdata = [];

      while (
        this.userrights.findIndex(
          (e) =>
            e.formMasterID === parentFormMasterID.formMasterID &&
            e.operationID === operation.operationID,
        ) >= 0
      )
        this.userrights.splice(
          this.userrights.findIndex(
            (f) =>
              f.formMasterID === parentFormMasterID.formMasterID &&
              f.operationID === operation.operationID,
          ),
          1,
        );
      remainingdata = this.userrights.filter(function (e) {
        return e.formMasterID === parentFormMasterID.formMasterID;
      });

      if (remainingdata.length == 0) {
        for (var i = 0; i < this.formdata.length; i++) {
          for (var j = 0; j < this.formdata[i].parentFormMasterID.length; j++) {
            if (
              this.formdata[i].parentFormMasterID[j].formMasterID == parentFormMasterID.formMasterID
            ) {
              this.formdata[i].parentFormMasterID[j].parentid = '';
              this.formdata[i].parentFormMasterID[j].disable = false;
            } else if (this.formdata[i].formMasterID == formdatas.formMasterID) {
              var remainingdata2 = this.userrights.filter(function (e) {
                return e.parent === formdatas.formMasterID;
              });
              if (remainingdata2.length == 0) {
                this.formdata[i].parentid = '';
                this.formdata[i].disable = false;
                while (
                  this.userrights.findIndex(
                    (e) => e.formMasterID === this.formdata[i].formMasterID,
                  ) >= 0
                )
                  this.userrights.splice(
                    this.userrights.findIndex(
                      (f) => f.formMasterID === this.formdata[i].formMasterID,
                    ),
                    1,
                  );
              }
            }
          }
        }
      }
    }
  }
  allCompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.spinner.stop('company');
        }
      });
  }

  onSubmit() {
    if (!this.addform.valid) {
      return;
    }
    this.spinner.start('submit');

    const finalPermission = []

    for (var i = 0; i < this.userrights.length; i++) {
      finalPermission.push({
        formMasterID: this.userrights[i].formMasterID,
        operationID: this.userrights[i].operationID,
        parent: this.userrights[i].parent,
        roleMasterID: this.userrights[i].roleMasterID ? this.userrights[i].roleMasterID : this.formValue.ListRolesComponent.id,
        status: 1,
      });

    }



    let body = {
      roleMasterID: this.formValue.ListRolesComponent.id,
      formarray: finalPermission,
      companyMasterID: this.addform.value.companyMasterID,
      roleName: this.addform.value.rolename,
      roleType: this.addform.value.roleType,
      companyAccessType: this.addform.value.companyAccessType ? this.addform.value.companyAccessType : null,
      branchMasterIDs: this.selected,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };

    this.api.callApi(this.constant.UPDATEROLEMASTER, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.showMyContainer = false;
          this.addform.resetForm();
          this.formdata = [];
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            // window.location.reload()
            this.router.navigate([this.adminRoot + '/orgs/roles']);

            this.spinner.stop('submit');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('submit');
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('submit');
      },
    );
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
  changeRoleType(event: any) {
    this.allbranch = [];
    this.selected = [];
    this.editData.companyAccessType = null;
    if (event && event == 'branchWise') {
      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + this.editData.companyMasterID, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
          this.selectAllForDropdownItems(this.allbranch);
          this.spinner.stop('branch');
        });
    }

  }
  selectCompany() {
    this.selectedRoleType = null;
    this.allbranch = [];
    this.selected = [];
  }
}
