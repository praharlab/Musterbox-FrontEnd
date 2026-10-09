import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';

@Component({
    selector: 'app-edit-tds-subsection-limit',
    templateUrl: './edit-tds-subsection-limit.component.html',
    styleUrls: ['./edit-tds-subsection-limit.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditTdsSubsectionLimitComponent implements OnInit {

  @ViewChild('editTdsSubSectionLimit') editTdsSubSectionLimit: NgForm;
  ipAddress: any;
  tdsSubSectionData: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  adminRoot = environment.adminRoot;
  tdsSectionData: any = [];
  tdsSubSectionCategory: any;

  formValue: any;
  tdsSubSectionLimitData: any;
  section: any;
  sectionCategory: any;
  subSection: any;
  applicableYYYYMM: string;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private commonNotificationService: CommonNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.getData();

  }


  getData() {
    let id = this.formValue.ListTdsSubsectionLimitComponent.id;
    this.spinner.start('get');
    this.api
      .callApi(this.constant.GETBYIDTDSSUBSECTIONLIMIT + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.tdsSubSectionLimitData = res.data;
          this.section = this.tdsSubSectionLimitData.tdsSubSection?.tdsSection?.tdsSectionName || '';
          this.sectionCategory = this.tdsSubSectionLimitData.tdsSubSection?.tdsSubSectionCategory?.categoryName || '';
          this.subSection = this.tdsSubSectionLimitData.tdsSubSection?.tdsSubSectionName || '';
          this.applicableYYYYMM = String(this.tdsSubSectionLimitData.applicableYYYYMM).slice(0, 4) + '-' + String(this.tdsSubSectionLimitData.applicableYYYYMM).slice(4, 6);

          this.spinner.stop('get');
        }
      });
  }

  onSubmit() {
    if (!this.editTdsSubSectionLimit.valid) {
      return;
    }

    let id = this.formValue.ListTdsSubsectionLimitComponent.id;

    const body = {
      maxLimit: this.tdsSubSectionLimitData.maxLimit,
      applicableYYYYMM: this.applicableYYYYMM.replace('-', '')
    };

    this.spinner.start('update');

    this.api
      .callApi(this.constant.UPDATETDSSUBSECTIONLIMIT + id, body, 'PUT', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.commonNotificationService.handleSuccess(res.message);
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/superadminmenus/list_tds_sub_section_limit']);
              this.spinner.stop('update');
            }, 3000);
          } else {
            this.commonNotificationService.handleWarning(res.message);
            this.spinner.stop('update');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('update');
        },
      );
  }

  cancel() {
    this.router.navigate([this.adminRoot + '/superadminmenus/list_tds_sub_section_limit']);
  }


}
