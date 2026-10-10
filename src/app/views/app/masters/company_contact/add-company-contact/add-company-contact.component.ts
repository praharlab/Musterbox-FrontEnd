import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { labelUtils } from 'src/app/constants/labelUtils';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { attendanceFromType } from 'src/app/constants/commonVariables';

@Component({
    selector: 'app-add-company-contact',
    templateUrl: './add-company-contact.component.html',
    styleUrls: ['./add-company-contact.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddCompanyContactComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('adddepart') adddepart: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('adddesignation') adddesignation: NgForm;
  @ViewChild('closeModal1') closeModal1: ElementRef;

  @ViewChild('addbranch') addbranch: NgForm;

  @ViewChild('closeModal2') closeModal2: ElementRef;

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
  visitor_type1: any;
  companyid: any;
  showdepart: boolean = false;

  company: any;
  permissionBranchcreate: any = [];
  permissionDepartcreate: any = [];
  permissionDesigcreate: any = [];
  showPassword: boolean = false;
  allRoles: any = [];
  selectedRole: any;
  adminRoot = environment.adminRoot;
  selectedCompany: any;
  serialNo: any = [];
  biometricserial: any = [];
  selectedSerialNo: any[];
  formValue: any;
  attendanceFromENUM = attendanceFromType;
  attendanceFrom1: any = this.attendanceFromENUM.MOBILEANDBIOMETRIC;
  employeeType1: string = 'national';
  selectedbiometricCode: string;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  image: any;
  joiningDocumentData: any = [];
  showMyContainer: boolean = false;
  othernumberLabel: string = labelUtils.othernumberLabel;
  countryData: any = [];
  showCountryCodeSelected: boolean = labelUtils.showCountryCodeSelected;
  selectedCountryCode: any = null;

  isPihMobileNo: boolean = labelUtils.pihMobileNumber;
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
    this.getAllCompany();
    this.add();
    this.getallcountry();
    this.checkpermission();

    if (this.usertype == 2 || this.usertype == 3 || this.usertype == 4) {
      this.getAllData(this.formValue.ListCompanyContactComponent.id);
    } else {
      this.selectedCompany = Number(localStorage.getItem('company_id'));
      this.getAllData(this.selectedCompany);
    }
    if (this.showCountryCodeSelected) {
      this.selectedCountryCode = 103; //Default Selected India for SalaryPatra
    }
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
          this.country = res.data;
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

  checkpermission() {
    if (this.usertype == 0 || this.usertype == 1) {
      this.spinner.start();
      let body = {
        userMasterID: localStorage.getItem('id'),
      };
      this.api
        .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            let permission = res.data;

            this.permissionBranchcreate = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'Branch' && permissionval.operationName.includes('Create')
              );
            });
            this.permissionDepartcreate = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'Department' &&
                permissionval.operationName.includes('Create')
              );
            });
            this.permissionDesigcreate = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'Designation' &&
                permissionval.operationName.includes('Create')
              );
            });
            this.spinner.stop();
          }
        });
    } else {
      this.permissionBranchcreate = [1];
      this.permissionDepartcreate = [1];
      this.permissionDesigcreate = [1];
    }
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
          `Cug Number must be between 8 - 14 Digit`,
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
      'companyMasterID',
      this.usertype === 2 || this.usertype === 3 || this.usertype === 4
        ? this.formValue.ListCompanyContactComponent.id
        : this.addcomp.value.companyMasterID,
    );
    formData.append('password', this.addcomp.value.password);
    formData.append('email', this.addcomp.value.email);
    formData.append('status', '1');
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('admin', this.addcomp.value.isadmin !== '' ? '1' : '0');
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
    formData.append(
      'otherContactNumber',
      this.addcomp.value.othernumber ? this.addcomp.value.othernumber : '',
    );
    formData.append('attendanceFrom', this.addcomp.value.attendanceFrom);
    formData.append('employeeType', this.addcomp.value.employeeType);
    formData.append('cugNumber', this.addcomp.value.cugNumber ? this.addcomp.value.cugNumber : '');
    formData.append(
      'officalEmail',
      this.addcomp.value.officalEmail ? this.addcomp.value.officalEmail : '',
    );

    if (this.joiningDocumentData.length > 0) {
      this.joiningDocumentData.forEach((item, index) => {
        formData.append(`attachment`, item.attachment);
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

    this.spinner.start();
    this.api
      .callApi(this.constant.ADDCOMPANYCONTACTDATA, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.commonNotificationService.handleSuccess(res.message);
            setTimeout(() => {
              if (this.usertype == 2 || this.usertype == 3 || this.usertype == 4) {
                this.router.navigate([this.adminRoot + '/masters/company_contact']);
              } else {
                this.router.navigate([this.adminRoot + '/masters/employee']);
              }
              this.spinner.stop();
            }, 3000);
          } else {
            this.commonNotificationService.handleError(res.message);
          }
          this.spinner.stop();
        },
        (err) => {
          this.commonNotificationService.handleError(err);
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

    if (event == undefined) {
      this.showdepart = false;
    } else {
      this.companyid = event;
      this.showdepart = true;

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
  }

  add() {
    const filterData = {
      companyMasterID:
        this.usertype == 2 || this.usertype == 3 || this.usertype == 4
          ? this.formValue.ListCompanyContactComponent.id
          : localStorage.getItem('company_id'),
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

    if (event.target.files && event.target.files.length > 0) this.image = event.target.files[0];
    else this.image = null;

    this.joiningDocumentData[i].attachment = this.image;
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
            this.joiningDocumentData = res.data;
            if (this.joiningDocumentData && this.joiningDocumentData.length > 0) {
              this.joiningDocumentData = this.joiningDocumentData.map((e) => {
                return {
                  ...e,
                  attachment: [],
                  isChanged: 1,
                  fromDate: '',
                  issueDate: '',
                  expiryDate: '',
                  identificationNumber: '',
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
  onSubmit1() {
    if (!this.adddepart.valid) {
      return;
    }
    const filterData = {
      departmentName: this.adddepart.value.departmentID1,
      companyMasterID: this.companyid,
      status: 1,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.CREATEDEPARTMENTDATA, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);

          this.closeModal.nativeElement.click();
          this.adddepart.resetForm();
          this.getAllData(this.companyid);

          this.spinner.stop();
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop();
        }
      });
  }

  onSubmit2() {
    if (!this.adddesignation.valid) {
      return;
    }
    const filterData = {
      designationName: this.adddesignation.value.designationID1,
      companyMasterID: this.companyid,
      status: '1',
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.CREATEDESIGNATIONDATA, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);

          this.closeModal1.nativeElement.click();

          this.adddesignation.resetForm();

          this.getAllData(this.companyid);

          this.spinner.stop();
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop();
        }
      });
  }

  selectcountry(country: any) {
    if (!country) {
      return;
    }
    this.api
      .callApi(this.constant.GETSTATEBYCOUNTRY + country, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.state = res.data;
        },
        (err) => {
          console.log('error', err);
        },
      );
  }
  selectstate(state: any) {
    this.api
      .callApi(this.constant.GETCITYBYSTATE + state, {}, 'GET', false, false, false)
      .subscribe(
        (res: any) => {
          this.city = res.data;
        },
        (err) => {
          console.log('error', err);
        },
      );
  }
  selectcity(city: any) {
    this.finalcityid = city;
  }

  prev() {
    this.router.navigate([this.adminRoot + '/masters/company_contact']);
  }

  onSubmit3() {
    if (!this.addbranch.valid) {
      return;
    }

    const filterData = {
      companyMasterID: this.companyid,
      branchName: this.addbranch.value.branchName,
      branchCode: this.addbranch.value.branchCode,
      branchAddress: this.addbranch.value.branchAddress,
      cityMasterID: this.finalcityid,
      latitude: this.addbranch.value.latitude,
      longitude: this.addbranch.value.longitude,
      radius: this.addbranch.value.radius,
      gstNumber: this.addbranch.value.gstNumber,
      lwfNumber: this.addbranch.value.lwfNumber,
      professionaltaxNumber: this.addbranch.value.professionaltaxNumber,
      pfNumber: this.addbranch.value.pfNumber,
      esicNumber: this.addbranch.value.esicNumber,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.CREATEBRANCH, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);

          this.closeModal2.nativeElement.click();

          this.addbranch.resetForm();

          this.getAllData(this.companyid);

          this.spinner.stop();
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop();
        }
      });
  }
}
