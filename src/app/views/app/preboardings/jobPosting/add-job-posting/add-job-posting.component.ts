import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
    selector: 'app-add-job-posting',
    templateUrl: './add-job-posting.component.html',
    styleUrls: ['./add-job-posting.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddJobPostingComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  adminRoot = environment.adminRoot;

  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  comp: any;
  company_id: any;
  selectedDocumentType: any;
  documentType: any = [];
  showMyContainer: boolean = false;
  alldesignation: any = []
  selecteddesig: any;
  allbranch: any;
  alldepartment: any;
  jobClassificationData: any
  selectedjobClassification: any
  selectedDepartment: any;
  selectedBranch: any;
  minDate: string = new Date().toISOString().split('T')[0];
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.company_id = +localStorage.getItem('company_id');
    this.getcompany();
    this.getIPAddress();
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.selectcompany(this.company_id)
          this.spinner.stop('company');
        } else {
          this.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
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

  private handleSuccess(message: any) {
    this.notifications.create('Done', message, NotificationType.Bare, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: true,
    });
  }

  private handleWarning(message: any) {
    this.notifications.create('Warning', message, NotificationType.Warn, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
  
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    if (+this.addcomp.value.minSalary > +this.addcomp.value.maxSalary) {
      return this.handleWarning('Maximum salary can not less than minimum Salary')
    }
    if (+this.addcomp.value.noOfPosition < 0) {
      return this.handleWarning('No Of Position Can Not be Less Then 0')
    }
    if (+this.addcomp.value.noOfPosition == 0) {
      return this.handleWarning('No Of Position Can Not be 0')
    }
    let body = {
      companyMasterID: this.company_id,
      branchMasterID: +this.addcomp.value.branchMasterID,
      departmentId: +this.addcomp.value.departmentId,
      designationId: +this.addcomp.value.designationId,
      jobRoleClassificationID: +this.addcomp.value.jobRoleClassificationID,
      jobTitle: this.addcomp.value.jobTitle,
      employmentType: this.addcomp.value.employmentType,
      jobDescription: this.addcomp.value.jobDescription,
      jobLocation: this.addcomp.value.jobLocation,
      requirements: this.addcomp.value.requirements,
      lastApplicableDate: this.addcomp.value.lastApplicableDate,
      minSalary: +this.addcomp.value.minSalary,
      maxSalary: +this.addcomp.value.maxSalary,
      noOfPosition: +this.addcomp.value.noOfPosition
    };

    
    this.spinner.start();
    this.api.callApi(this.constant.ADDJOBPOSTING, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.handleSuccess(res.message)
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/preboardings/jobPosting']);
            this.spinner.stop();
          }, 3000);
        } else {
          this.handleError(res.message)
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
  selectcompany(id: any) {
    // this.rows = [];
    this.allbranch = [];
    this.alldepartment = [];
    this.alldesignation = []
    this.jobClassificationData = []
    this.selectedBranch = null;
    this.selectedDepartment = null;
    this.selecteddesig = null;
    this.selectedjobClassification = null

    // this.users_Body = {
    //   companyMasterID: '',
    //   branchMasterID: null,
    //   departmentId: null,
    //   designationId: null,
    //   page: 1,
    //   limit: 10,
    //   searchQuery: ''
    // }

    if (!id) return;
    // this.isResetForm = false;


    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.spinner.stop('branch');
      });

    this.spinner.start('dep');
    this.api
      .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.alldepartment = res.data;
        this.spinner.stop('dep');
      });

    this.spinner.start('desig')
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;
          // this.page.totalCount = res.totalcount;
          this.spinner.stop('desig');
        }
      });

    const body = {
      companyMasterID: id
    }
    this.spinner.start('users');
    this.api
      .callApi(this.constant.LISTJOBROLECLASSIFICATION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.jobClassificationData = res.data;
        }
        this.spinner.stop('users');
      });
    // this.users_Body.companyMasterID = id;
    // this.getJobPostingData();
  }
  onToolbarRightClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}