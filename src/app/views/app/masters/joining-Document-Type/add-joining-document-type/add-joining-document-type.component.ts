import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { frequencyTypes, documentTypes } from 'src/app/constants/commonVariables';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
@Component({
    selector: 'app-add-joining-document-type',
    templateUrl: './add-joining-document-type.component.html',
    styleUrls: ['./add-joining-document-type.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddJoiningDocumentTypeComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  adminRoot = environment.adminRoot;

  comp: any;
  company_id: any;
  selectedDocumentType: any;
  isExpiry: boolean;
  reminderForExpiry: boolean = false;
  documentType: any = documentTypes;
  frequencyTypes: any = frequencyTypes;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    this.company_id = +localStorage.getItem('company_id');
    this.getcompany();
  }
  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.comp = res.data;
          this.spinner.stop('company');
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    let body = {
      companyMasterID: this.addcomp.value.companyMasterID,
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
    this.api.callApi(this.constant.ADDJOININGDOCUMENTTYPE, body, 'POST', true, true, true).subscribe(
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
