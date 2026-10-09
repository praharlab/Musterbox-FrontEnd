import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-my-gatepass',
    templateUrl: './edit-my-gatepass.component.html',
    styleUrls: ['./edit-my-gatepass.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditMyGatepassComponent implements OnInit {
  @ViewChild('editEmpGatepass') editEmpGatepass: NgForm;
  editData: any;
  company: any = [];
  company_id: any;
  gatepass: any;
  buttonDisabled = false;
  buttonState = '';
  adminRoot = environment.adminRoot;
  employee: any;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,
  ) {}
  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.company_id = localStorage.getItem('company_id');
    // this.getIPAddress();
    // this.getcompany();
    this.editdata();
  }
  editdata() {
    let id = this.formValue.ListMyGatepassComponent.id;

    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETONEEMPLOYEEGATEPASS + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.data) {
            this.editData = res.data;
            this.editData.createdAt = new Date(this.editData.createdAt).toISOString().slice(0, 10);

            this.selectcompany(this.editData.companyMasterId);
          }
          this.spinner.stop('start');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  selectcompany(id) {
    this.employee = [];

    if (id) {
      this.company_id = id;

      let bb = {
        page: '',
        limit: '',
        companyMasterID: id,
      };
      this.spinner.start('compcont');
      this.api
        .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.employee = res.data;

              this.spinner.stop('compcont');
            } else {
              this.handleError('Something Went Wrong!');
              this.spinner.stop('compcont');
            }
          },
          (err) => {
            this.handleError(err.error.message);
            this.spinner.stop('compcont');
          },
        );
    }
  }

  getEmployeeGatepass(id) {
    if (!id) {
      return;
    }
    this.spinner.start('gatepass');
    this.api
      .callApi(
        this.constant.GETALLEMPLOYEEGATEPASS + '?companyMasterID=' + id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          this.gatepass = res.data;
          this.spinner.stop('gatepass');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('gatepass');
        },
      );
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  checkFromAndToTime(time1: string, time2: string): boolean {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    const fromTime = Number(hours1 * 60) + Number(minutes1);
    const toTime = Number(hours2 * 60) + Number(minutes2);

    if (fromTime > toTime) {
      this.handleError('ToTime is less than FromTime. ToTime need to greater than FromTime.');
      return true;
    } else if (fromTime === toTime) {
      this.handleError('ToTime is equal to FromTime. ToTime need to greater than FromTime.');
      return true;
    }
  }

  onSubmit() {
    if (!this.editEmpGatepass.valid) {
      return;
    }

    if (
      this.checkFromAndToTime(
        this.editEmpGatepass.value.fromTime,
        this.editEmpGatepass.value.toTime,
      )
    )
      return;

    const body = {
      description: this.editEmpGatepass.value.description,
      userMasterID: localStorage.getItem('id'),
      fromTime: this.editEmpGatepass.value.fromTime,
      toTime: this.editEmpGatepass.value.toTime,
      date: this.editEmpGatepass.value.date,
      status: 'Pending',
      purposeFor: this.editEmpGatepass.value.purposeFor,
    };
    this.spinner.start('start');
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api
      .callApi(
        this.constant.UPDATEMYGATEPASS + this.formValue.ListMyGatepassComponent.id,
        body,
        'PUT',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/employeegatepasses/list_mygatepass']);

            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop('start');
          }, 3000);
        },
        (err) => {
          this.handleError(err.error.message);
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('start');
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
}
