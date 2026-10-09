import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-site',
    templateUrl: './add-site.component.html',
    styleUrls: ['./add-site.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddSiteComponent implements OnInit {

  @ViewChild('addsite') addsite: NgForm;
  adminRoot = environment.adminRoot;
  companyData: any[] = [];
  allBranches: any[] = [];
  filterData = {
    companyMasterID: null,
    branchMasterID: null
  }

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    this.getcompany();
  }

  getcompany() {
    this.filterData.companyMasterID = +localStorage.getItem('company_id')
    const body = {
      companyMasterID: this.filterData.companyMasterID,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.companyData = res.data;
          this.selectCompany(this.filterData?.companyMasterID);
          this.spinner.stop();
        }
      });
  }

  getAllBranches(companyMasterID: number) {
    this.spinner.start('getAllbranches');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + companyMasterID, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allBranches = res;
        this.spinner.stop('getAllbranches');
      });
  }

  selectCompany(companyMasteID: number) {
    this.filterData.companyMasterID = companyMasteID;
    this.filterData.branchMasterID = null;
    this.getAllBranches(companyMasteID);
  }

  onSubmit() {
    if (!this.addsite.valid) {
      return;
    }

    let body = {
      siteName: this.addsite.value.siteName,
      siteCode: this.addsite.value.siteCode,
      companyMasterID: this.addsite.value.companyMasterID,
      branchMasterID: this.addsite.value.branch,
    }
    this.spinner.start();
    this.api.callApi(this.constant.ADDSITE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/site']);
            this.spinner.stop();
          }, 3000);
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop();
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop();
      },
    );
  }

}
