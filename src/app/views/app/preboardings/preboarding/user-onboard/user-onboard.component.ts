import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { labelUtils } from 'src/app/constants/labelUtils';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { attendanceFromType } from 'src/app/constants/commonVariables';
@Component({
    selector: 'app-user-onboard',
    templateUrl: './user-onboard.component.html',
    styleUrls: ['./user-onboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UserOnboardComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  adminRoot = environment.adminRoot;
  public apiUrl = environment.apiUrl;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  usertype: any;
  company_id: any;
  product: any;
  checkdata: any = {};
  applidate = new Date().toISOString().split('T')[0];
  allbranch: any = [];
  alldepartment: any = [];
  alldesignation: any = [];

  selectedbranch: any;
  selecteddepartment: any;
  selecteddesignation: any;
  selectedbranchdate: any;
  selecteddepartmentdate: any;
  selecteddesignationdate: any;
  preboardingData: any;

  showPassword: boolean = false;
  allRoles: any;
  serialNo: any;
  biometricserial: any;
  selectedSerialNo: any[];
  selectedRole: string;

  joining_Date: any;
  selectedCompany: any;
  attendanceFromENUM = attendanceFromType;

  attendanceFrom1: string = this.attendanceFromENUM.MOBILEANDBIOMETRIC;
  selectedbiometricCode: string;

  formValue: any;
  employeeType1: string = 'national';
  image: any;
  joiningDocumentData: any = [];
  showMyContainer: boolean = false;
  othernumberLabel: string = labelUtils.othernumberLabel;
  countryData: any = [];
  isPihMobileNo: boolean = labelUtils.pihMobileNumber;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  currDate: any = new Date().toISOString().slice(0, 10);

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

    this.usertype = +localStorage.getItem('usertype');

    this.getPreboardingBYid();

    this.getAllCompany();
    this.add();
    this.getallcountry();
  }

  viewDoc(filePath: any) {
    if (!filePath) {
      alert('No document available.');
      return;
    }
    const url = filePath.startsWith('http') ? filePath : `${this.apiUrl}${filePath}`;

    window.open(url, '_blank');
  }

  getPreboardingBYid() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.PREBOARDINGGETBYID + this.formValue.HrTabComponent.id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.preboardingData = res.data;
          this.preboardingData.userNumberCountryMasterID = this.preboardingData
            .userNumberCountryMasterID
            ? +this.preboardingData.userNumberCountryMasterID
            : this.preboardingData.userNumberCountryMasterID;
          this.getAllData(this.preboardingData.companyMasterID);

          this.selectedbranchdate = this.preboardingData.joiningDate;
          this.selecteddepartmentdate = this.preboardingData.joiningDate;
          this.selecteddesignationdate = this.preboardingData.joiningDate;
          this.joining_Date = this.preboardingData.joiningDate;

          this.selectedbranch = this.preboardingData.branchMasterID;
          this.selecteddesignation = this.preboardingData.designationID;

          this.selectedCompany = this.preboardingData.companyMasterID;
          this.employeeType1 = this.preboardingData.employeeType
            ? this.preboardingData.employeeType
            : this.employeeType1;
          this.spinner.stop();
          this.getDesignationWiseDocumentType();
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

  getAllCompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.product = res.data;

          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    if (!this.isPihMobileNo) {
      if (
        this.addcomp.value.contactNumber &&
        this.addcomp.value.contactNumber.toString().length != 10 &&
        this.addcomp.value.contactNumber.toString().length != 0
      ) {
        return this.commonNotificationService.handleWarning(`Mobile Number must be of 10 Digit`);
      }

      if (
        this.addcomp.value.othernumber &&
        this.addcomp.value.othernumber.toString().length != 10 &&
        this.addcomp.value.othernumber.toString().length != 0
      ) {
        return this.commonNotificationService.handleWarning(
          `${this.othernumberLabel} must be of 10 Digit`,
        );
      }
      if (
        this.addcomp.value.cugNumber &&
        this.addcomp.value.cugNumber.toString().length != 10 &&
        this.addcomp.value.cugNumber.toString().length != 0
      ) {
        return this.commonNotificationService.handleWarning(`Cug Number must be of 10 Digit`);
      }
    }

    if (this.isPihMobileNo) {
      if (
        this.addcomp.value.contactNumber &&
        (this.addcomp.value.contactNumber.toString().length < 8 ||
          this.addcomp.value.contactNumber.toString().length > 14) &&
        this.addcomp.value.contactNumber.toString().length != 0
      ) {
        return this.commonNotificationService.handleWarning(
          `Mobile Number must be between 8 - 14 Digit`,
        );
      }
      if (
        this.addcomp.value.othernumber &&
        (this.addcomp.value.othernumber.toString().length < 8 ||
          this.addcomp.value.othernumber.toString().length > 14) &&
        this.addcomp.value.othernumber.toString().length != 0
      ) {
        return this.commonNotificationService.handleWarning(
          `${this.othernumberLabel} must be between 8 - 14 Digit`,
        );
      }
      if (
        this.addcomp.value.cugNumber &&
        (this.addcomp.value.cugNumber.toString().length < 8 ||
          this.addcomp.value.cugNumber.toString().length > 14) &&
        this.addcomp.value.cugNumber.toString().length != 0
      ) {
        return this.commonNotificationService.handleWarning(
          ` Cug Number must be between 8 - 14 Digit`,
        );
      }
    }
    const formData = new FormData();
    formData.append('firstName', this.addcomp.value.firstNAme);
    formData.append(
      'middleName',
      this.addcomp.value.middleNAme ? this.addcomp.value.middleNAme : '',
    );
    formData.append('lastName', this.addcomp.value.lastNAme);
    formData.append(
      'displayName',
      this.addcomp.value.prefix +
      ' ' +
      this.addcomp.value.firstNAme +
      ' ' +
      this.addcomp.value.middleNAme +
      ' ' +
      this.addcomp.value.lastNAme,
    );
    formData.append('gender', this.addcomp.value.gender);
    formData.append('userNumber', this.addcomp.value.contactNumber);
    formData.append(
      'otherContactNumber',
      this.addcomp.value.othernumber ? this.addcomp.value.othernumber : '',
    );
    formData.append(
      'companyMasterID',
      this.usertype === 2 ? this.formValue.HrTabComponent.id : this.addcomp.value.companyMasterID,
    );
    formData.append('password', this.addcomp.value.password);
    formData.append('email', this.addcomp.value.email);
    formData.append('status', '1');
    formData.append('admin', this.addcomp.value.isadmin !== '' ? '1' : '0');
    formData.append('preboardingID', this.formValue.HrTabComponent.id);
    formData.append('attendanceFrom', this.addcomp.value.attendanceFrom);
    formData.append('employeeType', this.addcomp.value.employeeType);
    if (this.usertype != 2) {
      formData.append('branchMasterID', this.addcomp.value.branchID);
      formData.append('applicableDatebranch', this.addcomp.value.applicablebranchDate);
      formData.append('departmentID', this.addcomp.value.departmentID);
      formData.append('applicableDatedepartment', this.addcomp.value.applicabledepDate);
      formData.append('designationID', this.addcomp.value.designationID);
      formData.append('applicableDatedesignation', this.addcomp.value.applicabledesDate);
      formData.append('roleMasterID', this.addcomp.value.role);
      formData.append('dob1', this.addcomp.value.dob);
      formData.append('joiningDate', this.addcomp.value.joiningDate);
      formData.append('biometricCode', this.addcomp.value.biometricCode);
      formData.append('biometricSerialNo', this.addcomp.value.serialno);
      formData.append('overtime', this.addcomp.value.overtime);
    }

    if (this.joiningDocumentData.length > 0) {
      this.joiningDocumentData.forEach((item, index) => {
        if (item.isChanged == 0) {
          formData.append(`attachment${index}`, item.attachment);
        } else {
          formData.append(`attachment`, item.attachment);
        }
        formData.append(`isChanged${index}`, item.isChanged);
        formData.append(`fromDate${index}`, item.fromDate);
        formData.append(`issueDate${index}`, item.issueDate);
        formData.append(`expiryDate${index}`, item.expiryDate);
        formData.append(`identificationNumber${index}`, item.identificationNumber);
        formData.append(`joiningDocumentMasterID${index}`, item.joiningDocumentMasterID);
        formData.append(`designationWiseDocumentID${index}`, item.designationWiseDocumentID);
      });
    }
    formData.append('userNumberCountryMasterID', this.addcomp.value.userNumberCountryMasterID);
    formData.append('cugNumber', this.addcomp.value.cugNumber ? this.addcomp.value.cugNumber : '');
    formData.append(
      'officalEmail',
      this.addcomp.value.officalEmail ? this.addcomp.value.officalEmail : '',
    );
    this.spinner.start();
    this.api
      .callApi(this.constant.ADDCOMPANYCONTACTDATA, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            if (this.usertype != 2) {
              //onboard
              const body4 = {
                preboardingID: this.formValue.HrTabComponent.id,
              };
              this.api
                .callApi(
                  this.constant.PREBOARDING_ONBOARD_STATUSCHANGE,
                  body4,
                  'POST',
                  true,
                  false,
                  true,
                )
                .subscribe((res: any) => {
                  if (res.status == 200) {
                  }
                });
            }
            this.commonNotificationService.handleSuccess(res.message);
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/preboardings/hr_preboarding']);
              this.spinner.stop();
            }, 3000);
          } else {
            this.commonNotificationService.handleError(res.message);
          }
          this.spinner.stop();
        },
        (err) => {
          this.commonNotificationService.handleSuccess(err);
        },
      );
  }

  getAllData(event) {
    this.allbranch = [];
    this.alldepartment = [];
    this.alldesignation = [];
    this.allRoles = [];
    this.biometricserial = [];

    this.selectedSerialNo = [];
    this.selectedbranch = '';
    this.selecteddepartment = '';
    this.selecteddesignation = '';
    this.selectedRole = '';

    this.selectedbranchdate = '';
    this.selecteddepartmentdate = '';
    this.selecteddesignationdate = '';
    this.selectedbiometricCode = '';

    if (!event) return;

    // if (!event) {
    //   event = localStorage.getItem("company_id");
    // }
    this.api
      .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldepartment = res.data;
          this.spinner.stop();
        }
      });

    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
      });

    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;

          this.spinner.stop();
        }
      });

    let body = {
      companyMasterID: event,
    };
    this.spinner.start('allroles');
    this.api
      .callApi(this.constant.LISTROLEMASTER, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allRoles = res.data;
        }
        this.spinner.stop('allroles');
      });

    const body1 = {
      companyMasterID: event,
    };

    this.spinner.start('getsr');
    this.api
      .callApi(this.constant.GETTABLEANDDB, body1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.serialNo = res.data;
          if (this.serialNo) {
            if (this.serialNo.biometricSerialNo.length > 0) {
              this.biometricserial = this.serialNo.biometricSerialNo;
            } else {
              this.biometricserial = [];
            }
          } else {
            this.biometricserial = [];
          }
          this.spinner.stop('getsr');
        }
      });
  }

  add() {
    const filterData = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETCHECKUSERLIMIT, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.checkdata = res.data;

          this.spinner.stop();
        }
      });
  }

  onAttendanceChange(event) {
    if (
      this.attendanceFrom1 == this.attendanceFromENUM.MOBILE ||
      this.attendanceFrom1 == this.attendanceFromENUM.TPMIRROR ||
      this.attendanceFromENUM.MOBILEANDTPMIRROR
    ) {
      this.selectedSerialNo = [];
      this.selectedbiometricCode = '';
    }
  }

  onFileChange(event: any, i) {
    this.image = null;
    if (event.target.files && event.target.files.length > 0) {
      this.image = event.target.files[0];
    } else {
      this.image = null;
    }

    this.joiningDocumentData[i].attachment = this.image;
    this.joiningDocumentData[i].isChanged = 1;
  }

  getDesignationWiseDocumentType() {
    this.showMyContainer = false;
    this.joiningDocumentData = [];
    if (!this.selecteddesignation) {
      return;
    }
    let queryString = `?designationId=${this.selecteddesignation}&requiredUserType=${this.employeeType1 == 'national' ? '1' : '2'
      }`;

    this.spinner.start('company');
    this.api
      .callApi(
        this.constant.GETDOCUMENTBYDESIGNATIONIDANDREQUIREDUSERTYPE + queryString,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            const prebordingDocs = this.preboardingData.prebordingDocuments;
            this.joiningDocumentData = res.data;
            if (this.joiningDocumentData && this.joiningDocumentData.length > 0) {
              this.joiningDocumentData = this.joiningDocumentData.map((e) => {
                const match = prebordingDocs.find(
                  (doc) => doc.designationWiseDocumentID === e.designationWiseDocumentID,
                );
                return {
                  ...e,
                  attachment: match?.attachment || [],
                  isChanged: 0,
                  fromDate: match?.fromDate || '',
                  issueDate: match?.issueDate || '',
                  expiryDate: match?.expiryDate || '',
                  identificationNumber: match?.identificationNumber || '',
                };
              });
              this.showMyContainer = true;
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

  isAttachmentArray(item: any): boolean {
    return Array.isArray(item.attachment);
  }

  hasSingleAttachment(item: any): boolean {
    return this.isAttachmentArray(item) && item.attachment.length === 1;
  }

  shouldShowInput(item: any): boolean {
    return !this.isAttachmentArray(item) || item.attachment.length === 0;
  }
}
