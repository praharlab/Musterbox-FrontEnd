import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { CommonNotificationService } from 'src/app/services/common-notification.service';

@Component({
    selector: 'app-add-tds-subsection-limit',
    templateUrl: './add-tds-subsection-limit.component.html',
    styleUrls: ['./add-tds-subsection-limit.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddTdsSubsectionLimitComponent implements OnInit {

  @ViewChild('addTdsSubSectionLimit') addTdsSubSectionLimit: NgForm;
  ipAddress: any;
  tdsSectionData: any = [];
  usertype: any;
  adminRoot = environment.adminRoot;
  tdsSubSectionCategory: any;
  selectedSubSectionID: any;
  tdsSubSectionData: any = [];
  selectedSection: any;
  selectedCategory: any;
  subsectionQuery: string;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private commonNotificationService: CommonNotificationService,
    private api: ApiService,
    private constant: ConstantService,
  ) { }

  ngOnInit(): void {
    this.getTDSSection();
    this.getTDSSubSectioCategory();
  }

  getTDSSubSection() {

    this.tdsSubSectionData = [];
    this.subsectionQuery = '';
    this.selectedSubSectionID = null;

    if (this.selectedSection || this.selectedCategory) {

      if (this.selectedSection) this.subsectionQuery += `?tdsSectionID=${this.selectedSection}`;
      if (this.selectedCategory) this.subsectionQuery += (this.selectedSection ? '&' : '?') + `tdsSubSectionCategoryID=${this.selectedCategory}`;

      this.spinner.start('b');
      this.api
        .callApi(this.constant.GETALLDATATDSSUBSECTION + this.subsectionQuery, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.tdsSubSectionData = res.data;

          }
          this.spinner.stop('b');
        }, (e) => {
          this.spinner.stop('b');
        });
    }

  }

  getTDSSubSectioCategory() {
    this.spinner.start('category')
    this.api
      .callApi(this.constant.GETTDSSUBSECTIONCATEGORYLIST, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.tdsSubSectionCategory = res.data;
          }

          this.spinner.stop('category');
        },
        (err) => {
          this.spinner.stop('category');
        },
      );
  }

  getTDSSection() {
    this.spinner.start('section');
    this.api
      .callApi(this.constant.GETALLDATATDSSECTION, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.tdsSectionData = res.data;
          this.spinner.stop('section');
        }
      });
  }

  onSubmit() {
    if (!this.addTdsSubSectionLimit.valid) {
      return;
    }

    const body = {
      tdsSubSectionID: this.selectedSubSectionID,
      maxLimit: this.addTdsSubSectionLimit.value.maxLimit,
      applicableYYYYMM: this.addTdsSubSectionLimit.value.applicableYYYYMM.replace('-', '')
    };

    this.spinner.start('add');

    this.api.callApi(this.constant.ADDTDSSUBSECTIONLIMIT, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/list_tds_sub_section_limit']);
            this.spinner.stop('add');
          }, 3000);
        } else {
          this.commonNotificationService.handleWarning(res.message);
          this.spinner.stop('add');
        }
      },
      (err) => {

        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('add');
      },
    );
  }

  cancel() {
    this.router.navigate([this.adminRoot + '/superadminmenus/list_tds_sub_section_limit']);
  }

}
