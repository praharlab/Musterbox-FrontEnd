import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-view-company-master',
    templateUrl: './view-company-master.component.html',
    styleUrls: ['./view-company-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViewCompanyMasterComponent implements OnInit {
  companydata: any;
  cityname: any;
  statename: any;
  countryname: any;
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  mediumDateFormat = environment.mediumDateFormat;
  companytype: any;
  formValue: any;
  constructor(
    private spinner: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    public api: ApiService,
    private formValueStorageService: FormValueStorageService,
    private constant: ConstantService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.view_Company();
  }
  view_Company() {
    let companyid = this.formValue.ListCompanyMasterComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWCOMPANYDATA + companyid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.companydata = res.data;
          this.cityname = this.companydata['cityMaster.cityName'];
          this.companytype = this.companydata['companyType.companyTypename'];
          this.statename = this.companydata['cityMaster.stateMaster.stateName'];
          this.countryname = this.companydata['cityMaster.stateMaster.countryMaster.countryName'];
          this.spinner.stop();
        },
        (err) => {
          this.spinner.stop();
        },
      );
  }
}
