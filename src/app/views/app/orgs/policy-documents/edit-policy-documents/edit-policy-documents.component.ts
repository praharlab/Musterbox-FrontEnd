import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-policy-documents',
    templateUrl: './edit-policy-documents.component.html',
    styleUrls: ['./edit-policy-documents.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditPolicyDocumentsComponent implements OnInit {
  @ViewChild('editPolicyDocument') editPolicyDocument: NgForm;
  ipAddress: any;
  company: any = [];
  editData: any;
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  file: any;
  url: string | ArrayBuffer;
  file1: any = '';
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;
  formValue: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.editdata();
  }
  editdata() {
    let id = this.formValue.ListPolicyDocumentsComponent.id;
    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETONEPOLICYDOCUMENT + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.data) {
            this.editData = res.data;
            // this.editData.document = this.editData.document.replace(/\\/g, '/');
          }

          this.spinner.stop('start');
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('start');
        },
      );
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

  ViewDocument(item) {
    window.open(this.apiURL + item.document, '_blank');
  }

  onSubmit() {
    if (!this.editPolicyDocument.valid) {
      return;
    }

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    const formData = new FormData();
    if (this.file) {
      formData.append('document', this.file);
    }

    formData.append('name', this.editPolicyDocument.value.policyDocumentName);
    formData.append('description', this.editPolicyDocument.value.description);
    formData.append('companyMasterID', this.editData.companyMasterId);

    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.UPDATEPOLICYDOCUMENT + this.formValue.ListPolicyDocumentsComponent.id,
        formData,
        'PUT',
        true,
        true,
        true,
      )
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
