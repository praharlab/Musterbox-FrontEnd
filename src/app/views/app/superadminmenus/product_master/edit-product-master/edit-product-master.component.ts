import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-product-master',
    templateUrl: './edit-product-master.component.html',
    styleUrls: ['./edit-product-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditProductMasterComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  companydata: any;
  adminRoot = environment.adminRoot;

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
  editrights: any = [];
  company: any;
  editData: any;
  checkedd: boolean = true;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.getIPAddress();
    // this.editdata();
    this.getformdata();
  }
  editdata() {
    let companyid = this.formValue.ListProductMasterComponent.id;
    this.spinner.start('editData');
    this.api
      .callApi(this.constant.VIEWPRODUCTDATA + companyid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.companydata = res.data;

          this.editrights = res.productPermission;
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

          this.showMyContainer = true;
          this.spinner.stop('editData');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('editData');
        },
      );
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    this.spinner.start('submit');
    for (var i = 0; i < this.userrights.length; i++) {
      this.userrights[i].createBy = localStorage.getItem('id');
      this.userrights[i].createByIp = this.ipAddress;
    }

    let body = {
      // companyTypename:this.addcomp.value.companyTypename,
      // status:"1",
      // createBy:localStorage.getItem('id'),
      // createByIp:this.ipAddress
      formarray: this.userrights,
      productMasterID: this.formValue.ListProductMasterComponent.id,
      productName: this.addcomp.value.productName,
      productCode: this.addcomp.value.productCode,
      description: this.addcomp.value.description,
      totalUser: this.addcomp.value.totalUser,
      totalTracking: this.addcomp.value.totalTracking,
      updateBy: localStorage.getItem('id'),
    };

    this.api.callApi(this.constant.UPDATEPRODUCTDATA, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/product_master']);
            this.spinner.stop('submit');
          }, 3000);
        } else {
          this.handleError(res.message);
          this.spinner.stop('submit');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('submit');
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  getformdata() {
    this.spinner.start('loader-1');
    this.api.callApi(this.constant.VIEWFORMDATA, {}, 'GET', true, true, true).subscribe(
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
        this.handleError(err.error.message);
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

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
