import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { labelUtils } from 'src/app/constants/labelUtils';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-view-preboarding-common',
    templateUrl: './view-preboarding-common.component.html',
    styleUrls: ['./view-preboarding-common.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViewPreboardingCommonComponent implements OnInit {
  @ViewChild('lgModal') lgModal: ModalDirective;

  fields1: any = [];
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

  showCountryCodeSelected: boolean = labelUtils.showCountryCodeSelected;
  selectedCountryCode: any = null;
  defaultNationality: any;
  deafultEmployeeType: any;

  temp: any;
  temp1: any;
  field: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
  ) {}

  ngOnInit(): void {
    if (this.showCountryCodeSelected) {
      this.selectedCountryCode = 103; //Default Selected India for SalaryPatra
      this.defaultNationality = 'Indian';
      this.deafultEmployeeType = 'national';
    }
  }

  openModal() {
    this.lgModal.show();
  }

  closeModal() {
    this.lgModal.hide();
  }

  getinputType(type, i) {
    if (type == this.numberTypeLabel) {
      return this.numberTypeLabel;
    } else if (type == this.imageTypeLabel || type == this.pdfTypeLabel) {
      return 'file';
    } else if (this.textTypeLabel) {
      return this.textTypeLabel;
    } else if (type == this.radioTypeLabel) {
      return this.radioTypeLabel;
    }
  }

  getcustomizefield(id: any) {
    return new Promise((resolve, reject) => {
      this.fields1 = [];
      const body = {
        preboardingMasterID: id,
      };
      this.spinner.start('customFields');
      this.api
        .callApi(this.constant.GETPREBOARDINGCUSTOMIZEBYCOMPANYID, body, 'POST', true, false, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.field = res.data;

              for (let i = 0; i < this.field.length; i++) {
                if (this.field[i].inputType == 'title') {
                  if (this.fields1.length % 2 == 0) {
                    this.temp = {
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
                    this.fields1.push(this.field[i]);
                    this.fields1.push(this.temp);
                  } else {
                    this.temp = {
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
                    this.fields1.push(this.temp);
                    this.fields1.push(this.field[i]);
                    this.fields1.push(this.temp1);
                  }
                } else {
                  this.fields1.push(this.field[i]);
                }
              }
              resolve(this.fields1);
              this.spinner.stop('customFields');
            } else {
              reject();
            }
          },
          (error) => {
            reject(error);
          },
        );
    });
  }
}
