import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-policy-documents',
    templateUrl: './add-policy-documents.component.html',
    styleUrls: ['./add-policy-documents.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddPolicyDocumentsComponent implements OnInit {
  @ViewChild('addPolicyDocument') addPolicyDocument: NgForm;
  ipAddress: any;
  company: any = [];
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  file: any;
  file1: any = '';
  url: any;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
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

          this.spinner.stop();
        }
      });
  }

  onSelectFile(event: any) {
    this.file = event.target.files && event.target.files[0];
    if (this.file) {
      const allowedExtensions = ['.pdf', '.doc', '.docx'];
      const fileExtension = this.file.name
        .toLowerCase()
        .slice(((this.file.name.lastIndexOf('.') - 1) >>> 0) + 2);
      const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB

      if (allowedExtensions.includes('.' + fileExtension) && this.file.size <= maxSizeInBytes) {
        var reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = (event) => {
          this.url = (<FileReader>event.target).result;
        };
      } else {
        if (!allowedExtensions.includes('.' + fileExtension)) {
          this.notifications.create(
            'Invalid file type.',
            'Please select a PDF, DOC, or DOCX file.',
            NotificationType.Error,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.file1 = '';
        } else {
          this.notifications.create(
            'File size exceeds .',
            'the maximum limit of 10 MB.',
            NotificationType.Error,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.file1 = '';
        }
      }
    }
  }

  onSubmit() {
    if (!this.addPolicyDocument.valid) {
      return;
    }

    const formData = new FormData();
    formData.append('document', this.file);
    formData.append('name', this.addPolicyDocument.value.policyDocumentName);
    formData.append('description', this.addPolicyDocument.value.description);
    formData.append('companyMasterID', this.addPolicyDocument.value.companyMasterID);

    this.spinner.start('start');
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api
      .callApi(this.constant.CREATEPOLICYDOCUMENT, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/orgs/listPolicyDocuments']);
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop('start');
          }, 3000);
        },
        (err) => {
          this.buttonDisabled = false;
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('start');
        },
      );
  }
}
