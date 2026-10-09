import { ChangeDetectorRef, Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ConstantService } from '../services/constant.service';
import { CommonNotificationService } from '../services/common-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-documents-upload',
    templateUrl: './documents-upload.component.html',
    styleUrls: ['./documents-upload.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DocumentsUploadComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;

  constructor(
    private spinner: NgxUiLoaderService,
    private route: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  preboardingID: any = 0;
  image: any;
  preBordingDocumentData: any = [];
  showMyContainer: boolean = false;
  showMyMessage: boolean = false;

  async ngOnInit() {
    const query = this.route.snapshot.paramMap.get('query');
    const data = JSON.parse(this.decodeSecureFix(query))
    this.preboardingID = data.preboardingID;
    await this.callApiForDocs(data);
  }

  private decodeSecureFix(brokenBase64: string): any {
    const secretKey = environment.secretKeyForEncoding;

    // Convert to hex manually, since Buffer doesn't exist in Angular
    const marker = Array.from(secretKey).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');

    if (!brokenBase64.includes(marker)) {
      throw new Error("Invalid or tampered string.");
    }

    const repaired = brokenBase64.replace(marker, '');

    // Decode base64 to UTF-8 string
    const json = decodeURIComponent(escape(window.atob(repaired))); // atob returns binary string
    return JSON.parse(json);
  }

  private async callApiForDocs(data: any) {
    let queryString = `?designationId=${data.designationID}&requiredUserType=${data.requiredUserType}`;

    this.spinner.start('company');
    this.api.callApi(this.constant.GETDOCUMENTBYDESIGNATIONIDANDREQUIREDUSERTYPEOPEN + queryString, {}, 'GET', true, false, false).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.preBordingDocumentData = res.data;
          if (this.preBordingDocumentData && this.preBordingDocumentData.length > 0) {
            this.preBordingDocumentData = this.preBordingDocumentData.map((e) => {
              return {
                ...e,
                attachment: [],
                fromDate: '',
                issueDate: '',
                expiryDate: '',
                identificationNumber: '',
              };
            });
            this.showMyContainer = true;
            this.cdr.detectChanges();
          }
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
    const formData = new FormData();
    formData.append(`preboardingID`, this.preboardingID);
    if (this.preBordingDocumentData.length > 0) {
      this.preBordingDocumentData.forEach((item, index) => {
        formData.append(`attachment`, item.attachment);
        formData.append(`fromDate${index}`, item.fromDate);
        formData.append(`issueDate${index}`, item.issueDate);
        formData.append(`expiryDate${index}`, item.expiryDate);
        formData.append(`identificationNumber${index}`, item.identificationNumber);
        formData.append(`joiningDocumentMasterID${index}`, item.joiningDocumentMasterID);
        formData.append(`designationWiseDocumentID${index}`, item.designationWiseDocumentID);
      })
    }
    this.spinner.start();
    this.api.callApi(this.constant.ADDPREBORDINGDOCS , formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.showMyContainer = false;
          this.showMyMessage = true;
          this.commonNotificationService.handleSuccess(res.message)
        } else {
          this.commonNotificationService.handleError(res.message)
        }
        this.spinner.stop();
      },
      (err) => {
        this.commonNotificationService.handleSuccess(err)
      },
    );
  }

  onFileChange(event: any, i) {
    this.image = null
    if (event.target.files && event.target.files.length > 0) this.image = event.target.files[0]
    else this.image = null
    this.preBordingDocumentData[i].attachment = this.image
  }

}
