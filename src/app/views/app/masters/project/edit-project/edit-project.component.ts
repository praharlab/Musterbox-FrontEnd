import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
@Component({
    selector: 'app-edit-project',
    templateUrl: './edit-project.component.html',
    styleUrls: ['./edit-project.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditProjectComponent implements OnInit {
  @ViewChild('adddesignation') adddesignation: NgForm;
  ipAddress: any;
  company: any = [];
  projectData: any;
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  adminRoot = environment.adminRoot;
  formValue: any;
  allSites: any = [];
  allbranch: any = [];
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.editdata();
  }
  editdata() {
    let queryString = `?projectID=${this.formValue.ListProjectComponent.id}`;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETPROJECTBYID + queryString, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.projectData = res.data;
          this.projectData.siteID = this.projectData.siteID ? this.projectData.siteID : null;
          this.getcompany();
          if (this.projectData?.companyMasterID) this.getAllBranches();
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.commonNotificationService.handleError(err.error.message);
        },
      );
  }

  onSubmit() {
    if (!this.adddesignation.valid) {
      return;
    }
    let body;
    body = {
      companyMasterID: this.projectData.companyMasterID,
      branchMasterID: this.adddesignation.value.branch,
      siteID: this.adddesignation.value.site,
      projectName: this.adddesignation.value.projectName,
      projectDescription: this.adddesignation.value.projectDescription,
      projectID: this.formValue?.ListProjectComponent?.id,
      short_name: this.adddesignation.value.short_name,
      display_id: this.adddesignation.value.display_id,
    };
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.spinner.start('submit');
    this.api.callApi(this.constant.EDITPROJECT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/project']);
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop('submit');
          }, 3000);
        } else {
          this.commonNotificationService.handleError(res.message);
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('submit');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop('submit');
      },
    );
  }

  getcompany() {
    const body = {
      companyMasterID: this.projectData.companyMasterID,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.projectData.branchMasterID = this.projectData.branchMasterID
            ? +this.projectData.branchMasterID
            : null;
          if (this.projectData?.siteID) {
            this.projectData.siteID = this.projectData.siteID;
          }
          this.selectCompany(this.projectData.companyMasterID);
          this.spinner.stop();
        }
      });
  }

  getAllBranches() {
    this.allbranch = []
    this.spinner.start('getAllbranches');
    this.api
      .callApi(
        this.constant.BRANCHBYCOMPANYDATA1 + this.projectData?.companyMasterID,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        this.allbranch = res;
        this.getAllSites();
        this.spinner.stop('getAllbranches');
      });
  }

  getAllSites() {
    this.allSites = [];
    this.spinner.start('getAllSites');
    this.api
      .callApi(
        this.constant.LISTSITE,
        {
          companyMasterID: this.projectData.companyMasterID,
          branchMasterID: this.projectData.branchMasterID,
        },
        'POST',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        this.allSites = res.data;
        this.projectData.siteID = this.projectData.siteID;
        this.spinner.stop('getAllSites');
      });
  }

  selectCompany(companyMasteID: number) {
    this.projectData.companyMasterID = companyMasteID;
    this.projectData.branchMasterID = null;
    this.projectData.siteID = null;
    this.getAllBranches();
  }

  selectBranch(branchMasterID: number) {
    this.projectData.branchMasterID = branchMasterID;
    this.projectData.siteID = null;
    this.getAllSites();
  }
}
