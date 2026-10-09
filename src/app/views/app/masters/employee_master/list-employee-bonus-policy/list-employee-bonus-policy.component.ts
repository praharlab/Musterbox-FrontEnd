import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ViewEmployeeBonusPolicyComponent } from './view-employee-bonus-policy/view-employee-bonus-policy.component';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
    selector: 'app-list-employee-bonus-policy',
    templateUrl: './list-employee-bonus-policy.component.html',
    styleUrls: ['./list-employee-bonus-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmployeeBonusPolicyComponent implements OnInit {

  @ViewChild('addattendancepolicy') addattendancepolicy: NgForm;

  @ViewChild('closeModal') closeModal: ElementRef;

  @ViewChild(ViewEmployeeBonusPolicyComponent)
  viewEmployeeBonusPolicyComponent: ViewEmployeeBonusPolicyComponent;

  mediumDateFormat = environment.mediumDateFormat;
  rows: any = [];
  apiURL = environment.apiUrl;

  @ViewChild('myInput')
  myInputVariable: ElementRef;

  allattendancepolicy: any = [];

  getAttendancePolicyID: any;
  selectedBonusPolicyName: any;
  formValue: any;
  getBonusPolicyId: any;
  userData: any;
  allBonuspolicy: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private profileStatusService: ProfileStatusService,
    private formValueStorageService: FormValueStorageService,
    private notifications: AppNotificationService,
  ) {

  }
  ngOnInit(): void {
    
    this.formValue = this.formValueStorageService.getData();
    this.alldata();
    this.getBonusPolicyData()
    this.profileStatusService.refreshProfileStatus();
  }

  getBonusPolicyData() {
    this.allBonuspolicy = [];
    let userid = this.formValue.ListEmployeeMasterComponent.id;
    this.spinner.start('get');
    this.api
      .callApi(this.constant.VIEWCOMPANYCONTACTDATA + userid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.userData = res.data;
          this.api
            .callApi(this.constant.GETBONUSPOLICYDATABYCOMPANYID + this.userData.companyMasterId, {}, 'GET', true, false, true)
            .subscribe((res: any) => {
              if (res.status == 200) {
                this.allBonuspolicy = res.data;
              }
              this.spinner.stop('get');
            });
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('get');
        },
      );
  }

  alldata() {
    this.spinner.start('get');
    this.api
      .callApi(
        this.constant.GETEMPLOYEEBONUSPOLICY + this.formValue.ListEmployeeMasterComponent.id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
          }
          this.spinner.stop('get');
        },
        (err) => {
          this.spinner.stop('get');
        },
      );
  }

  onSubmit() {
    if (!this.addattendancepolicy.valid) {
      return;
    }


    const body = {
      userMasterID: [this.formValue.ListEmployeeMasterComponent.id],
      bonusPolicyId: this.addattendancepolicy.value.bonusPolicy,
      applicableYYYYMM: this.addattendancepolicy.value.applicableYYYYMM.replace('-', ''),
    };
    this.spinner.start('add');
    this.api.callApi(this.constant.ADDEMPLOYEEBONUSPOLICY, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModal.nativeElement.click();
          this.ngOnInit();
          this.addattendancepolicy.reset();
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.spinner.stop('add');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000000,
            autoclose: false,
            showProgressBar: false,
          });
          setTimeout(() => {
            this.spinner.stop('add');
          }, 3000);
          //alert(res.message);
        }
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('add');
      },
    );
  }


  alertConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          id,
          userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        };
        this.spinner.start('delete');
        this.api
          .callApi(this.constant.DELETEEMPLOYEEBONUSPOLICY, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.ngOnInit();
              this.spinner.stop('delete');
            },
            (err) => {
              this.notifications.create('Error', err.error.message, NotificationType.Error, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop('delete');
            },
          );
      }
    });
  }

  getAttedancePolicyDataModal(item: any) {
    this.getBonusPolicyId = item.bonusPolicyId;
    this.viewEmployeeBonusPolicyComponent.bonusPolicyId = item.bonusPolicyId;
    this.viewEmployeeBonusPolicyComponent.ngOnInit();
    this.selectedBonusPolicyName = item.bonusPolicy.bonusPolicyName;
  }

}
