import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgxSignaturePadComponent, SignaturePadOptions } from 'src/app/components/signature-pad/ngx-signature-pad.module';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-visit-report-customize',
    templateUrl: './visit-report-customize.component.html',
    styleUrls: ['./visit-report-customize.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class VisitReportCustomizeComponent implements OnInit {
  @ViewChild('addvisitreportcustom') addvisitreportcustom: NgForm;
  @ViewChild('editreportcustom') editreportcustom: NgForm;
  values: any = [];
  valueshow: boolean;
  ipAddress: any;
  isdisabled = false;
  field: any = [];
  allcustomer: any;
  empList: any;
  selected: any = [];
  getallvisitpurpose: any;
  product: any;
  company: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  report: any = [];
  selectedcompany: any;
  selectedreport: any;
  customizedata: any;
  required: any;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }
  @ViewChild('sign')
  signaturePadElement: NgxSignaturePadComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;

  ngOnInit(): void {
    this.getIPAddress();
    // this.getcustomizefield();
    this.valueshow = false;
    this.getcompany();
    this.checkpermission();
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
              permissionval.formName == 'VisitReportCustomizeField' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'VisitReportCustomizeField' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'VisitReportCustomizeField' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'VisitReportCustomizeField' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getreport(company) {
    this.spinner.start();
    this.api
      .callApi(this.constant.VISITREPORTMASTERBYCOMPANY + company, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.report = res.data;
          this.spinner.stop();
        }
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
          this.company = res.data;

          this.spinner.stop();
        }
      });
  }
  addvalue() {
    this.values.push({ value: '' });
  }
  removevalue(i) {
    this.values.splice(i, 1);
  }
  selectinput(event) {
    if (this.values.length) {
      this.removevalue(this.values.length - 1);
    }
    if (event == 'radio') {
      this.valueshow = true;
      this.addvalue();
    } else if (event == 'dropdown') {
      this.valueshow = true;
      this.addvalue();
    } else if (event == 'checkbox') {
      this.valueshow = true;
      this.addvalue();
    } else {
      this.valueshow = false;
    }
  }

  resetForm() {
    // Manually reset the form
    this.addvisitreportcustom.reset();
  }

  onSubmit() {
    if (!this.addvisitreportcustom.valid) {
      return;
    }
    const value = [];
    for (var i = 0; i < this.values.length; i++) {
      value.push(this.values[i].value);
    }
    let body = {
      visitReportMasterID: this.selectedreport,
      fieldLabel: this.addvisitreportcustom.value.fieldLabel,
      inputType: this.addvisitreportcustom.value.inputType,
      value: value,
      isRequired: this.addvisitreportcustom.value.isRequired,
      companyMasterID: this.selectedcompany,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.CREATEVISITREPORTCUSTOMIZE, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.isdisabled = true;
            this.values = [];
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });

            setTimeout(() => {
              this.router
                .navigate([this.adminRoot + '/masters/visit_report_customize'])
                .then(() => {
                  this.closeModal.nativeElement.click();
                  this.getcustomizefield();
                  this.isdisabled = false;
                  this.spinner.stop();
                });
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
            this.isdisabled = false;
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
          this.isdisabled = false;
        },
      );
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  getcustomizefield() {
    const body = {
      page: '',
      limit: '',
      companyMasterID: this.selectedcompany,
      report_id: this.selectedreport,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETVISITREPORTCUSTOMIZEBYCOMPANYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.field = res.data;
          this.spinner.stop();
        }
      });
  }
  removefields(id: any) {
    const body = {
      visitReportCustomizeID: id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.DELETEVISITREPORTCUSTOMIZEBYID, body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.ngOnInit();
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }
  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }
  selectcompany(event: any) {
    this.selectedreport = null;
    this.selectedcompany = event;
    this.getreport(event);
  }
  selectreport(event: any) {
    this.selectedreport = event;
    this.getcustomizefield();
  }
  public clear() {
    this.signaturePadElement.clear();
  }

  public getImage() {
  }
  editfields(data, data1) {

    this.api
      .callApi(this.constant.VIEWVISITREPORTFORMCUSTOMIZEDATA + data1, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.customizedata = res.data;
          this.required = this.customizedata.isRequired.toString();
          this.selectinput(this.customizedata.inputType);
          var respo: any = [];

          for (var i = 0; i < this.customizedata.value.length; i++) {
            respo.push({ value: this.customizedata.value[i] });
          }

          this.values = respo;
          this.spinner.stop();
        },
        (err) => {
          this.spinner.stop();
        },
      );
  }
  onSubmit1() {
    if (!this.editreportcustom.valid) {
      return;
    }
    const value = [];
    for (var i = 0; i < this.values.length; i++) {
      value.push(this.values[i].value);
    }
    let body = {
      visitReportCustomizeID: this.customizedata.visitReportCustomizeID,
      fieldLabel: this.editreportcustom.value.fieldLabel,
      inputType: this.editreportcustom.value.inputType,
      value: value,
      isRequired: this.editreportcustom.value.isRequired,
      companyMasterID: this.selectedcompany,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.UPDATEVISITREPORTCUSTOMIZE, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.isdisabled = true;
            this.values = [];
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router
                .navigate([this.adminRoot + '/masters/visit_report_customize'])
                .then(() => {
                  this.closeModal1.nativeElement.click();
                  this.getcustomizefield();
                  this.isdisabled = false;
                  this.spinner.stop();
                });
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }

  close(model, type) {
    model.hide();
    type === 'add' ? this.addvisitreportcustom.reset() : this.editreportcustom.reset();
    this.values = [];
    this.valueshow = false;
  }
}
