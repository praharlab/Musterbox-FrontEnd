import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { FnfUserDetailsComponent } from '../fnf-user-details/fnf-user-details.component';
import { FnfAssetsComponent } from '../fnf-assets/fnf-assets.component';
import { FnfAdvanceComponent } from '../fnf-advance/fnf-advance.component';
import { FnfLoanComponent } from '../fnf-loan/fnf-loan.component';
import { FnfPenaltyComponent } from '../fnf-penalty/fnf-penalty.component';
import { FnfSalaryCalculationComponent } from '../fnf-salary-calculation/fnf-salary-calculation.component';
import { FnfResignationComponent } from '../fnf-resignation/fnf-resignation.component';
import { FnfGenerateExperienceLetterComponent } from '../fnf-generate-experience-letter/fnf-generate-experience-letter.component';
import { FnfLeaveComponent } from '../fnf-leave/fnf-leave.component';

@Component({
    selector: 'app-view-fnf',
    templateUrl: './view-fnf.component.html',
    styleUrls: ['./view-fnf.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViewFnfComponent implements OnInit {

  @ViewChild('FnfUserDetailsComponent') fnfUserDetailsComponent: FnfUserDetailsComponent;
  @ViewChild('FnfAssetsComponent') fnfAssetsComponent: FnfAssetsComponent;
  @ViewChild('FnfResignationComponent') fnfResignationComponent: FnfResignationComponent;
  @ViewChild('FnfAdvanceComponent') fnfAdvanceComponent: FnfAdvanceComponent;
  @ViewChild('FnfLoanComponent') fnfLoanComponent: FnfLoanComponent;
  @ViewChild('FnfPenaltyComponent') fnfPenaltyComponent: FnfPenaltyComponent;
  @ViewChild('FnfSalaryCalculationComponent') fnfSalaryCalculationComponent: FnfSalaryCalculationComponent;
  @ViewChild('FnfGenerateExperienceLetterComponent') fnfGenerateExperienceLetterComponent: FnfGenerateExperienceLetterComponent;
  @ViewChild('FnfLeaveComponent') fnfLeaveComponent: FnfLeaveComponent;

  step1: boolean = false;
  step2: boolean = false;
  step3: boolean = false;
  step4: boolean = false;
  step5: boolean = false;
  step6: boolean = false;
  step7: boolean = false;
  step8: boolean = false;

  salaryCalculated: boolean = false;
  experienceLetter: boolean = false;

  adminRoot = environment.adminRoot;

  userData: any

  body: {
    userId: [],
    companyId: number | null,
    month: string
  } = {
      userId: null,
      companyId: null,
      month: ''
    }

  allStatus = {
    resignationStatus: false,
    assetStatus: false,
    advanceStatus: false,
    loanStatus: false,
    panaltyStatus: false,
    leaveStatus: false
  }

  constructor(
    private router: Router,
    private spinner: NgxUiLoaderService,
    private formValueStorageService: FormValueStorageService
  ) { }

  ngOnInit(): void {
    const data = this.formValueStorageService.getData();
    this.body = data?.salaryCalculationComponent?.body?.userId ? data?.salaryCalculationComponent?.body : data?.listFNFComponent?.body;
    if (this.body.userId) {
      setTimeout(() => {
        // User Data
        this.fnfUserDetailsComponent.body = {
          companyId: this.body.companyId,
          userMasterID: [this.body.userId],
          month: this.body.month
        }
        this.fnfUserDetailsComponent.getUserData();

        // Resignation
        this.fnfResignationComponent.userMasterID = this.body.userId;
        this.fnfResignationComponent?.ResignationApplications();

        // Asset
        this.fnfAssetsComponent.userMasterID = this.body.userId;
        this.fnfAssetsComponent?.getUserAssets();

        // Advance Payment
        this.fnfAdvanceComponent.body = {
          fnfYearMonth: this.body.month,
          userMasterID: +this.body.userId
        }
        this.fnfAdvanceComponent?.getUserAdvance();

        // Loan
        this.fnfLoanComponent.body = {
          fnfYearMonth: this.body.month,
          userMasterID: +this.body.userId
        };
        this.fnfLoanComponent?.getLoanData();

        // Panelty
        this.fnfPenaltyComponent.body = {
          FNFMonth: this.body.month,
          userMasterID: +this.body.userId
        }
        this.fnfPenaltyComponent?.getUserPanelty();

        // Leave Balance 
        this.fnfLeaveComponent.body = {
          companyMasterID: this.body.companyId,
          userMasterID: this.body.userId,
          yearMonth: this.body.month,
          operationType: '',
          LeaveTranId: null,
          balance: null,
          operationFrom:'FNF'
        }
        this.fnfLeaveComponent.getLeaveBalanceData()
        // Salary Calculation
        this.fnfSalaryCalculationComponent.body = {
          companyId: String(this.body.companyId),
          userId: String(this.body.userId),
          month: this.body.month
        }
        this.fnfSalaryCalculationComponent.getData()

        // Experience Letter
        this.fnfGenerateExperienceLetterComponent.body = {
          companyMasterID: +this.body.companyId,
          userMasterID: +this.body.userId
        }
        this.fnfGenerateExperienceLetterComponent.allUserData()
        // this.fnfGenerateExperienceLetterComponent.allLetterData()


      });
    }
  }

  navigateToFnF() {
    this.router.navigate([this.adminRoot + '/payrolls/fnf']);
  }

  ngOnDestroy(): void {
    this.formValueStorageService.removeComponentData('salaryCalculationComponent', true);
    this.formValueStorageService.removeComponentData('listFNFComponent', true);
  }

  getUser(val: any) {
    this.userData = val;
  }

  getResignationStatus(status?: boolean) {
    this.allStatus.resignationStatus = status;
  }

  getAssetStatus(status?: boolean) {
    this.allStatus.assetStatus = status;
  }

  getAdvanceStatus(status?: boolean) {
    this.allStatus.advanceStatus = status;
  }

  getLoanStatus(status?: boolean) {
    this.allStatus.loanStatus = status;
  }

  getPanaltyStatus(status?: boolean) {
    this.allStatus.panaltyStatus = status;
  }

  getLeaveStatus(status?: boolean) {
    this.allStatus.leaveStatus = status;
  }

  isOpenChangeHandler(val: boolean, step: string) {
    this[step] = val;
    if (step == 'step7') {
      const anyTrue = Object.values(this.allStatus).some(status => status === false);
      this.fnfSalaryCalculationComponent.salarybuttonDisabledFNF = anyTrue ? true : false
    }

  }

  reloadData() {
    this.ngOnInit()
  }

  reloadAsset() {
    this.fnfAssetsComponent.userMasterID = this.body.userId;
    this.fnfAssetsComponent?.getUserAssets();
    this.fnfSalaryCalculationComponent.body = {
      companyId: String(this.body.companyId),
      userId: String(this.body.userId),
      month: this.body.month
    }
    this.fnfSalaryCalculationComponent.getData();
  }

  reloadResignation() {
    this.fnfResignationComponent.userMasterID = this.body.userId;
    this.fnfResignationComponent?.ResignationApplications();
    this.fnfSalaryCalculationComponent.body = {
      companyId: String(this.body.companyId),
      userId: String(this.body.userId),
      month: this.body.month
    }
    this.fnfSalaryCalculationComponent.getData();
  }

  reloadAdvance() {
    this.fnfAdvanceComponent.body = {
      fnfYearMonth: this.body.month,
      userMasterID: +this.body.userId
    }
    this.fnfAdvanceComponent?.getUserAdvance();
    this.fnfSalaryCalculationComponent.body = {
      companyId: String(this.body.companyId),
      userId: String(this.body.userId),
      month: this.body.month
    }
    this.fnfSalaryCalculationComponent.getData();
  }

  reloadLoan() {
    this.fnfLoanComponent.body = {
      fnfYearMonth: this.body.month,
      userMasterID: +this.body.userId
    };
    this.fnfLoanComponent?.getLoanData();
    this.fnfSalaryCalculationComponent.body = {
      companyId: String(this.body.companyId),
      userId: String(this.body.userId),
      month: this.body.month
    }
    this.fnfSalaryCalculationComponent.getData();
  }

  reloadPenalty() {
    this.fnfPenaltyComponent.body = {
      FNFMonth: this.body.month,
      userMasterID: +this.body.userId
    }
    this.fnfPenaltyComponent?.getUserPanelty();
    this.fnfSalaryCalculationComponent.body = {
      companyId: String(this.body.companyId),
      userId: String(this.body.userId),
      month: this.body.month
    }
    this.fnfSalaryCalculationComponent.getData();
  }

  reloadLeaves() {
    this.fnfLeaveComponent.body = {
      companyMasterID: this.body.companyId,
      userMasterID: this.body.userId,
      yearMonth: this.body.month,
      operationType: '',
      LeaveTranId: null,
      balance: null,
      operationFrom:'FNF'
    }
    this.fnfLeaveComponent.getLeaveBalanceData();
    this.fnfSalaryCalculationComponent.body = {
      companyId: String(this.body.companyId),
      userId: String(this.body.userId),
      month: this.body.month
    }
    this.fnfSalaryCalculationComponent.getData();
  }

  reloadExpLetter() {
    this.fnfGenerateExperienceLetterComponent.body = {
      companyMasterID: +this.body.companyId,
      userMasterID: +this.body.userId
    }
    this.fnfGenerateExperienceLetterComponent.allUserData()
    // this.fnfGenerateExperienceLetterComponent.allLetterData()
  }

  reloadSalaryCalculation() {
    this.fnfGenerateExperienceLetterComponent.body = {
      companyMasterID: +this.body.companyId,
      userMasterID: +this.body.userId
    }
    this.fnfGenerateExperienceLetterComponent.allUserData()
    this.fnfSalaryCalculationComponent.body = {
      companyId: String(this.body.companyId),
      userId: String(this.body.userId),
      month: this.body.month
    }
    this.fnfSalaryCalculationComponent.getData();
  }

  isSalaryCalculated(val: boolean) {
    this.salaryCalculated = val
  }

  isExperienceLetter(val: boolean) {
    this.experienceLetter = val
  }

}
