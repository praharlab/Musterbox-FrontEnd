import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ViewEmployeeAttendanceBonusPolicyComponent } from '../view-employee-attendance-bonus-policy/view-employee-attendance-bonus-policy.component'

@Component({
    selector: 'app-employee-attendance-bonus-policy',
    templateUrl: './employee-attendance-bonus-policy.component.html',
    styleUrls: ['./employee-attendance-bonus-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeAttendanceBonusPolicyComponent implements OnInit {

  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('editcomp') editcomp: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  @ViewChild(ViewEmployeeAttendanceBonusPolicyComponent)
  viewEmployeeAttendanceBonusPolicyComponent: ViewEmployeeAttendanceBonusPolicyComponent;

  mediumDateFormat = environment.mediumDateFormat;
  rows: any = [];
  @ViewChild('myInput') myInputVariable: ElementRef;
  selectAllState = '';
  company_id: any;
  attendanceBonusPolicyName: string;
  formValue: any;
  attendanceBonusPolicyID: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private profileStatusService: ProfileStatusService,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.alldata();
    this.company_id = localStorage.getItem('company_id');
    this.profileStatusService.refreshProfileStatus();
  }



  alldata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.EMPLOYEEATTENDANCEDATA + +localStorage.getItem('id'),
        // this.filterData,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          // this.temp = [...this.rows];
          // this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }


 


  getAttendanceBonusDataModal(item: any) {

    this.attendanceBonusPolicyID = item.attendanceBonusPolicyId;
    this.viewEmployeeAttendanceBonusPolicyComponent.attendanceBonusPolicyId = item.attendanceBonusPolicyId;
    this.viewEmployeeAttendanceBonusPolicyComponent.ngOnInit();
    this.attendanceBonusPolicyName = item.attendanceBonusPolicy.attendanceBonusPolicyName;

  }


}
