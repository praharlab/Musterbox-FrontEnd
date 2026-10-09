import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { frequencyTypes, documentTypes } from 'src/app/constants/commonVariables';
import { CommonNotificationService } from 'src/app/services/common-notification.service';

@Component({
    selector: 'app-edit-joining-document-type',
    templateUrl: './edit-joining-document-type.component.html',
    styleUrls: ['./edit-joining-document-type.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditJoiningDocumentTypeComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  editData: any = [];
  adminRoot = environment.adminRoot;
  formValue: any;
  documentType: any = documentTypes;
  frequencyTypes: any = frequencyTypes;
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute, 
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.editdata();
  }
  editdata() {
    let queryString = `?joiningDocumentMasterID=${this.formValue.ListJoiningDocumentTypeComponent.id}`;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETJOININGDOCUMENTTYPEBYID + queryString, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.editData = res.data;
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.commonNotificationService.handleError(err.error.message);
        },
      );
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    const body = {
      joiningDocumentMasterID: this.formValue.ListJoiningDocumentTypeComponent.id,
      companyMasterID: this.editData.companyMasterID,
      documentName: this.addcomp.value.documentName,
      description: this.addcomp.value.description,
      documentFileType: this.addcomp.value.documentFileType,
      hasFromDate: this.addcomp.value.hasFromDate,
      hasIssueDate: this.addcomp.value.hasIssueDate,
      hasExpiryDate: this.addcomp.value.hasExpiryDate,
      hasIdentificationNumber: this.addcomp.value.hasIdentificationNumber,
      setReminderForExpiry: this.addcomp.value.setReminderForExpiry,
      reminderBeforeDays: this.addcomp.value.setReminderForExpiry ? +this.addcomp.value.reminderBeforeDays : null,
      reminderFrequency: this.addcomp.value.setReminderForExpiry ? this.addcomp.value.reminderFrequency : null,
    };
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEJOININGDOCUMENTTYPE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/joiningDocumentType']);

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
