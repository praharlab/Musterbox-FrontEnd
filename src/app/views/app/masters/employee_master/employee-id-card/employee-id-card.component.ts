import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import html2canvas from 'html2canvas';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-employee-id-card',
    templateUrl: './employee-id-card.component.html',
    styleUrls: ['./employee-id-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeIdCardComponent implements OnInit {
  apiURL = environment.apiUrl;
  idCardData: any;
  formValue: any;
  defaultCompany: number = Number(localStorage.getItem('company_id'));
  idCardPdfData: any;
  idCardPdfData2: string;
  idCardData2: string;
  idCardFullPdfData: string;
  idcardName: string = '';

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {

    this.formValue = this.formValueStorageService.getData();
    this.defaultCompany = Number(localStorage.getItem('company_id'));

    this.getIdCardData();
    this.getIdCardData2();
  }

  getIdCardData() {
    this.spinner.start('load');
    let idCardType = 'portraitIdCard';

    switch (this.defaultCompany) {
      case 277:
      case 298:
      case 300:
        idCardType = 'portraitSingleIdCardForAsoplav';
        break;
      default:
        idCardType = 'portraitSingleIdCard';
        break;
    }

    let body = {
      idCardType: idCardType,
      userMasterID: [this.formValue && this.formValue.ListEmployeeMasterComponent ? +this.formValue.ListEmployeeMasterComponent.id : +localStorage.getItem('id')],
    };
    this.api.callApi(this.constant.IDCARDDETAILS, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.idcardName = res.name;
          this.idCardData = 'data:image/jpeg;base64,' + res.jpegBase64Path;
          this.idCardPdfData = 'data:application/pdf;base64,' + res.data;
          this.spinner.stop('load');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('load');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('load');
      },
    );
  }

  getIdCardData2() {
    this.spinner.start('load2');
    let idCardType = 'portraitIdCard';
    switch (this.defaultCompany) {
      case 277:
      case 298:
      case 300:
        idCardType = 'landscapeSingleIdCardForAsoplav';
        break;
      default:
        idCardType = 'landscapeSingleIdCard';
        break;
    }

    let body = {
      idCardType: idCardType,
      userMasterID: [this.formValue && this.formValue.ListEmployeeMasterComponent ? +this.formValue.ListEmployeeMasterComponent.id : +localStorage.getItem('id')],

    };
    this.api.callApi(this.constant.IDCARDDETAILS, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.idcardName = res.name;
          this.idCardData2 = 'data:image/jpeg;base64,' + res.jpegBase64Path;
          this.idCardPdfData2 = 'data:application/pdf;base64,' + res.data;
          this.spinner.stop('load2');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('load2');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('load2');
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

  onClickDownloadPdf() {
    let base64String = this.idCardPdfData;
    this.downloadPdf(base64String, this.idcardName);
  }

  onClickDownloadPdf2() {
    let base64String = this.idCardPdfData2;
    this.downloadPdf(base64String, this.idcardName);
  }

  onClickDownloadSmallPdf() {
    let idCardType = 'portraitIdCard';

    switch (this.defaultCompany) {
      case 277:
      case 298:
      case 300:
        idCardType = 'portraitIdCardForAsoplav';
        break;
      default:
        idCardType = 'portraitIdCard';
        break;
    }
    this.spinner.start('load3');
    let body = {
      idCardType: idCardType,
      userMasterID: [this.formValue && this.formValue.ListEmployeeMasterComponent ? +this.formValue.ListEmployeeMasterComponent.id : +localStorage.getItem('id')],

    };
    this.api.callApi(this.constant.IDCARDDETAILS, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.idcardName = res.name;
          let base64String = 'data:application/pdf;base64,' + res.data;
          this.downloadPdf(base64String, this.idcardName);
          this.spinner.stop('load3');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('load3');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('load3');
      },
    );
  }

  onClickDownloadSmallPdf2() {
    let idCardType = 'portraitIdCard';
    switch (this.defaultCompany) {
      case 277:
      case 298:
      case 300:
        idCardType = 'landscapeIdCardForAsoplav';
        break;
      default:
        idCardType = 'landscapeIdCard';
        break;
    }
    this.spinner.start('load4');
    let body = {
      idCardType: idCardType,
      userMasterID: [this.formValue && this.formValue.ListEmployeeMasterComponent ? +this.formValue.ListEmployeeMasterComponent.id : +localStorage.getItem('id')],

    };
    this.api.callApi(this.constant.IDCARDDETAILS, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.idcardName = res.name;
          let base64String = 'data:application/pdf;base64,' + res.data;
          this.downloadPdf(base64String, this.idcardName);
          this.spinner.stop('load4');
        } else {
          this.handleError('Something Went Wrong!');
          this.spinner.stop('load4');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('load4');
      },
    );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
