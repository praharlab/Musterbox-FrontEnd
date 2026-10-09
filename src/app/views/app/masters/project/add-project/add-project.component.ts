import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { CommonNotificationService } from 'src/app/services/common-notification.service';

@Component({
    selector: 'app-add-project',
    templateUrl: './add-project.component.html',
    styleUrls: ['./add-project.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddProjectComponent implements OnInit {
  @ViewChild('adddesignation') adddesignation: NgForm;
  ipAddress: any;
  company: any = [];
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  adminRoot = environment.adminRoot;
  selectedBranch: any = null;
  allSites: any = [];
  allbranch: any = [];
  filterData = {
    companyMasterID: null,
    branchMasterID: null,
  };

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
  ) {}

  ngOnInit(): void {
    this.company_id = +localStorage.getItem('company_id');
    this.getcompany();
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.selectCompany(this.company_id);
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.adddesignation.valid) {
      return;
    }

    let body = {
      projectName: this.adddesignation.value.projectName,
      companyMasterID: this.adddesignation.value.companyMasterID,
      branchMasterID: this.adddesignation.value.branch,
      siteID: this.adddesignation.value?.site,
      projectDescription: this.adddesignation.value.projectDescription,
      short_name: this.adddesignation.value.short_name,
      display_id: this.adddesignation.value.display_id,
    };
    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.ADDPROJECT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/project']);
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop();
          }, 3000);
        } else {
          this.buttonDisabled = false;
          this.commonNotificationService.handleError(res.message);
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop();
        }
      },
      (err) => {
        this.buttonDisabled = false;
        this.commonNotificationService.handleError(err.error.message);
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop();
      },
    );
  }

  getAllBranches(companyMasterID: number) {
    this.spinner.start('getAllbranches');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + companyMasterID, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.spinner.stop('getAllbranches');
      });
  }

  getAllSites(branchMasterID: number) {
    this.spinner.start('getAllSites');
    this.api
      .callApi(this.constant.LISTSITE, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        this.allSites = res.data;
        this.spinner.stop('getAllSites');
      });
  }

  selectCompany(companyMasteID: number) {
    this.filterData.companyMasterID = companyMasteID;
    this.allSites = [];
    this.allbranch = []
    this.filterData.branchMasterID = null;
    if (!this.filterData.companyMasterID) return;
    this.getAllBranches(companyMasteID);
  }

  selectBranch(branchMasterID: number) {
    this.filterData.branchMasterID = branchMasterID;
    this.allSites = [];
    if (!this.filterData.companyMasterID) return;
    this.getAllSites(branchMasterID);
  }
}
