import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';


@Component({
    selector: 'app-edit-designation-wise-document',
    templateUrl: './edit-designation-wise-document.component.html',
    styleUrls: ['./edit-designation-wise-document.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditDesignationWiseDocumentComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  adminRoot = environment.adminRoot;

  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  comp: any;
  company_id: any;
  selectedDocumentType: any;
  documentType: any = [];
  showMyContainer: boolean = false;
  alldesignation: any = []
  selecteddesig: any;
  formValue: any;
  editData: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.company_id = +localStorage.getItem('company_id');
    this.getDesignationWiseDocumentType()
    this.getIPAddress();
  }
  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    let body = {
      designationId: this.editData.designationId,
      designationWiseDocumentArray: this.editData.documentType,
    };
    this.spinner.start();
    this.api.callApi(this.constant.EDITDESIGNATIONWISEDOCUMENT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/designationWiseDocument']);

            this.spinner.stop();
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
  onChange(type, data, i) {
    if (type == 'isRequired') {
      this.editData.documentType[i].isRequired = data.isRequired
    }
    if (type == 'add') {
      this.editData.documentType[i].add = data.add
      if (data.add == false) {
        this.documentType[i].isRequired = false
      }
    }
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }


  getDesignationWiseDocumentType() {
    let queryString = `?designationId=${this.formValue.ListDesignationWiseDocumentComponent.id}`;

    this.spinner.start('company');
    this.api.callApi(this.constant.GETDESIGNATIONWISEDOCUMENTBYDESIGNATIONID + queryString, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.editData = res.data;

          if (this.editData.documentType.length > 0) {
            this.showMyContainer = true
          }
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
}
