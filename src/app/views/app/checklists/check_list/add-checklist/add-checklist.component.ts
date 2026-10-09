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
    selector: 'app-add-checklist',
    templateUrl: './add-checklist.component.html',
    styleUrls: ['./add-checklist.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddChecklistComponent implements OnInit {
  @ViewChild('addchecklist') addchecklist: NgForm;

  file: any;
  format: any;
  url: any;
  ipAddress: any;
  product: any = [];
  usertype: any;
  company_id: any;
  alldesignation: any = [];
  designation: any;
  selectedcompany: any;
  selecteddesignation: any;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.getproduct();
    // this.getDesignation();
  }

  getproduct() {
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
            this.product = res.data;
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
            this.product = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  getDesignation(id: any) {

    if (id) {
      this.spinner.start();

      this.api
        .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.designation = res.data;
            this.spinner.stop();
          }
        });
    }
    this.designation = [];
    this.selecteddesignation = '';
  }

  onSubmit() {
    if (!this.addchecklist.valid) {
      return;
    }

    if (this.addchecklist.value.backDatedDays < 0) {
      this.notifications.create(
        'Error',
        'Past days cannot be less than zero',
        NotificationType.Bare,
        { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
      );
      return;
    }

    let body = {
      checkListName: this.addchecklist.value.checkListName,
      designationId: this.addchecklist.value.designationId,
      companyMasterID: this.addchecklist.value.companyMasterID,
      pastdays: this.addchecklist.value.backDatedDays,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.CREATECHECKLISTDATA, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/checklists/checklist']);
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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
