import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { ViewAttedancePolicyComponent } from '../list-employee-attendance-policy/view-attedance-policy/view-attedance-policy.component';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ViewEmployeeAttendancePolicyComponent }from './view-employee-attendance-policy/view-employee-attendance-policy.component';


@Component({
    selector: 'app-employee-attendance-policy',
    templateUrl: './employee-attendance-policy.component.html',
    styleUrls: ['./employee-attendance-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeAttendancePolicyComponent implements OnInit {
  @ViewChild('addattendancepolicy') addattendancepolicy: NgForm;
  @ViewChild('editattendancepolicy') editattendancepolicy: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;

  @ViewChild(ViewEmployeeAttendancePolicyComponent)
  viewEmployeeAttedancePolicyComponent: ViewEmployeeAttendancePolicyComponent;

  mediumDateFormat = environment.mediumDateFormat;
  rows: any = [];
  apiURL = environment.apiUrl;

  @ViewChild('myInput')
  myInputVariable: ElementRef;

  allattendancepolicy: any = [];
 
  getAttendancePolicyID: any;
  selectedAttedancePolicyName: any;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private profileStatusService: ProfileStatusService,
    private formValueStorageService: FormValueStorageService,
  ) {

  }
  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.alldata();

    this.profileStatusService.refreshProfileStatus();
  }
  


  alldata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETEMPLOYEEATTENDANCE + +localStorage.getItem('id'),
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
         
          this.spinner.stop();
        }
      });
  }
  

  getAttedancePolicyDataModal(item: any) {
    this.getAttendancePolicyID = item.attendancePolicyID;
    this.viewEmployeeAttedancePolicyComponent.attendancePolicyID = item.attendancePolicyID;
    this.viewEmployeeAttedancePolicyComponent.ngOnInit();
    this.selectedAttedancePolicyName = item.attendancePolicy.attendancePolicyName;
  }
}
