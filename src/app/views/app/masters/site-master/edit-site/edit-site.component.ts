import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-edit-site',
    templateUrl: './edit-site.component.html',
    styleUrls: ['./edit-site.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditSiteComponent implements OnInit {

  @ViewChild('editsite') editsite: NgForm;
    adminRoot = environment.adminRoot;
    companyData: any[] = [];
    allBranches: any[] = [];
    siteData: any
    formValue: any

  constructor(
      private spinner: NgxUiLoaderService,
      private router: Router,
      private api: ApiService,
      private constant: ConstantService,
      private commonNotificationService: CommonNotificationService,
      private formValueStorageService: FormValueStorageService,
    ) { }
  
    ngOnInit(): void {
      this.formValue = this.formValueStorageService.getData();
      this.editdata()
    }
  
    getcompany() {
      const body = {
        companyMasterID: this.siteData?.companyMasterID,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.companyData = res.data;
            this.selectCompany(this.siteData?.companyMasterID);
            this.spinner.stop();
          }
        });
    }
  
    getAllBranches(companyMasterID: number){
      this.spinner.start('getAllbranches');
      this.api
          .callApi(this.constant.BRANCHBYCOMPANYDATA1 + companyMasterID, {}, 'GET', true, false, true)
          .subscribe((res: any) => {
            this.allBranches = res;
            this.spinner.stop('getAllbranches');
          });
    }
  
    selectCompany(companyMasteID: number){
      this.getAllBranches(companyMasteID);
    }
  
    onSubmit() {
      if (!this.editsite.valid) {
        return;
      }
  
      let body = {
        siteID: this.siteData.siteID,
        siteName: this.editsite.value.siteName,
        siteCode: this.editsite.value.siteCode,
      }
      this.spinner.start();
      this.api.callApi(this.constant.EDITSITE, body, 'PUT', true, true, true).subscribe(
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

    editdata() {
    let siteID = this.formValue.ListSiteComponent.id;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETSITEBYID + siteID, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.siteData = res.data;
          this.siteData.companyMasterID = +this.siteData.companyMasterID;
          this.siteData.branchMasterID = +this.siteData.branchMasterID;
          this.getcompany();
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.commonNotificationService.handleError(err.error.message);
        },
      );
  }

}
