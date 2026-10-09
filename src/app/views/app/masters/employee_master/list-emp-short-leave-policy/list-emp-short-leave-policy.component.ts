import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { PolicyData } from '../../employeeLeavePolicy/model/policyData';
import { labelUtils } from 'src/app/constants/labelUtils';

@Component({
    selector: 'app-list-emp-short-leave-policy',
    templateUrl: './list-emp-short-leave-policy.component.html',
    styleUrls: ['./list-emp-short-leave-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListEmpShortLeavePolicyComponent implements OnInit {
  @Output() EmployeeLeavePolicyVerify = new EventEmitter<object>();
  @ViewChild('addleavepolicy') addleavepolicy: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  rows: any = [];
  format: any;
  scrollBarHorizontal = window.innerWidth < 1201;
  ipAddress: any;
  userdata: any;
  allLeavePolicy: any;
  empleavedata: any;
  comp: any;
  formValue: any;
  showButton:any=true;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }
  ngOnInit(): void {
    this.api.getAddButtonValue$.subscribe((data) => {
      this.showButton = data;
    })
    if(this.router.url.includes('/me/')){
      this.showButton = false
    }
    this.formValue = this.formValueStorageService.getData();
    this.alldata();
    this.getIPAddress();
    if(this.showButton) this.getShortLeavePolicyData();
  }
  getShortLeavePolicyData() {
    let userid = this.formValue?.ListEmployeeMasterComponent?.id ? this.formValue?.ListEmployeeMasterComponent?.id : localStorage.getItem('id');
    this.spinner.start('get');
    this.api
      .callApi(this.constant.VIEWCOMPANYCONTACTDATA + userid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {

          this.userdata = res.data;
          let string = `?companyMasterID=${this.userdata.companyMasterId}`;
          this.api
            .callApi(this.constant.GETSHORTLEAVEDATA + string, {}, 'GET', true, false, true)
            .subscribe((res: any) => {
              if (res.status == 200) {
                this.allLeavePolicy = res.data;
                this.spinner.stop('get');
              }
              this.spinner.stop('get');
            });
        },
        (err) => {
          console.log('error', err);
          this.spinner.stop('get');
        },
      );
  }

  resetModel() {
    this.addleavepolicy.resetForm();
  }

  alldata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEMPSHORTLEAVEPOLICYDATABYUSERID + (this.showButton && this.formValue?.ListEmployeeMasterComponent?.id ? this.formValue?.ListEmployeeMasterComponent?.id : localStorage.getItem('id')) ,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          let display = true;

          for (let item of this.rows) {
            if (item.endDate === null && item.leavePolicyStatus === 'active') {
              display = false;
              break;
            }
          }

          this.EmployeeLeavePolicyVerify.emit({
            tabname: 'SHORTLEAVEPOLICY',
            display: display,
          });


          // this.temp = [...this.rows];
          // this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  onSubmit() {

    if (!this.addleavepolicy.valid) {
      return;
    }

    let body = {
      userMasterID: [+this.formValue.ListEmployeeMasterComponent.id],
      shortLeavePolicyID: +this.addleavepolicy.value.employeeShortLeavePolicyID,
      month: this.addleavepolicy.value.applicableDate,
    };
    this.spinner.start('add');
    this.api.callApi(this.constant.ADDEMPSHORTLEAVEPOLICYDATA, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.closeModal.nativeElement.click();
          this.ngOnInit();
          this.addleavepolicy.reset();
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
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('add');
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('add');
      },
    );
  }


  getShortLeavePolicy(item: any) {
    this.editdata(item);
    this.getcompany();
  }

  editdata(item: any) {
    let empShortLeavePolicyID = item;
    let string = `?id=${empShortLeavePolicyID}`;
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETSHORTLEAVEDATA + string,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.empleavedata = res.data;
        },
        (err) => {
          this.notifications.create(
            'Error',
            err.error.message || 'Someting Went Wrong!',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop();
        },
      );  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop();
        }
      });
  }
}
