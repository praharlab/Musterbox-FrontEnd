import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-my-gatepass',
    templateUrl: './add-my-gatepass.component.html',
    styleUrls: ['./add-my-gatepass.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddMyGatepassComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  ipAddress: any;
  company: any = [];
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  employee: any;
  adminRoot = environment.adminRoot;
  selectedUser: any[];
  todayDate: string;
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.todayDate = new Date().toISOString().slice(0,10)
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
  }
  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company1');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.spinner.stop('company1');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('company1');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company1');
      },
    );
  }

  selectcompany(id) {
    this.selectedUser = [];
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
        .subscribe((res: any) => {
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
    if (!this.addcomp.valid) {
      return;
    }

    if (this.checkFromAndToTime(this.addcomp.value.fromTime, this.addcomp.value.toTime)) return;


    const body = {
      description: this.addcomp.value.description,
      userMasterID: localStorage.getItem('id'),
      fromTime: this.addcomp.value.fromTime,
      toTime: this.addcomp.value.toTime,
      date: this.addcomp.value.date,
      status: 'Pending',
      purposeFor: this.addcomp.value.purposeFor,
      companyMasterID: +localStorage.getItem('company_id'),
    };

    this.spinner.start('start');
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    this.api
      .callApi(this.constant.CREATEMYGATEPASS, body, 'POST', true, true, true)
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
