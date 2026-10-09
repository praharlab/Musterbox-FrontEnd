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
    selector: 'app-edit-job-posting',
    templateUrl: './edit-job-posting.component.html',
    styleUrls: ['./edit-job-posting.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditJobPostingComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  editData: any = {
    companyMasterID: ''
  };
  adminRoot = environment.adminRoot;
  formValue: any;
  allbranch: any = [];
  alldepartment: any = [];
  alldesignation: any = []
  comp: any;
  selectedjobClassification: any
  jobClassificationData: any

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.selectcompany(this.formValue.ListJobPostingComponent.body.companyMasterID)

    this.getIPAddress();
    this.getcompany();
    this.editdata();
  }
  editdata() {
    let queryString = `?jobPostingID=${this.formValue.ListJobPostingComponent.id}`;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETJOBPOSTINGBYID + queryString, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.editData = res.data;
          // this.selectcompany(this.editData.companyMasterID)
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.handleError(err.error.message);
        },
      );
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
    if (this.addcomp.value.minSalary > this.addcomp.value.maxSalary) {
      return this.handleWarning('Maximum salary can not less than minimum Salary')
    }
    if (this.addcomp.value.noOfPosition < 0) {
      return this.handleWarning('No Of Position Can Not be Less Then 0')
    }
    if (this.addcomp.value.noOfPosition == 0) {
      return this.handleWarning('No Of Position Can Not be 0')
    }
    const body = {
      jobPostingID: +this.formValue.ListJobPostingComponent.id,
      companyMasterID: +this.addcomp.value.companyMasterID,
      branchMasterID: +this.addcomp.value.branchMasterID,
      departmentId: +this.addcomp.value.departmentId,
      designationId: +this.addcomp.value.designationId,
      jobTitle: this.addcomp.value.jobTitle,
      employmentType: this.addcomp.value.employmentType,
      jobDescription: this.addcomp.value.jobDescription,
      jobLocation: this.addcomp.value.jobLocation,
      requirements: this.addcomp.value.requirements,
      lastApplicableDate: this.addcomp.value.lastApplicableDate,
      minSalary: +this.addcomp.value.minSalary,
      maxSalary: +this.addcomp.value.maxSalary,
      noOfPosition: +this.addcomp.value.noOfPosition,
      jobRoleClassificationID: +this.addcomp.value.jobRoleClassificationID,
    };
    this.spinner.start();
    this.api.callApi(this.constant.EDITJOBPOSTING, body, 'PUT', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/preboardings/jobPosting']);

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
  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          // this.selectcompany(this.company_id)
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
  selectcompany(id: any) {
    this.allbranch = [];
    this.alldepartment = [];
    this.alldesignation = []
    if (this.editData) {
      this.editData.branchMasterID = null;
      this.editData.departmentId = null;
      this.editData.designationId = null;
    }

    if (!id) return;
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
  }
  onToolbarRightClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
