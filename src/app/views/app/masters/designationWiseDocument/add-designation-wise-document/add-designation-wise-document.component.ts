import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'app-add-designation-wise-document',
    templateUrl: './add-designation-wise-document.component.html',
    styleUrls: ['./add-designation-wise-document.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddDesignationWiseDocumentComponent implements OnInit {
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
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.company_id = +localStorage.getItem('company_id');
    this.getcompany();
    this.selectdesignation(this.company_id)
    this.getdocumentType()
    this.getIPAddress();
  }
  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
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
  getdocumentType() {
    let queryString = `?companyMasterID=${localStorage.getItem('company_id')}`;

    this.spinner.start('company');
    this.api.callApi(this.constant.GETJOININGDOCUMENTTYPEBYCOMPANYUMASTERID + queryString, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.documentType = res.data;
          if (this.documentType.length > 0) {

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
      designationId: this.addcomp.value.designationId,
      designationWiseDocumentArray: this.documentType,
      companyMasterID: this.company_id
    };
    this.spinner.start();
    this.api.callApi(this.constant.ADDDESIGNATIONWISEDOCUMENT, body, 'POST', true, true, true).subscribe(
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
      this.documentType[i].isRequired = data.isRequired
    }
    if (type == 'add') {
      this.documentType[i].add = data.add
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

  selectcompany(id: any) {
    this.alldesignation = [];
    this.documentType = [];
    this.selecteddesig = null;
    this.showMyContainer = false
    if (!id) return;
    this.spinner.startLoader('master3');
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;

          // this.page.totalCount = res.totalcount;
          this.spinner.stopLoader('master3');
        }
      });

    let queryString = `?companyMasterID=${id}`;

    this.spinner.start('company');
    this.api.callApi(this.constant.GETJOININGDOCUMENTTYPEBYCOMPANYUMASTERID + queryString, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.documentType = res.data;
          if (this.documentType.length > 0) {
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
  selectdesignation(id: any) {
    this.alldesignation = [];
    if (!id) return;
    this.spinner.startLoader('master3');
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;

          // this.page.totalCount = res.totalcount;
          this.spinner.stopLoader('master3');
        }
      });
  }
}
