import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { Router } from '@angular/router';
import { AppNotificationService } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { environment } from 'src/environments/environment';
import { NationalityListService } from 'src/app/services/nationality-list.service';

@Component({
    selector: 'app-preboard-info',
    templateUrl: './preboard-info.component.html',
    styleUrls: ['./preboard-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PreboardInfoComponent implements OnInit {
  @ViewChild('closeViewFormModal') closeViewFormModal: ElementRef;
  @ViewChild('viewFormModal') viewFormModal;
  countryData: any = [];
  alldesignation: any;
  pdfs: any = [];
  allbranch: any;
  editpreboardingdatavalue: any;
  field: any;
  temp2: any;
  temp1: {
    fieldLabel: string;
    inputType: string;
    isRequired: string;
    companyMasterID: number;
    createBy: string;
    createByIp: string;
    createdAt: string;
    mousehovermessage: string;
    preboardingFormCustomizeID: number;
    status: number;
    updateBy: any;
    updateByIp: any;
    updatedAt: string;
  };
  morinfo: any = [];
  customizeFields: any = [];
  apiURL = environment.apiUrl;
  numberTypeLabel: string = 'number';
  imageTypeLabel: string = 'image';
  pdfTypeLabel: string = 'pdf';
  textTypeLabel: string = 'text';
  radioTypeLabel: string = 'radio';
  dropDownLabel: string = 'dropdown';
  signatureLabel: string = 'signature';
  textareaLabel: string = 'textarea';
  dateTypeLabel: string = 'date';
  monthTypeLabel: string = 'month';
  titleTypeLabel: string = 'title';
  preboardingdata: any;
  jobApplicationData: any;
  designationWiseDocumentData: any = [];
  nationalityList: any[] = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private nationalityListService: NationalityListService,
  ) { }

  ngOnInit(): void { }

  downlaodPreboardingForm() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.PREBOARDINGFORMDOWNLOAD +
        `?preboardingID=${this.preboardingdata.preboardingID}&preboardingMasterID=${this.preboardingdata.preboardingMasterID}`,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            // Create a download link

            const downloadLink = document.createElement('a');
            downloadLink.href = this.apiURL + 'uploads/preboarding/' + res.filename;
            downloadLink.target = '_blank'; // Open in a new window/tab
            downloadLink.download = res.filename;
            downloadLink.click();

            if (res.downloadImages.length > 0) {
              res.downloadImages.forEach((item) => {
                this.downloadImg(item.answer, item.question);
              });
            }

            if (res.downloadPdfs.length > 0) {
              res.downloadPdfs.forEach((item) => {
                this.downloadPdf(item.answer, item.question);
              });
            }
            this.spinner.stop();
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

  downloadImg(data: any, name: any) {
    if (!data) {
      return;
    }
    var a = document.createElement('a');
    a.href = data;
    a.download = name;
    a.click();
  }

  openImg(data: any) {
    var image = new Image();
    if (data.startsWith('data:image')) {
      image.src = data;
    } else {
      image.src = 'data:image/jpg;base64,' + data;
    }

    var w = window.open('');
    w.document.write(image.outerHTML);
  }

  openPDF(data: any) {
    let base64String = data;
    this.downloadPdf(base64String, 'PDF');
  }

  downloadPdf(base64String, fileName) {
    if (!base64String) {
      return;
    }
    const source = base64String;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}.pdf`;
    link.click();
  }

  openFile(data: any, fileName: any,) {
    var image = new Image();
    if (data.startsWith('data:image/png')) {
      image.src = data;
      this.downloadFile(data, fileName, 'png')
    } else if (data.startsWith('data:application/pdf')) {
      this.downloadFile(data, fileName, 'pdf')
    }
    else if (data.startsWith('data:image/jpeg') || data.startsWith('data:image/jpg')) {
      this.downloadFile(data, fileName, 'jpg')
    }

    // var w = window.open('');
    // w.document.write(image.outerHTML);
  }

  downloadFile(base64String: any, fileName: any, extension: any) {
    if (!base64String) {
      return;
    }
    const source = base64String;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}.${extension}`;
    link.click();
  }

  getallcountry() {
    let body = {
      page: '',
      limit: '',
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETCOUNTRYDATA, body, 'POST', true, false, false)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.countryData = res.data;
          this.spinner.stop();
        }
      });
  }

  getBranchData(id) {
    const branchBody = { companyMasterID: id };

    this.spinner.start('branch');
    this.api
      .callApi(this.constant.getAllBranchDataByCompanyId, branchBody, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allbranch = res.data;
        }
        this.spinner.stop('branch');
      });
  }
  getDesignationData(id) {
    const body = {
      page: '',
      limit: '',
      companyMasterID: id,
    };

    this.spinner.start('des');
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;
        }
        this.spinner.stop('des');
      });
  }

  getPreboaringCustomizeFields() {
    this.api
      .callApi(
        this.constant.VIEWPREBOARDINGCUSTOMIZE + this.preboardingdata.preboardingID,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.editpreboardingdatavalue = res.data;
          const body = {
            page: '',
            limit: '',
            preboardingMasterID: this.preboardingdata.preboardingMasterID,
          };
          this.spinner.start();
          this.api
            .callApi(
              this.constant.GETPREBOARDINGCUSTOMIZEBYCOMPANYID,
              body,
              'POST',
              true,
              false,
              true,
            )
            .subscribe((res: any) => {
              if (res.status == 200) {
                this.field = res.data;
                for (let s = 0; s < this.field.length; s++) {
                  this.field[s].fieldvalue = '';
                  this.field[s].fieldvalueid = '';
                }

                if (this.editpreboardingdatavalue) {
                  for (let i = 0; i < this.field.length; i++) {
                    for (let j = 0; j < this.editpreboardingdatavalue.length; j++) {
                      if (
                        this.field[i].preboardingFormCustomizeID ==
                        this.editpreboardingdatavalue[j].preboardingFormCustomizeID
                      ) {
                        this.field[i].fieldvalue = this.editpreboardingdatavalue[j].value;
                        this.field[i].fieldvalueid =
                          this.editpreboardingdatavalue[j].preboardingFormCustomizeValueID;
                      }
                    }
                  }
                }

                if (this.editpreboardingdatavalue) {
                  this.customizeFields = [];
                  this.pdfs = [];
                  for (let i = 0; i < this.field.length; i++) {
                    if (this.field[i].inputType == 'title') {
                      if (this.customizeFields.length % 2 == 0) {
                        this.temp2 = {
                          fieldLabel: ' ',
                          inputType: 'title',
                          isRequired: '',
                          companyMasterID: 3,
                          createBy: '1486',
                          createByIp: '43.241.144.255',
                          createdAt: '2023-02-25T07:20:35.801Z',
                          mousehovermessage: '',
                          preboardingFormCustomizeID: 216,
                          status: 1,
                          updateBy: null,
                          updateByIp: null,
                          updatedAt: '2023-02-25T07:20:35.801Z',
                        };
                        this.customizeFields.push(this.field[i]);
                        this.customizeFields.push(this.temp2);
                      } else {
                        this.temp2 = {
                          fieldLabel: ' ',
                          inputType: 'title',
                          isRequired: '',
                          companyMasterID: 3,
                          createBy: '1486',
                          createByIp: '43.241.144.255',
                          createdAt: '2023-02-25T07:20:35.801Z',
                          mousehovermessage: '',
                          preboardingFormCustomizeID: 216,
                          status: 1,
                          updateBy: null,
                          updateByIp: null,
                          updatedAt: '2023-02-25T07:20:35.801Z',
                        };
                        this.temp1 = {
                          fieldLabel: ' ',
                          inputType: 'title',
                          isRequired: '',
                          companyMasterID: 3,
                          createBy: '1486',
                          createByIp: '43.241.144.255',
                          createdAt: '2023-02-25T07:20:35.801Z',
                          mousehovermessage: '',
                          preboardingFormCustomizeID: 216,
                          status: 1,
                          updateBy: null,
                          updateByIp: null,
                          updatedAt: '2023-02-25T07:20:35.801Z',
                        };
                        this.customizeFields.push(this.temp2);
                        this.customizeFields.push(this.field[i]);
                        this.customizeFields.push(this.temp1);
                      }
                    } else {
                      this.customizeFields.push(this.field[i]);
                    }
                  }
                }
                this.spinner.stop();
              }
            });
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop();
        },
      );
  }
  getJobApplicationData(jobApplicationID: any) {
    if (!jobApplicationID) return;
    let queryString = `?jobApplicationID=${jobApplicationID}`;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETJOBAPPLICATIONBYID + queryString, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.jobApplicationData = res.data;
          this.jobApplicationData.userNumberCountryMasterID =
            +this.jobApplicationData.userNumberCountryMasterID;
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.commonNotificationService.handleError(err.error.message);
        },
      );
  }

  getNationalityData() {
    this.nationalityListService.fetchNationality().subscribe((res) => {
      this.nationalityList = res;
    });
  }

  getDesignationWiseDocumentBypreboardingID(preboardingID: any) {
    if (!preboardingID) return;
    if (this.preboardingdata.docUploadStatus != 2) return;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETPREBORDINGDOCS + preboardingID, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.designationWiseDocumentData = res.data;
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.commonNotificationService.handleError(err.error.message);
        },
      );
  }
  private showform(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.customizeFields = [];
      this.pdfs = [];

      this.getBranchData(this.preboardingdata.companyMasterID);
      this.getDesignationData(this.preboardingdata.companyMasterID);
      this.getPreboaringCustomizeFields();
      this.getNationalityData();
      this.getJobApplicationData(this.preboardingdata.jobApplicationID);
      this.getDesignationWiseDocumentBypreboardingID(this.preboardingdata.preboardingID);
      resolve();
    });
  }

  private moreinfo(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.spinner.start('loader');
      this.api
        .callApi(
          this.constant.GETPREBOARDINGREQUESTBYPREBOARDINGID + this.preboardingdata.preboardingID,
          {},
          'GET',
          false,
          false,
          true,
        )
        .subscribe(
          (res: any) => {
            this.morinfo = res.data;
            this.spinner.stop('loader');
            resolve();
          },
          (err) => {
            this.commonNotificationService.handleError('Something Went Wrong!');
            reject(err);
          },
        );
    });
  }

  async moreinfoModal() {
    this.getallcountry();
    this.moreinfo();
    this.showform()
      .then(() => {
        this.viewFormModal.show();
      })
      .catch((err) => {
        this.commonNotificationService.handleError(err.error.message);
      });
  }

  view(attachment) {
    window.open(this.apiURL + attachment, '_blank');
  }

  addModalClear() {
    this.viewFormModal.hide();
    this.preboardingdata = null;
    this.jobApplicationData = null;
    this.designationWiseDocumentData = [];
    this.nationalityList = [];
    this.morinfo = [];
    this.customizeFields = [];
  }
}
