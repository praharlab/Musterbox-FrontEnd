import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { ViewEmployeeWeekoffPolicyComponent } from '../view-employee-weekoff-policy/view-employee-weekoff-policy.component'
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-employee-weekoff-policy',
    templateUrl: './employee-weekoff-policy.component.html',
    styleUrls: ['./employee-weekoff-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeWeekoffPolicyComponent implements OnInit {


  @ViewChild(ViewEmployeeWeekoffPolicyComponent)
  viewEmployeeWeekOffPolicyComponent: ViewEmployeeWeekoffPolicyComponent;

  mediumDateFormat = environment.mediumDateFormat;
  rows: any = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  filterData = {
    page: 1,
    limit: 10,
    company_id: localStorage.getItem('company_id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  company_id: any;
  getWeekOffPolicyID: any;
  selectedWeekOffPolicyName: string;
  formValue: any;
	
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private profileStatusService: ProfileStatusService,
    private formValueStorageService: FormValueStorageService,
  ) {
   
  }
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
        this.constant.WEEKOFFBYCOMPANYDATA + +localStorage.getItem('id'),
        this.filterData,
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }


  getWeekOffPolicyDataModal(item: any) {
    this.getWeekOffPolicyID = item.weekOffPolicyID;
    this.viewEmployeeWeekOffPolicyComponent.weekOffPolicyID = item.weekOffPolicyID;
    this.viewEmployeeWeekOffPolicyComponent.ngOnInit();
    this.selectedWeekOffPolicyName = item.weekoff.weekOffPolicyName;
  }
}
