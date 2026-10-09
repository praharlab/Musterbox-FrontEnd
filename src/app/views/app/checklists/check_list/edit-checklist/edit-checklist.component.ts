import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'app-edit-checklist',
    templateUrl: './edit-checklist.component.html',
    styleUrls: ['./edit-checklist.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditChecklistComponent implements OnInit {
  @ViewChild('addchecklist') addchecklist: NgForm;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  product: any = [];
  companydata: any;
  usertype: any;
  company_id: any;
  values: string;
  selecteddesignation: any;
  designation: any;
  checklistdata: any;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.getproduct();
    this.editdata();
  }
  editdata() {
    let companyid = this.activatedRoute.snapshot.params.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWCHECKLISTDATA + companyid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.checklistdata = res.data;
          let temp = this.checklistdata.designationId;
          this.getDesignation(this.checklistdata['designation.companyMaster.companyMasterID']);
          this.checklistdata.designationId = temp;
          this.companydata = res.data;
          this.spinner.stop();
        },
        (err) => {
          console.log('error', err);
          this.spinner.stop();
        },
      );
  }
  getDesignation(id: any) {
    this.checklistdata.designationId = '';
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
      checkListID: this.activatedRoute.snapshot.params.id,
      checkListName: this.addchecklist.value.checkListName,
      designationId: this.addchecklist.value.designationId,
      companyMasterID: this.addchecklist.value.companyMasterID,
      pastdays: this.addchecklist.value.backDatedDays,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATECHECKLIST, body, 'POST', true, true, true).subscribe(
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
