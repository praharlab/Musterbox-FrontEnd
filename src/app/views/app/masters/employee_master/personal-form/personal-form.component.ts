import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { EmployeeDocumentRejectComponent } from '../../../request-common/employee-document-reject/employee-document-reject.component'

@Component({
    selector: 'app-personal-form',
    templateUrl: './personal-form.component.html',
    styleUrls: ['./personal-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PersonalFormComponent implements OnInit {

  rows: any = []
  scrollBarHorizontal = window.innerWidth < 1201;
  formValue: any;

  constructor(
    private modalService: BsModalService,
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private profileStatusService: ProfileStatusService,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
  }

  downloadForm(formName: string) {
    const body = {
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      formName: formName
    }
    this.spinner.start('download')
    this.api
      .callApi(this.constant.PERSONALINFORMATIONFORM, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            let base64String = 'data:application/pdf;base64,' + res.data;
            const fileName = formName == 'saveraGroupNewJoineeInductionTrainingForm' ? 'New Joinee Induction Training Form' : formName == 'saveraGroupMultipleShiftWorkingConsentForm' ? 'Multiple Shift Working Consent Form' : formName == 'saveraGroupCheckSheetCoverSheetRecruitment' ? 'Check Sheet CoverSheet Recruitment Form' : formName == 'saveraGroupPersonalInformationForm' ? 'Personal Information Form' : formName == 'saveraGroupContractForm' ? 'Contract Form' : formName == 'saveraGroupAppointmentLetter' ? 'Savera Group Appointment Letter' : 'Salary Structure Contractual Employee Form';
            this.downloadPdf(base64String, fileName)
          } else {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
          }
          this.spinner.stop('download');
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          setTimeout(() => {
            this.spinner.stop('download');
          }, 3000);
        },
      );
  }

  downloadPdf(base64String, fileName) {
    const source = base64String;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}.pdf`;
    link.click();
  }

  downloadAllForm() {
    const body = {
      userMasterID: this.formValue.ListEmployeeMasterComponent.id,
      formName: 'allPersonalInformationForm'
    }
    this.spinner.start('download')
    this.api
      .callApi(this.constant.PERSONALINFORMATIONFORM, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            let base64String = 'data:application/pdf;base64,' + res.data;
            this.downloadPdf(base64String, 'Personal Information Form')
          } else {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
          }
          this.spinner.stop('download');
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          setTimeout(() => {
            this.spinner.stop('download');
          }, 3000);
        },
      );
  }
}
