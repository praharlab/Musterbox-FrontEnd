import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { environment } from 'src/environments/environment';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { labelUtils } from '../../../../../constants/labelUtils';
import { NationalityListService } from 'src/app/services/nationality-list.service';
import { attendanceFromType } from 'src/app/constants/commonVariables';
@Component({
    selector: 'app-employee-joining',
    templateUrl: './employee-joining.component.html',
    styleUrls: ['./employee-joining.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeJoiningComponent implements OnInit {
  @ViewChild('joiningfrm') joiningfrm: NgForm;
  @Input() pattern: string;
  apiURL = environment.apiUrl;
  dropdownSettings = {};
  singledropdownSettings = {};
  ipAddress: any;
  usertype: any;
  bankdata: any;
  joiningdata: any;
  updateflag: any;
  values: any;
  serialNo: any = [];
  selectedBiometric: any = [];
  biometricserial: any;
  user_company: any;
  rows: any;
  TotalCOUNT: any;
  temp: any[];
  final_date: string;
  todaydate: string;
  file: any;
  format: string;
  url: string | ArrayBuffer;
  file1: any;
  format1: string;
  url1: string | ArrayBuffer;
  userName: any;
  formValue: any;
  employeeCodeType: any;
  esicEndMonthData: string;
  attendanceFrom1: string;
  fullMonthPresence: any;
  selectedbiometricCode: string;
  selectedSerialNo: any = [];
  isendDateRequired: boolean = false;
  employeeType1: string;
  pf_Number: string = labelUtils.pfNumber;
  pfJoiningDate: string = labelUtils.pfJoiningDate;
  pfBank: string = labelUtils.pfBank;
  pfBankIFSCCode: string = labelUtils.pfBankIFSCCode;
  pfBankAccountNumber: string = labelUtils.pfBankAccountNumber;

  esic_Number: string = labelUtils.esicNumber;
  esicJoiningDate: string = labelUtils.esicJoiningDate;
  esicEnd_Month: string = labelUtils.esicEndMonth;

  aadharCardNumber: string = labelUtils.aadharCardNumber;
  nameOnAadhar: string = labelUtils.nameOnAadhar;
  viewAadhar: string = labelUtils.viewAadhar;
  showBankBranch: boolean = labelUtils.showBankBranch;

  bankIfscCodeLabel: string = labelUtils.bankIfscCodeLabel;
  salaryCalculation_Act: string = labelUtils.salaryCalculationAct;
  allBankBranch: any = [];
  selectedBankBranch: any;
  selectedBankBranchData: any;

  nationalityList: any[] = [];
  showUanNumber: boolean = labelUtils.showUanNumber;
  showpfbankAccountNo: boolean = labelUtils.showpfbankAccountNo;
  showPanCard: boolean = labelUtils.showPanCard;
  showpfbankMasterID: boolean = labelUtils.showpfbankMasterID;
  showpfbankIFSC: boolean = labelUtils.showpfbankIFSC;
  showesicEndMonth: boolean = labelUtils.showesicEndMonth;
  confirmLabel: any = labelUtils.confirmLabel;
  contractorData: any;
  shopActLabel: any = labelUtils.shopActLabel;
  factoryAct: any = labelUtils.factoryActLabel;
  skillCategory: any;
  currentSkillCategory: any;
  disabledFlag: boolean = false;
  employmentTypes: string[] = labelUtils.EmployementType;
  isFNF: boolean = false;
  payrollFrequencyType = labelUtils.payrollFrequencyType;
  payroll_Frequency = 'Monthly';
  showPayrollFrequencyData: boolean = labelUtils.showPayrollFrequency;
  attendanceFromENUM = attendanceFromType;
  validateAadharNumber: boolean = labelUtils.validateAadharNumber;
  validatePanNumber: boolean = labelUtils.validatePanNumber;
  constructor(
    private spinner: NgxUiLoaderService,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private datepipe: DatePipe,
    private profileStatusService: ProfileStatusService,
    private formValueStorageService: FormValueStorageService,
    private nationalityListService: NationalityListService,
  ) {}
  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.getIPAddress();
    this.getData();
    this.getBankData();
    this.usertype = localStorage.getItem('usertype');
    this.profileStatusService.refreshProfileStatus();

    this.nationalityListService.fetchNationality().subscribe((res) => {
      this.nationalityList = res;
    });
    this.spinner.start('init');
    this.api
      .callApi(
        this.constant.VIEWCOMPANYCONTACTDATA + this.formValue.ListEmployeeMasterComponent.id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.userName = res.data.displayName;
          this.user_company = Number(res.data.companyMasterId);
          this.isFNF = res.data?.isFNF ? true : false;
          this.getSerialNo(this.user_company);
          this.spinner.stop('init');
        }
      });

    var date1 = new Date();

    date1.setDate(0);

    this.final_date = date1.getFullYear() + '-' + String(date1.getMonth() + 1).padStart(2, '0');

    this.todaydate = new Date().toISOString().slice(0, 10);
  }

  getData() {
    let userid = this.formValue.ListEmployeeMasterComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.GETEMPJOININGDATA + '/' + userid, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.joiningdata = res.data;
          this.skillCategory = res.skillCategory;
          this.currentSkillCategory = res.currentSkillCategory;
          this.disabledFlag = res.disable;
          this.esicEndMonthData =
            this.joiningdata && this.joiningdata.esicEndMonth
              ? String(this.joiningdata.esicEndMonth).slice(0, 4) +
                '-' +
                String(this.joiningdata.esicEndMonth).slice(4, 6)
              : null;
          this.updateflag = res.data;
          this.employeeCodeType = this.joiningdata.userMaster.companyMaster.employeeCodeType;
          this.attendanceFrom1 = this.joiningdata.attendanceFrom;
          this.employeeType1 = this.joiningdata.employeeType;
          this.fullMonthPresence = this.joiningdata.fullMonthPresence.toString();
          this.selectedbiometricCode = this.joiningdata.biometricCode;
          this.payroll_Frequency = this.joiningdata.payrollFrequency;
          if (this.joiningdata.employment == 'Probation') {
            this.isendDateRequired = true;
          }
          if (this.joiningdata.employment == 'Contract') {
            this.getContractorData();
          }
          if (this.joiningdata == undefined) {
            this.updateflag = null;
            this.joiningdata = {};
          } else {
            this.userName = this.joiningdata.adharName;
            this.values = this.joiningdata.overtime.toString();

            let temp = '';
            if (this.joiningdata.biometricSerialNo) {
              // this.attendanceFrom1 = 'true';
              for (var i = 0; i < this.joiningdata.biometricSerialNo.length; i++) {
                if (this.joiningdata.biometricSerialNo[i] == ',') {
                  this.selectedBiometric.push(temp);
                  this.selectedSerialNo.push(temp);
                  temp = '';
                } else {
                  temp = temp + this.joiningdata.biometricSerialNo[i];
                }
              }
            }
            // else {
            //   this.attendanceFrom1 = 'false';
            // }

            if (temp != '') {
              this.selectedBiometric.push(temp);
              this.selectedSerialNo.push(temp);
            }
            this.user_company = res.data.userMaster.companyMasterId;
          }
          if (this.showBankBranch) {
            this.getBankBranchData(this.joiningdata.bankMasterID);
            this.selectedBankBranch = this.joiningdata.bankBranchID;
          }
          this.spinner.stop();
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
        },
      );

    this.api
      .callApi(this.constant.GETempEMPLOYEEMENTBYUSERID + userid, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.TotalCOUNT = res.totalcount;
          this.spinner.stop();
        }
      });
  }

  getSerialNo(id: any) {
    const body = {
      companyMasterID: id,
    };

    this.spinner.start('getsr');
    this.api
      .callApi(this.constant.GETTABLEANDDB, body, 'POST', true, false, true)
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

  changeDate() {
    var dd = new Date(this.joiningfrm.value.dob);

    if (this.joiningfrm.value.retirementAge != undefined) {
      dd.setFullYear(
        new Date(this.joiningfrm.value.dob).getFullYear() + this.joiningfrm.value.retirementAge,
      );
      let newyear = this.datepipe.transform(dd, 'yyyy-MM-dd');
      this.joiningdata.retirementDate = newyear;
      this.joiningfrm.value.retirementDate = newyear;
    }
  }

  getBankData() {
    this.spinner.start();
    let filter = { page: '', limit: '' };
    this.api.callApi(this.constant.GETBANKDATA, filter, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.bankdata = res.data;
        this.spinner.stop();
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
      },
    );
  }
  getBankBranchData(item) {
    const filterData = { bankMasterID: item, status: 1 };
    this.spinner.start();
    this.api
      .callApi(this.constant.LISTBANKBRANCH, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allBankBranch = res.data;
          this.spinner.stop();
        }
      });
  }
  onChangeBankBranchData(item) {
    this.selectedBankBranch = null;
    this.joiningdata.bankBranchID = null;
    this.joiningdata.bankIFSC = null;
    this.allBankBranch = [];

    const filterData = { bankMasterID: item, status: 1 };
    this.spinner.start();
    this.api
      .callApi(this.constant.LISTBANKBRANCH, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allBankBranch = res.data;
          this.spinner.stop();
        }
      });
  }
  onBankBranchChange(item) {
    this.joiningdata.bankIFSC = null;
    if (item) {
      this.selectedBankBranchData = this.allBankBranch.find(
        (branch) => branch.bankBranchID == item,
      );
      this.joiningdata.bankIFSC = this.selectedBankBranchData.bankBranchCode;
    }
  }

  dropboxChips() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 6,
      allowSearchFilter: true,
    };
    this.singledropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      itemsShowLimit: 6,
      allowSearchFilter: true,
    };
  }

  onSelectFile(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    if (
      ext.toLowerCase() != 'png' &&
      ext.toLowerCase() != 'jpg' &&
      ext.toLowerCase() != 'jpeg' &&
      ext.toLowerCase() != 'pdf'
    ) {
      // this.toastr.error('Selected file format is not supported!!', 'Success!',{timeOut:3000});
    } else {
      this.file = event.target.files && event.target.files[0];
      if (this.file) {
        var reader = new FileReader();
        reader.readAsDataURL(this.file);
        if (this.file.type.indexOf('image') > -1) {
          this.format = 'image';
        } else if (this.file.type.indexOf('video') > -1) {
          this.format = 'video';
        } else if (this.file.type.indexOf('pdf') > -1) {
          this.format = 'pdf';
        }
        reader.onload = (event) => {
          this.url = (<FileReader>event.target).result;
        };
      }
    }
  }

  onSelectFile1(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    if (
      ext.toLowerCase() != 'png' &&
      ext.toLowerCase() != 'jpg' &&
      ext.toLowerCase() != 'jpeg' &&
      ext.toLowerCase() != 'pdf'
    ) {
      // this.toastr.error('Selected file format is not supported!!', 'Success!',{timeOut:3000});
    } else {
      this.file1 = event.target.files && event.target.files[0];
      if (this.file1) {
        var reader = new FileReader();
        reader.readAsDataURL(this.file1);
        if (this.file1.type.indexOf('image') > -1) {
          this.format1 = 'image';
        } else if (this.file1.type.indexOf('video') > -1) {
          this.format1 = 'video';
        } else if (this.file1.type.indexOf('pdf') > -1) {
          this.format1 = 'pdf';
        }
        reader.onload = (event) => {
          this.url1 = (<FileReader>event.target).result;
        };
      }
    }
  }

  onSubmit() {
    if (
      !this.joiningfrm.valid ||
      this.adharNumberError ||
      this.panCardError ||
      this.ifscError ||
      this.pfNumberError ||
      this.ifscError1 ||
      this.UANNumberError
    ) {
      return;
    }

    let bio = '';
    if (this.joiningfrm.value.serialno) {
      for (var i = 0; i < this.joiningfrm.value.serialno.length; i++) {
        bio = bio + ',' + this.joiningfrm.value.serialno[i];
      }
      if (bio.length > 1) {
        bio = bio.slice(1);
      }
    }

    let adharphoto: any;
    if (this.joiningdata) {
      if (this.joiningdata.adharPhoto == '') {
        adharphoto == '';
      }
    }

    const formData = new FormData();

    formData.append('userMasterID', this.formValue.ListEmployeeMasterComponent.id);
    formData.append('employeeCode', this.joiningfrm.value.employeeCode);
    formData.append('AccountMasterId', '0');
    formData.append('dob', this.joiningfrm.value.dob);
    formData.append('joiningDate', this.joiningfrm.value.joiningDate);
    formData.append('leavingDate', this.joiningdata.leavingDate);
    formData.append('noticePeriod', this.joiningfrm.value.noticeperiod);
    formData.append('applicableDate', this.joiningfrm.value.appliDate);
    formData.append('endDate', this.joiningfrm.value.endDate);

    formData.append('pfjoiningDate', this.joiningfrm.value.pfjoiningDate);
    formData.append('esicjoiningDate', this.joiningfrm.value.esicjoiningDate);
    formData.append('bloodgroup', this.joiningfrm.value.bloodgroup);
    formData.append('nationality', this.joiningfrm.value.nationality);
    formData.append('esicNumber', this.joiningfrm.value.esicNumber);

    formData.append('pfNumber', this.joiningfrm.value.pfNumber);

    formData.append('bankMasterID', this.joiningfrm.value.bankMasterID);
    formData.append('bankIFSC', this.joiningfrm.value.bankIFSC);
    formData.append('bankAccountNo', this.joiningfrm.value.bankAccountNo);
    formData.append(
      'retirementAge',
      this.joiningfrm.value.retirementAge ? this.joiningfrm.value.retirementAge : null,
    );
    formData.append('retirementDate', this.joiningfrm.value.retirementDate);
    formData.append('biometricCode', this.joiningfrm.value.biometricCode);
    formData.append('biometricSerialNo', bio);
    formData.append('salaryCalculationAct', this.joiningfrm.value.salaryCalculationAct);
    formData.append('overtime', this.joiningfrm.value.overtime);
    formData.append('salarytype', this.joiningfrm.value.salarytype);
    formData.append('employment', this.joiningfrm.value.employment);
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);
    formData.append('attendanceFrom', this.joiningfrm.value.attendanceFrom);
    formData.append('fullMonthPresence', this.joiningfrm.value.fullPresence);
    formData.append('nameAsBank', this.joiningfrm.value.nameAsBank);
    formData.append('adharCard', this.joiningfrm.value.adharCard);
    formData.append('adharName', this.joiningfrm.value.adharName);
    formData.append('pancard', this.joiningfrm.value.pancard);
    if (!this.disabledFlag) {
      formData.append('skillCategory', this.skillCategory);
    }

    if (this.showBankBranch) {
      formData.append('bankBranchID', this.joiningfrm.value.bankBranchID);
    }
    if (this.showUanNumber) {
      formData.append('uanNumber', this.joiningfrm.value.uanNumber);
    }
    if (this.showpfbankAccountNo) {
      formData.append('pfbankAccountNo', this.joiningfrm.value.pfbankAccountNo);
    }
    if (this.showpfbankMasterID) {
      formData.append('pfbankMasterID', this.joiningfrm.value.pfbankMasterID);
    }
    if (this.showpfbankIFSC) {
      formData.append('pfbankIFSC', this.joiningfrm.value.pfbankIFSC);
    }
    if (this.showesicEndMonth) {
      formData.append(
        'esicEndMonth',
        this.joiningfrm.value.esicEndMonth
          ? this.joiningfrm.value.esicEndMonth.replace('-', '')
          : null,
      );
    }
    if (this.joiningdata.employment == 'Contract') {
      formData.append('contractorId', this.joiningfrm.value.contractorId);
    }

    formData.append('payrollFrequency', this.payroll_Frequency);

    this.spinner.start();
    this.api.callApi(this.constant.CREATEJOININGDATA, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          this.getData();
          this.spinner.stop();
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

  changeEmp(event) {
    this.joiningdata.applicableDate = '';
    this.joiningdata.endDate = '';
    if (event == 'Probation') {
      this.isendDateRequired = true;
    } else {
      this.isendDateRequired = false;
    }
    if (event == 'Contract') {
      this.getContractorData();
    }
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  alertConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          employeeEmployeementId: id,
          userMasterID: this.formValue.ListEmployeeMasterComponent.id,
        };
        this.spinner.start('delete');
        this.api
          .callApi(this.constant.DELETEempEMPLOYEEMENT, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.ngOnInit();
                this.spinner.stop('delete');
              } else {
                this.notifications.create('Error', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.spinner.stop('delete');
              }
            },
            (err) => {
              this.notifications.create('Error', err.error.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop();
            },
          );
      }
    });
  }

  numberError: boolean = false;

  preventNumber(event: KeyboardEvent): void {
    const key = event.key;
    if (key && /[0-9]/.test(key)) {
      // Prevent number from being typed
      event.preventDefault();
      // alert("number is not valid");
      this.numberError = true;
    } else {
      this.numberError = false;
    }
  }

  adharNumberError: boolean = false;

  validateadharNumber(adharcard: string): void {
    if (!this.validateAadharNumber) this.adharNumberError = false;
    const pattern = /^\d{12}$/;
    if (adharcard != null && adharcard != '') {
      if (!pattern.test(adharcard)) {
        this.adharNumberError = true;
      } else {
        this.adharNumberError = false;
      }
    } else {
      this.adharNumberError = false;
    }
  }

  panCardError: boolean = false;

  validatePanCardNumber(pancard: string): void {
    if (!this.validatePanNumber) this.panCardError = false;

    const pattern = /^[A-Z]{5}\d{4}[A-Z]{1}$/;
    if (pancard != null && pancard != '') {
      if (!pattern.test(pancard)) {
        this.panCardError = true;
      } else {
        this.panCardError = false;
      }
    } else {
      this.panCardError = false;
    }
  }

  pfNumberError: boolean = false;

  validatePFNumber(pfNumber: string): void {
    const pattern =
      /^[A-Z]{2}[\\s\\/]?[A-Z]{3}[\\s\\/]?[0-9]{7}[\\s\\/]?[0-9]{3}[\\s\\/]?[0-9]{7}$/;

    if (pfNumber != null && pfNumber != '') {
      if (!pattern.test(pfNumber)) {
        this.pfNumberError = true;
      } else {
        this.pfNumberError = false;
      }
    } else {
      this.pfNumberError = false;
    }
  }

  ifscError: boolean = false;

  validateIfscCode(ifsc: string): void {
    const pattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;

    if (ifsc != null && ifsc != '') {
      if (!pattern.test(ifsc)) {
        this.ifscError = true;
      } else {
        this.ifscError = false;
      }
    } else {
      this.ifscError = false;
    }
  }

  ifscError1: boolean = false;

  validateIfscCode1(ifsc: string): void {
    const pattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;

    if (ifsc != null && ifsc != '') {
      if (!pattern.test(ifsc)) {
        this.ifscError1 = true;
      } else {
        this.ifscError1 = false;
      }
    } else {
      this.ifscError1 = false;
    }
  }

  UANNumberError: boolean = false;

  validateUAN(uan: string): void {
    const pattern = /^[0-9]{12}$/;

    if (uan != null && uan != '') {
      if (!pattern.test(uan)) {
        this.UANNumberError = true;
      } else {
        this.UANNumberError = false;
      }
    } else {
      this.UANNumberError = false;
    }
  }
  view(doc: any) {
    window.open(this.apiURL + 'uploads/user/document/' + doc, '_blank');
  }

  getContractorData() {
    let string = `?&companyMasterID=${this.formValue.ListEmployeeMasterComponent.body.companyMasterID}`;

    this.spinner.start('getData');
    this.api.callApi(this.constant.GETALLDATA + string, {}, 'GET', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.contractorData = res.data;
        }
        this.spinner.stop('getData');
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('getData');
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
