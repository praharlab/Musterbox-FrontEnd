import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { NgxSignaturePadComponent } from 'src/app/components/signature-pad/ngx-signature-pad.module';
import { labelUtils } from 'src/app/constants/labelUtils';

@Component({
    selector: 'app-preboardingform',
    templateUrl: './preboardingform.component.html',
    styleUrls: ['./preboardingform.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PreboardingformComponent implements OnInit {
  @ViewChild('sign')
  signaturePadElement: NgxSignaturePadComponent;
  signatureData: string;

  allkey: string[];
  allvalue: unknown[];
  company: any;
  format: string;
  file: any;
  url: any;
  alldesignation: any;
  urls: any = [];
  base64textString: string;
  tempLabel: any;
  showForm1: boolean = false;
  allBranch: any;
  apiURL = environment.apiUrl;
  sign: { preboardingFormCustomizeID: any; value: string };
  showCountryCodeSelected: boolean = labelUtils.showCountryCodeSelected
  selectedCountryCode: any = null
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
  ) { }
  @ViewChild('addpreboarding') addpreboarding: NgForm;
  values: any = [];
  mytime: Date = new Date();
  valueshow: boolean;
  ipAddress: any;
  isdisabled = false;
  field: any = [];
  allcustomer: any;
  empList: any;
  selected: any = [];
  getallvisitpurpose: any;
  product: any;
  temp: any;
  temp1: any;
  fields1: any = [];
  company1: any;
  showForm: boolean = true;
  imgShow: boolean = false;
  companyData: any;
  countryData: any = [];

  
  ngOnInit(): void {
    this.getcustomizefield();
    this.getIPAddress();
    this.getallcountry()
    if (this.showCountryCodeSelected) {
      this.selectedCountryCode = 103 //Default Selected India for Tankhwa Patra
    }
  }
  getcustomizefield() {
    const body = {
      preboardingMasterID: this.activatedRoute.snapshot.params.id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETPREBOARDINGCUSTOMIZEBYCOMPANYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.showForm1 = true;
          this.field = res.data;
          this.companyData = res.companyData
          if (res.companyData.companyLogo) {
            this.validateCompanyLogo(res.companyData.companyLogo)
          }

          for (let i = 0; i < this.field.length; i++) {
            if (this.field[i].inputType == 'title') {
              // this.temp = this.field[i]
              // this.temp.fieldLabel = '*'

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
          this.alldesignation = res.designation;
          this.allBranch = res.branch;
          this.company1 = res.companyData;
          this.spinner.stop();
        }
      });
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
  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }


  onSubmit() {


    if (!this.addpreboarding.valid) {
      return;
    }

    if (this.urls) {
      for (const file of this.urls) {
        if (file.format !== 'image' && file.format !== 'pdf') {
          this.notifications.create(
            'Error',
            `Please upload a file in either image or PDF format for ${file.fieldLabel}.`,
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 4000,
              showProgressBar: false,
            },
          );
          return;
        } else if (file.size > 1000) {
          this.notifications.create(
            'Error',
            `The file size for ${file.fieldLabel.slice(
              0,
              70,
            )} exceeds 1 MB. Please choose a smaller file.`,
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 4000,
              showProgressBar: false,
            },
          );
          return;
        }
      }
    }

    let customfieldvalue = [];
    let allKeys = Object.keys(this.addpreboarding.value);

    let allValues = Object.values(this.addpreboarding.value);

    for (const url of this.urls) {
      if (
        !customfieldvalue.some(
          (item) => item.preboardingFormCustomizeID === url.preboardingFormCustomizeID,
        )
      ) {
        customfieldvalue.push(url);
      }
    }

    // Adding values from this.addpreboarding.value to customfieldvalue
    for (let i = 0; i < this.field.length; i++) {
      if (this.field[i].inputType === 'pdf' || this.field[i].inputType === 'image') {
        continue;
      } else if (this.field[i].inputType === 'signature') {
        if (!this.signatureData && this.field[i].isRequired) {
          return this.notifications.create(
            'Error',
            'Confirm Signature First',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
        } else if (this.signatureData) {
          customfieldvalue.push({
            preboardingFormCustomizeID: this.field.find((f) => f.inputType === 'signature')
              .preboardingFormCustomizeID,
            value: this.signatureData,
            format: 'base64 ',
            fieldLabel: 'signature',
          });
        }
      } else {
        for (let j = 0; j < allKeys.length; j++) {
          if (this.field[i].fieldLabel === allKeys[j]) {
            let storeCustomField = {
              preboardingFormCustomizeID: this.field[i].preboardingFormCustomizeID,
              value: allValues[j],
            };
            customfieldvalue.push(storeCustomField);
          }
        }

      }

    }

    let finalBody = customfieldvalue.map((item) => ({
      preboardingFormCustomizeID: item.preboardingFormCustomizeID,
      inputType: item.fieldLabel,
      value: item.value,
      createBy: localStorage.getItem('company_id'),
      createByIp: this.ipAddress,
    }));

    let body = {
      firstName: this.addpreboarding.value.firstName,
      middleName: this.addpreboarding.value.middleName,
      lastName: this.addpreboarding.value.lastName,
      userNumber: this.addpreboarding.value.userNumber,
      dob: this.addpreboarding.value.dob,
      designationID: this.addpreboarding.value.designationID,
      branchMasterID: this.addpreboarding.value.branchMasterID,
      email: this.addpreboarding.value.email,
      address: this.addpreboarding.value.address,
      preboardingstatus: 'Screening',
      companyMasterID: this.company1.companyMasterID,
      preboardingMasterID: this.activatedRoute.snapshot.params.id,
      nestedBody: finalBody,
      createBy: localStorage.getItem('user_id'),
      createByIp: this.ipAddress,
      userNumberCountryMasterID: this.addpreboarding.value.userNumberCountryMasterID
    };

    this.api.callApi(this.constant.CREATEPREBOARDING, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.addpreboarding.resetForm();
            this.showForm = false;
            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }



  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  onSelectFile(event: any, id: any, fieldLabel: any) {
    this.file = event.target.files && event.target.files[0];

    const size = event.target.files[0].size / 1024;
    if (size > 1000) {
      this.notifications.create(
        'Error',
        `The file size for ${fieldLabel.slice(0, 70)} exceeds 1 MB. Please choose a smaller file.`,
        NotificationType.Bare,
        {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        },
      );
    }

    if (this.file) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file);

      if (this.file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.file.type === 'application/pdf') {
        this.format = 'pdf';
      }

      reader.onload = (event) => {
        let url = {
          preboardingFormCustomizeID: id,
          value: (<FileReader>event.target).result,
          fieldLabel: fieldLabel,
          format: this.format,
          size: size,
        };

        let foundIndex = -1;
        this.urls.forEach((u, index) => {
          if (u.preboardingFormCustomizeID === url.preboardingFormCustomizeID) {
            foundIndex = index;
            return;
          }
        });

        if (foundIndex !== -1) {
          // If the ID is found, replace it with the new object
          this.urls[foundIndex] = url;
        } else {
          // If the ID is not found, add the new object to the array
          this.urls.push(url);
        }
      };
    }
  }

  getImage(preboardingFormCustomizeID: string) {
    const signaturePad = this.signaturePadElement.toDataURL();
    this.signatureData = signaturePad;
  }

  validateCompanyLogo(companyLogo: string) {
    const img = new Image();
    img.src = this.apiURL + 'uploads/company/logo/' + companyLogo;
    if (img.complete) {
      this.imgShow = true;
    } else {
      img.onload = () => {
        this.imgShow = true;
      };

      img.onerror = () => {
        this.imgShow = false;
      };
    }
  }
}
