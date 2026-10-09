import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';

@Component({
    selector: 'app-add-preboarding',
    templateUrl: './add-preboarding.component.html',
    styleUrls: ['./add-preboarding.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddPreboardingComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  permissionview: any = [];
  elementType = 'url' as const;
  correctionLevel = 'H' as const;
  value: any;
  filterData = {
    companyMasterID: [+localStorage.getItem('company_id')],
  };
  preboardingMaster: any;
  comp: any;
  constructor(
    private api: ApiService,
    private constant: ConstantService,
    private spinner: NgxUiLoaderService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    this.getPreboardingForms();
    this.checkpermission();
    this.getcompany1();
  }

  getcompany1() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.comp = res.data;

          this.spinner.stop();
        }
      });
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'PreBoardingForm' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  getPreboardingForms() {
    this.spinner.start('main')
    this.api
      .callApi(this.constant.GETPREBOARDINGMASTER, this.filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.preboardingMaster = res.data;

          for (let i = 0; i < this.preboardingMaster.length; i++) {
            this.preboardingMaster[i].url = environment.appUrl + this.preboardingMaster[i].secretKey;
          }
        }
        this.spinner.stop('main');
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) return;

    this.filterData.companyMasterID = this.datefilter.value.companyMasterID
    this.getPreboardingForms();
  }
  public downloadQRCode(i: any) {
    const fileNameToDownload = 'image_qrcode';

    const base64Img = document.getElementsByClassName('coolQRCode' + i)[0].children[0]['src'];
    fetch(base64Img)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileNameToDownload;
        link.click();
      });
  }
  clear() {
    window.location.reload();
  }
  openForm(url) {
    window.open(url, '_blank');
  }

  copyToClipboard(value: string) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        this.commonNotificationService.handleSuccess('Link Copied')
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }
}
