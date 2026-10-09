import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';

@Component({
    selector: 'app-add-grade',
    templateUrl: './add-grade.component.html',
    styleUrls: ['./add-grade.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddGradeComponent implements OnInit {
  @ViewChild('addgrade') addgrade: NgForm;
  ipAddress: any;
  company: any = [];
  company_id: any;
  salaryFieldId1: any = '';
  fieldDefaultPer: any = '';
  fieldFixAmount1: any = '';
  salaryFieldName: any = '';
  gradeSalaryArry: any = [];
  payhead: any;
  buttonDisabled = true;
  buttonState = '';
  childcompany: string;
  addper: any = 0;
  payeddata: any;
  remainigper: number = 100;
  textcolor: boolean = false;
  pdata: any;
  effecteddata: any;
  effectedPayHead: any[];
  formula1: any = '';
  calculation_on: any;
  todisplay: any = '';
  tostore: any = '';
  effpayhead: any[];
  index: number = 0;
  buttonValue: number = 0;
  calculatonType: string;
  salaryFieldMaxRange1: any;
  toamount: any;
  salaryfieldsrNo: any;
  effpayhead1: any[];
  ivalue: any;
  adminRoot = environment.adminRoot;
  payheadMasterId: any;
  isContractorGrade: boolean = false;
  allContractor: any[] = [];
  selectedContractor: any;
  selectedCompany: any;
  selectedSalaryOption: any;
  AllsalaryOptions: any[] = [
    { value: 'M', label: 'Month Wise' },
    { value: 'D', label: 'Day Wise' },
    { value: 'H', label: 'Hour Wise' },
  ];
  salaryOptions: any[] = [];
  AllcalculatonTypes: any[] = [
    { value: 'F', label: 'Fixed' },
    { value: 'FO', label: 'Formula' },
  ];
  calculatonTypes: any[] = [];
  formValue: any;

  selectedMonth: string;
  finalPayheads: any[];

  gradedata = {
    applicableYYYYMM: null,
    baseOnCalculation: '',
    companyMasterID: null,
    contractorId: null,
    gradeFrom: null,
    gradeStructureID: null,
    gradeTo: null,
    isContractorGrade: false,
    skillCategory: null,
  };

  formulaPreference: string;
  calculatorFlag: boolean = false;
  formulaListData: any[] = [];
  calculatorFlag1: boolean = false;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.childcompany = localStorage.getItem('childcompany');
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.salaryOptions = [...this.AllsalaryOptions];
    this.calculatonTypes = [...this.AllcalculatonTypes];
    this.addFormulaList();

    if (this.formValue && this.formValue.grade_cloneData && this.formValue.grade_cloneData.id) {
      this.editdata();
    }
  }

  addFormulaList() {
    this.formulaListData.push({
      calculationType: '',
      fixAmount: null,
      formula: '',
      editbuttonFlag: false,
    });
  }

  addFormula() {
    this.formulaListData[0].editbuttonFlag = true;
    this.calculatorFlag = false;
    this.calculatorFlag1 = false;
    this.formulaPreference = null;
    if (this.formulaListData.length < 2) {
      this.addFormulaList();
    }
  }

  removeFormula() {
    this.calculatorFlag = false;
    this.calculatorFlag1 = false;
    this.formulaPreference = null;
    this.formulaListData[0].editbuttonFlag = false;
    if (this.formulaListData[0].calculationType == 'FO') this.calculatorFlag = true;
    this.formulaListData.pop();
  }

  editFormula(index: number) {
    this.calculatorFlag = false;
    this.calculatorFlag1 = false;

    this.formulaListData[index].editbuttonFlag = false;
    if (index == 0) {
      this.formulaListData[index + 1].editbuttonFlag = true;
      if (this.formulaListData[index].calculationType == 'FO') this.calculatorFlag = true;
    }

    if (index == 1) {
      this.formulaListData[index - 1].editbuttonFlag = true;
      if (this.formulaListData[index].calculationType == 'FO') this.calculatorFlag1 = true;
    }
  }

  selectCalType(index: number) {
    this.calculatorFlag = false;
    this.calculatorFlag1 = false;

    if (index == 0) {
      this.calculatorFlag = this.formulaListData[0].calculationType == 'FO' ? true : false;
    }

    if (index == 1) {
      this.calculatorFlag1 = this.formulaListData[1].calculationType == 'FO' ? true : false;
    }
  }

  editdata() {
    let gradeid = this.formValue.grade_cloneData.id;
    this.spinner.start('getData');
    this.api.callApi(this.constant.VIEWGrade + gradeid, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        this.gradedata = res.data;
        var childData = res.data.gradeSalaryStructures || [];

        childData = childData.sort((a, b) => {
          return a.salaryfieldindex - b.salaryfieldindex;
        });

        // ----------------set data ----------------

        this.selectedCompany = this.gradedata.companyMasterID;
        this.selectedContractor = this.gradedata.contractorId ? +this.gradedata.contractorId : null;
        this.isContractorGrade = this.gradedata.isContractorGrade;
        this.selectedMonth =
          String(this.gradedata.applicableYYYYMM).slice(0, 4) +
          '-' +
          String(this.gradedata.applicableYYYYMM).slice(4, 6);
        this.selectedSalaryOption = this.gradedata.baseOnCalculation;
        // set button enable
        this.buttonDisabled = false;

        this.getContractor('0');

        const body1 = {
          page: '',
          limit: '',
          companyMasterID: this.gradedata.companyMasterID,
        };
        this.api
          .callApi(this.constant.GETCOMPANYPAYHEAD, body1, 'POST', true, false, true)
          .subscribe((res: any) => {
            if (res.status == 200) {
              var pdata = [];
              res.data.forEach((element) => {
                pdata.push(element);
              });

              this.finalPayheads = pdata.filter(
                (s) =>
                  ![9, 16, 17, 24, 34, 43, 78, 83, 96, 97, 67, 101].includes(s.payheadMasterId),
              );

              this.effpayhead = this.finalPayheads;
            }
          });

        let body = {
          page: '',
          limit: '',
          companyMasterID: this.gradedata.companyMasterID,
        };

        this.api
          .callApi(this.constant.GETGRADEFORDRPDOWN, body, 'POST', true, false, true)
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.payhead = res.data;
              childData.forEach((element) => {
                var payeddata = this.payhead.filter(
                  (p) => p.salaryFieldID == element.salaryFieldID,
                );

                this.gradeSalaryArry.push({
                  gradeSalaryStructureID: element.gradeSalaryStructureID,
                  salaryFieldId: element.salaryFieldID,
                  salayFieldName: element.hrSalaryField.Payheadmaster.payheadName,
                  fieldFixAmount: element.fieldFixAmount,
                  formula: element.formula,
                  fieldFixAmount1: element.fieldFixAmount1,
                  formula1: element.formula1,
                  formulaID: element.formulaID,
                  salaryFieldSrNo: element.hrSalaryField.salaryFieldSrNo,
                  salaryfieldindex: element.salaryfieldindex,
                  salaryfieldmaxrange: element.salaryfieldmaxrange,
                  payheadMasterId: element.hrSalaryField.payheadMasterId,
                  formulaPreference: element.formulaPreference,
                });

                payeddata = payeddata[0];
              });
              this.spinner.stop();
            }
          });

        this.spinner.stop('getData');
      },
      (err) => {
        this.spinner.stop('getData');
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

  changeEvent() {
    // Empty all data from array
    this.gradeSalaryArry = [];
    this.formulaListData = [];
    this.addFormulaList();
  }

  getContractor(flag: String) {
    this.allContractor = [];

    if (flag == '1') this.selectedContractor = null;

    if (this.isContractorGrade && this.selectedCompany) {
      this.spinner.start('contractor');
      this.api
        .callApi(
          this.constant.GETALLDATA + `?companyMasterID=${this.selectedCompany}`,
          {},
          'GET',
          true,
          false,
          true,
        )
        .subscribe((res: any) => {
          this.allContractor = res.data;
          this.spinner.stop('contractor');
        });
    }
  }

  changePayhead(e) {
    this.payhead = [];
    this.selectedCompany = e;

    if (!e) return;

    let body = {
      companyMasterID: e,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETGRADEFORDRPDOWN, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.payhead = res.data;
          this.spinner.stop();
        }
      });
  }

  changeSalary(e) {
    const body = {
      page: '',
      limit: '',
      companyMasterID: this.addgrade.value.companyMasterID,
    };
    this.api
      .callApi(this.constant.GETCOMPANYPAYHEAD, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          var pdata = [];
          res.data.forEach((element) => {
            pdata.push(element);
          });
          this.effpayhead = pdata;

          this.effpayhead1 = this.effpayhead.filter((s) => {
            return (
              s.salaryFieldID != e &&
              ![9, 16, 17, 24, 34, 43, 78, 83, 96, 97, 67, 101].includes(s.payheadMasterId)
            );
          });
        }
      });

    const chekfilter = this.gradeSalaryArry.filter((g) => g.salaryFieldId == e);

    if (chekfilter.length == 0) {
      var peydata = this.payhead.filter((p) => p.salaryFieldID == e);
      // for only if contractor grade and payhead BASIC, DA, HRA dont show formula

      this.calculatonTypes =
        this.isContractorGrade && [2, 35, 3].includes(peydata[0].payheadMasterId)
          ? this.AllcalculatonTypes.filter((c) => c.value != 'FO')
          : [...this.AllcalculatonTypes];

      if (peydata[0].Payheadmaster.payheadName == 'P.TAX') {
        const body = {
          companyMasterID: this.company_id,
          maxamount: this.addgrade.value.gradeTo,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.getptvaluebycompanystate, body, 'POST', true, false, true)
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.pdata = res.data;

              this.payeddata = peydata[0];
              this.salaryFieldName = this.payeddata.Payheadmaster.payheadName;
              this.payheadMasterId = this.payeddata.payheadMasterId;
              this.formulaListData[0].fixAmount == this.pdata?.maleTax || 0;

              this.spinner.stop();
            }
          });
      } else {
        this.payeddata = peydata[0];
        this.salaryFieldName = this.payeddata.Payheadmaster.payheadName;
        this.payheadMasterId = this.payeddata.payheadMasterId;
      }
      // }
    } else {
      this.notifications.create(
        'Error',
        "Can't Select Same Payhead Multiple Time!",
        NotificationType.Bare,
        { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
      );
      this.salaryFieldId1 = null;
    }
  }

  addButton() {
    if (!this.addgrade.value.salaryFieldId) {
      return this.notifications.create(
        'Validation',
        'Salary Field is required!',
        NotificationType.Error,
        { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
      );
    }

    for (let i = 0; i < this.formulaListData.length; i++) {
      if (!this.formulaListData[i].calculationType) {
        return this.commonNotificationService.handleWarning('Calculation is required!');
      }

      if (this.formulaListData[i].calculationType == 'FO') {
        if (!this.formulaListData[i].formula)
          return this.commonNotificationService.handleWarning('Formula is required!');

        this.formulaListData[i].fixAmount = null;
      }

      if (this.formulaListData[i].calculationType == 'F') {
        if ([null, '', undefined].includes(this.formulaListData[i].fixAmount))
          return this.commonNotificationService.handleWarning('Amount is required!');
        this.formulaListData[i].formula = '';
      }
    }

    if (this.formulaListData.length > 1 && !this.formulaPreference)
      return this.commonNotificationService.handleWarning('Formula Preference is required!');

    if (this.payeddata.salaryFieldSrNo != 'D') {
      const chekfilter = this.gradeSalaryArry.filter(
        (g) => g.salaryFieldId == this.addgrade.value.salaryFieldId,
      );

      if (chekfilter.length == 0) {
        this.gradeSalaryArry.push({
          salaryFieldId: this.addgrade.value.salaryFieldId,
          salayFieldName: this.salaryFieldName,
          fieldFixAmount: this.formulaListData?.[0]?.fixAmount || null,
          fieldFixAmount1: this.formulaListData?.[1]?.fixAmount || null,
          toamount: this.addgrade.value.gradeTo,
          formula: this.formulaListData?.[0]?.formula || '',
          formula1: this.formulaListData?.[1]?.formula || '',
          salaryFieldSrNo: this.payeddata.salaryFieldSrNo,
          salaryfieldmaxrange: this.addgrade.value.salaryFieldMaxRange,
          payheadMasterId: this.payheadMasterId,
          formulaPreference: this.formulaPreference,
        });
      }
      this.buttonDisabled = false;
    } else {
      this.gradeSalaryArry.push({
        salaryFieldId: this.addgrade.value.salaryFieldId,
        salayFieldName: this.salaryFieldName,
        fieldFixAmount: this.formulaListData?.[0]?.fixAmount || null,
        fieldFixAmount1: this.formulaListData?.[1]?.fixAmount || null,
        toamount: this.addgrade.value.gradeTo,
        formula: this.formulaListData?.[0]?.formula || '',
        formula1: this.formulaListData?.[1]?.formula || '',
        salaryFieldSrNo: this.payeddata.salaryFieldSrNo,
        salaryfieldmaxrange: this.addgrade.value.salaryFieldMaxRange,
        payheadMasterId: this.payheadMasterId,
        formulaPreference: this.formulaPreference,
      });
    }
    this.buttonDisabled = false;

    this.salaryFieldId1 = '';
    this.salaryFieldName = '';
    this.payheadMasterId = null;
    this.formulaPreference = null;
    this.formulaListData = [];
    this.addFormulaList();
    this.calculatorFlag = false;
    this.calculatorFlag1 = false;
  }

  removeButton(i: any) {
    this.gradeSalaryArry.splice(i, 1);
  }

  updateButton(i: any) {
    this.buttonValue = 1;
    this.ivalue = i;
    this.formulaListData = [];

    this.calculatorFlag = false;
    this.calculatorFlag1 = false;

    this.effpayhead1 = this.effpayhead.filter((s) => {
      return s.salaryFieldID != this.gradeSalaryArry[i].salaryFieldId;
    });

    this.formulaPreference = this.gradeSalaryArry[i].formulaPreference;

    if (this.gradeSalaryArry[i].formula) {
      this.calculatorFlag = this.gradeSalaryArry[i].formula1 || this.gradeSalaryArry[i].fieldFixAmount1 ? false : true;

      this.formulaListData.push({
        calculationType: 'FO',
        fixAmount: null,
        formula: this.gradeSalaryArry[i].formula,
        editbuttonFlag:
          this.gradeSalaryArry[i].formula1 || this.gradeSalaryArry[i].fieldFixAmount1
            ? true
            : false,
      });
    } else {
      this.formulaListData.push({
        calculationType: 'F',
        fixAmount: this.gradeSalaryArry[i].fieldFixAmount,
        formula: '',
        editbuttonFlag:
          this.gradeSalaryArry[i].formula1 || this.gradeSalaryArry[i].fieldFixAmount1
            ? true
            : false,
      });


    }

    if (this.gradeSalaryArry[i].formula1) {
      this.calculatorFlag1 = true;

      this.formulaListData.push({
        calculationType: 'FO',
        fixAmount: null,
        formula: this.gradeSalaryArry[i].formula1,
        editbuttonFlag: false,
      });
    } else if (this.gradeSalaryArry[i].fieldFixAmount1) {
      this.formulaListData.push({
        calculationType: 'F',
        fixAmount: this.gradeSalaryArry[i].fieldFixAmount1,
        formula: '',
        editbuttonFlag: false,
      });

    }

    this.index = this.gradeSalaryArry[i].salaryfieldindex;
    this.salaryFieldId1 = Number(this.gradeSalaryArry[i].salaryFieldId);
    this.salaryFieldName = this.gradeSalaryArry[i].salayFieldName;
    this.payheadMasterId = this.gradeSalaryArry[i].payheadMasterId;
    this.salaryFieldMaxRange1 = this.gradeSalaryArry[i].salaryfieldmaxrange;
    this.toamount = this.gradeSalaryArry[i].toamount;
    this.salaryfieldsrNo = this.gradeSalaryArry[i].salaryFieldSrNo;

  }

  updateButton1() {
    if (!this.addgrade.value.salaryFieldId) {
      return this.notifications.create(
        'Validation',
        'Salary Field is required!',
        NotificationType.Error,
        { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
      );
    }

    for (let i = 0; i < this.formulaListData.length; i++) {
      if (!this.formulaListData[i].calculationType) {
        return this.commonNotificationService.handleWarning('Calculation is required!');
      }

      if (this.formulaListData[i].calculationType == 'FO') {
        if (!this.formulaListData[i].formula)
          return this.commonNotificationService.handleWarning('Formula is required!');

        this.formulaListData[i].fixAmount = null;
      }

      if (this.formulaListData[i].calculationType == 'F') {
        if ([null, '', undefined].includes(this.formulaListData[i].fixAmount))
          return this.commonNotificationService.handleWarning('Amount is required!');
        this.formulaListData[i].formula = '';
      }
    }

    if (this.formulaListData.length > 1 && !this.formulaPreference)
      return this.commonNotificationService.handleWarning('Formula Preference is required!');

    this.gradeSalaryArry[this.ivalue].salaryFieldId = this.addgrade.value.salaryFieldId;
    this.gradeSalaryArry[this.ivalue].salayFieldName = this.salaryFieldName;
    this.gradeSalaryArry[this.ivalue].fieldFixAmount = this.formulaListData?.[0]?.fixAmount || null;
    this.gradeSalaryArry[this.ivalue].fieldFixAmount1 =
      this.formulaListData?.[1]?.fixAmount || null;
    this.gradeSalaryArry[this.ivalue].toamount = this.toamount;
    this.gradeSalaryArry[this.ivalue].formula = this.formulaListData?.[0]?.formula || '';
    this.gradeSalaryArry[this.ivalue].formula1 = this.formulaListData?.[1]?.formula || '';
    this.gradeSalaryArry[this.ivalue].salaryFieldSrNo = this.salaryfieldsrNo;
    this.gradeSalaryArry[this.ivalue].salaryfieldmaxrange = this.addgrade.value.salaryFieldMaxRange;
    this.gradeSalaryArry[this.ivalue].payheadMasterId = this.payheadMasterId;
    this.gradeSalaryArry[this.ivalue].formulaPreference = this.formulaPreference;

    this.salaryFieldId1 = '';
    this.salaryFieldName = '';
    this.salaryFieldMaxRange1 = '';
    this.salaryfieldsrNo = '';
    this.buttonValue = 0;
    this.ivalue = '';
    this.payheadMasterId = null;
    this.formulaPreference = null;
    this.formulaListData = [];
    this.addFormulaList();
    this.calculatorFlag = false;
    this.calculatorFlag1 = false;
  }

  onSubmit() {
    if (!this.addgrade.valid) {
      return;
    }

    const body = {
      gradeName: this.addgrade.value.gradeName,
      gradeFrom: this.addgrade.value.gradeFrom,
      gradeTo: this.addgrade.value.gradeTo,
      companyMasterID: this.addgrade.value.companyMasterID,
      baseOnCalculation: this.addgrade.value.baseOnCalculation,
      gradeSalayFields: this.gradeSalaryArry,
      isContractorGrade: this.isContractorGrade,
      contractorId: this.isContractorGrade ? this.selectedContractor : null,
      skillCategory: this.isContractorGrade ? this.addgrade.value.category : null,
      applicableYYYYMM: this.isContractorGrade ? this.addgrade.value.YearMM.replace('-', '') : null,
    };

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.spinner.start();
    this.api.callApi(this.constant.CREATEGRADE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.buttonDisabled = false;
            this.buttonState = '';
            this.router.navigate([this.adminRoot + '/masters/grade']);
            this.spinner.stop();
          }, 3000);
        } else {
          this.buttonDisabled = false;
          this.buttonState = '';
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err.error.message, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop();
      },
    );
  }


  addpayhead(event) {
    if (!this.formulaListData.length) return;
    if (!this.calculatorFlag && !this.calculatorFlag1) return;

    if (this.calculatorFlag1 && this.formulaListData?.[1]) {
      this.formulaListData[1].formula += String(event);
    } else {
      this.formulaListData[0].formula += String(event);
    }
  }

  clearAll() {
    if (!this.formulaListData.length) return;
    if (this.calculatorFlag1 && this.formulaListData?.[1]) {
      this.formulaListData[1].formula = '';
    } else {
      this.formulaListData[0].formula = '';
    }
  }

  clearText() {
    if (!this.formulaListData.length) return;

    if (this.calculatorFlag1 && this.formulaListData?.[1]) {
      this.formulaListData[1].formula = String(this.formulaListData[1].formula).slice(0, -1);
    } else {
      this.formulaListData[0].formula = String(this.formulaListData[0].formula).slice(0, -1);
    }
  }
}
