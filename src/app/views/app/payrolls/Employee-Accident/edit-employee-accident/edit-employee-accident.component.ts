import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-employee-accident',
    templateUrl: './edit-employee-accident.component.html',
    styleUrls: ['./edit-employee-accident.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditEmployeeAccidentComponent implements OnInit {
  @ViewChild('editAccident') editAccident: NgForm;
  AccidentData: any = [];
  ipAddress: any;
  maxdays: Number;
  days: any[];
  adminRoot = environment.adminRoot;
  formValue: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.getIPAddress();
    this.editdata();
  }

  editdata() {
    this.spinner.start('edit');
    this.api
      .callApi(
        this.constant.GETEMPACCIDENTDATABYID + this.formValue.ListEmployeeAccidentComponent.id,
        {},
        'GET',
        true,
        true,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.AccidentData = res.data[0];
          this.spinner.stop('edit');
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          }),
            setTimeout(() => {
              this.router
                .navigate([this.adminRoot + '/payrolls/list_employee_accident'])
                .then(() => {
                  this.spinner.stop('edit');
                });
            }, 3000);
        }
      });
  }

  calcdays() {
    if (this.editAccident.value.AccidentDate != '' && this.editAccident.value.ReturnDate != '') {
      this.days = [];
      let startDate = this.editAccident.value.AccidentDate;
      let date1 = new Date(this.editAccident.value.ReturnDate);
      let date2 = new Date(startDate);
      let timeInMilisec = date1.getTime() - date2.getTime();
      let daysBetweenDates = Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24));
      this.days.push(Number(daysBetweenDates));
      this.maxdays = this.days[0];
    }
  }
  onSubmit() {
    let body = {
      AccidentID: this.formValue.ListEmployeeAccidentComponent.id,
      NoticeDate: this.editAccident.value.NoticeDate,
      AccidentDate: this.editAccident.value.AccidentDate,
      AccidentTime: this.editAccident.value.AccidentTime,
      AccidentLocation: this.editAccident.value.AccidentLocation,
      AccidentCause: this.editAccident.value.AccidentCause,
      InjuryNature: this.editAccident.value.InjuryNature,
      WitnessOneName: this.editAccident.value.WitnessOneName,
      WitnessOneAddress: this.editAccident.value.WitnessOneAddress,
      WitnessOneOccupation: this.editAccident.value.WitnessOneOccupation,
      WitnessSecondName: this.editAccident.value.WitnessSecondName,
      WitnessSecondAddress: this.editAccident.value.WitnessSecondAddress,
      WitnessSecondOccupation: this.editAccident.value.WitnessSecondOccupation,
      ReturnDate: this.editAccident.value.ReturnDate,
      TotalDays: this.maxdays,

      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };

    this.spinner.start('submit');
    this.api
      .callApi(this.constant.UPDATEEMPACCIDENTDATA, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/payrolls/list_employee_accident']).then(() => {
              this.spinner.stop('submit');
            });
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/payrolls/list_employee_accident']).then(() => {
              this.spinner.stop('submit');
            });
          }, 3000);
        }
      });
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  clear() {
    window.location.reload();
  }
}
