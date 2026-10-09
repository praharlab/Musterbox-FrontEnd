import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-edit-tax-standard-deduction',
    templateUrl: './edit-tax-standard-deduction.component.html',
    styleUrls: ['./edit-tax-standard-deduction.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditTaxStandardDeductionComponent implements OnInit {

  @ViewChild('filterForm') filterForm: NgForm;

  currentData = {
    financialYear: '',
    regime: '',
    amount: null
  }

  body = {
    financialYear: '',
    regime: '',
    amount: null
  }

  yearData: any = [];

  regimeArray: any = []
  adminRoot = environment.adminRoot;
  formValue: any

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private commonNotificationService: CommonNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.regimeArray = ['New Regime', 'Old Regime']
    this.getFinancialYears()
  }

  onSubmit() {
    if (!this.filterForm.valid) return;
    if(this.filterForm.value.amount < 0){
      this.commonNotificationService.handleError('Amount Must be Positive value!');
      return;
    }

    this.body.financialYear = this.filterForm.value.financialYear;
    this.body.regime = this.filterForm.value.regime;
    this.body.amount = this.filterForm.value.amount;

    this.spinner.start('EditTaxStdDeduction');
    this.api.callApi(this.constant.UPDATETAXSTANDARDDEDUCTIONS + this.formValue.ListTaxStandardDeductionComponent.id, this.body, 'PUT', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res?.message);
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/tax-standard-deduction']);
            this.filterForm.resetForm()
          }, 3000);
        }else{
          this.spinner.stop('EditTaxStdDeduction');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err?.error?.message);
        this.spinner.stop('EditTaxStdDeduction');
      },
    );
  }

  getTaxStandardDeduction() {
    this.spinner.start('EditTaxStdDeduction');
    this.api.callApi(this.constant.GETTAXSTANDARDDEDUCTIONSBYID + this.formValue?.ListTaxStandardDeductionComponent?.id, this.body, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.currentData.amount = res.data.amount;
          this.currentData.regime = res.data.regime;
          this.currentData.financialYear = res.data.financialYear;
        }
        this.spinner.stop('EditTaxStdDeduction');
      },
      (err) => {
        this.commonNotificationService.handleError(err?.error?.message);
        this.spinner.stop('EditTaxStdDeduction');
      },
    );
  }

  cancel() {
    this.router.navigate([this.adminRoot + '/superadminmenus/tax-standard-deduction']);
  }

  getFinancialYears() {
    this.spinner.start('financialyear');
    this.api.callApi(this.constant.GETFINANCIALYEARS, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.yearData = res.data
          this.getTaxStandardDeduction()
        }
        this.spinner.stop('financialyear');
      },
      (err) => {
        this.spinner.stop('financialyear');
      },
    );

  }

}
