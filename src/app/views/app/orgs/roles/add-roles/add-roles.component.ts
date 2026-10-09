import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-roles',
    templateUrl: './add-roles.component.html',
    styleUrls: ['./add-roles.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddRolesComponent implements OnInit {
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
  companyID: any;
  adminRoot = environment.adminRoot;
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
  ) { }

  ngOnInit(): void {
    this.allCompany();
    this.getIPAddress();
    this.getformdata();
  }
  getformdata() {
    this.spinner.start('loader02');
    this.api
      .callApi(
        this.constant.VIEWFORMDATA + '?companyMasterID=' + localStorage.getItem('company_id'),
        {},
        'GET',
        false,
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
            this.spinner.stop('loader02');
            this.showMyContainer = true;
            this.companyID = Number(localStorage.getItem('company_id'));
          }
        },
        (err) => {
          console.log('error', err);
          this.spinner.stop('loader02');
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
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;
        }
      });
  }
  onSubmit() {
    if (!this.addform.valid) {
      return;
    }

    this.spinner.start('loader-02');
    for (var i = 0; i < this.userrights.length; i++) {
      this.userrights[i].createBy = localStorage.getItem('id');
      this.userrights[i].createByIp = this.ipAddress;
    }



    let body = {
      formarray: this.userrights,
      companyMasterID: this.addform.value.companyMasterID,
      roleType: this.addform.value.roleType,
      companyAccessType: this.addform.value.companyAccessType ? this.addform.value.companyAccessType : null,
      branchMasterID: this.selected,
      roleName: this.addform.value.rolename,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };

    this.api.callApi(this.constant.ADDROLEMASTER, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            // window.location.reload()
            this.showMyContainer = false;
            this.addform.resetForm();
            this.formdata = [];
            this.router.navigate([this.adminRoot + '/orgs/roles']);

            this.spinner.stop('loader-02');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('loader-02');
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('loader-02');
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
    if (event && event == 'branchWise') {
      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + this.addform.value.companyMasterID, {}, 'GET', true, false, true)
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
