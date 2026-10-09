import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { customizeProfileFields } from 'src/app/constants/commonVariables';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-customize-profile',
    templateUrl: './customize-profile.component.html',
    styleUrls: ['./customize-profile.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CustomizeProfileComponent implements OnInit {
  @ViewChild('filterForm', { static: true }) filterForm: NgForm;

  selectedFieldsList: string[] = [
    customizeProfileFields.branchName,
    customizeProfileFields.companyName,
    customizeProfileFields.contactNo,
    customizeProfileFields.dateOfBirth,
    customizeProfileFields.department,
    customizeProfileFields.designation,
    customizeProfileFields.email,
  ];

  radiostatus: any = true;

  adminRoot = environment.adminRoot;

  selectedFields: any[] = [];
  allCompanies: any = [];

  filterData = {
    companyMasterID: null,
    fields: []
  }
  usertype: any;

  permissioncreate: any = []
  permissionview: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private commonNotificationService: CommonNotificationService
  ) { }

  ngOnInit(): void {
    this.checkpermission()
    this.getAllCompanies()
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'CustomizeProfile' &&
              permissionval.operationName.includes('Create')
            );
          });

          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'CustomizeProfile' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getAllCompanies() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start('company');
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allCompanies = res.data;
            this.selectcompany(+localStorage.getItem('company_id'));
            this.spinner.stop('company');
          }
        }, (error) => {
          this.commonNotificationService.handleError('Something went wrong');
        });
    } else {
      const body = {
        companyMasterID: +localStorage.getItem('company_id'),
      };
      this.spinner.start('company');
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allCompanies = res.data;
            this.filterData.companyMasterID = +localStorage.getItem('company_id');
            this.selectcompany(+localStorage.getItem('company_id'));
            this.spinner.stop('company');
          }
        }, (error) => {
          this.commonNotificationService.handleError('Something went wrong');
        });
    }
  }

  selectcompany(companyMasterID: any) {
    this.getCustomizeProfileData(companyMasterID);
  }

  onSubmit() {
    this.updateCustomizeProfile();
  }

  cancel() {
    this.router.navigate([this.adminRoot + '/payrolls'])
  }

  getCustomizeProfileData(companyMasterID: number) {
    this.spinner.start('getProfileData');
    this.api
      .callApi(this.constant.GETCUSTOMIZEPROFILE, { companyMasterID }, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          if(!res.data.fields.includes('none')){
            this.filterData.fields = res.data?.fields;
            this.radiostatus = true
          }else{
            this.radiostatus = false
          }
          this.spinner.stop('getProfileData');
        }
      });
  }

  updateCustomizeProfile() {
    if(!this.radiostatus){
      this.filterData.fields = ['none'];
    }
    this.spinner.start('updateProfile');
    this.api
      .callApi(this.constant.UPDATECUSTOMIZEPROFILE, this.filterData, 'PUT', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          this.spinner.stop('updateProfile');
        }
      }, (error) => {
        this.commonNotificationService.handleError(error.error.message);
      });
  }
}
