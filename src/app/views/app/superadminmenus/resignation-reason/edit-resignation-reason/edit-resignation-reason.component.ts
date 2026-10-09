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
    selector: 'app-edit-resignation-reason',
    templateUrl: './edit-resignation-reason.component.html',
    styleUrls: ['./edit-resignation-reason.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditResignationReasonComponent implements OnInit {
  @ViewChild('editResignReason') editResignReason: NgForm;
  ipAddress: any;
  usertype: any;
  company_id: any;
  reasonData: any;
  isdisebled: boolean = false;
  adminRoot = environment.adminRoot;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    public activatedRoute: ActivatedRoute,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.editdata();
  }

  editdata() {
    const resigantionReasonID = this.formValue.ListResignationReasonComponent.id;
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETRESIGNATIONREASONBYID + resigantionReasonID,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.reasonData = res.data;
          this.spinner.stop();
        },
        (err) => {
          console.log('error', err);
          this.spinner.stop();
        },
      );
  }

  onSubmit() {
    if (!this.editResignReason.valid) {
      return;
    }

    const resigantionReasonID = this.formValue.ListResignationReasonComponent.id;

    const body = {
      reason: this.editResignReason.value.reason,
    };

    this.spinner.start();
    this.api
      .callApi(
        this.constant.EDITRESIGNATIONREASON + resigantionReasonID,
        body,
        'PUT',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/superadminmenus/list-resignation-reason']);
              this.spinner.stop();
            }, 3000);
          } else {
            this.handleError(res.message);
            this.spinner.stop();
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop();
        },
      );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
