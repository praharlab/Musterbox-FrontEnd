import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-tax-rebate',
    templateUrl: './add-tax-rebate.component.html',
    styleUrls: ['./add-tax-rebate.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddTaxRebateComponent implements OnInit {

  @ViewChild('filterForm') filterForm: NgForm;
  yearData: any = []
  regimeArray: string[];
  adminRoot = environment.adminRoot;
  body = {
    financialYear: '',
    regime: '',
    amount: null
  }

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private commonNotificationService: CommonNotificationService,
    ) { }

  ngOnInit(): void {
    this.regimeArray = ['New Regime', 'Old Regime']
    this.getFinancialYears()
  }

  getFinancialYears() {
    this.spinner.start('financialyear');
    this.api.callApi(this.constant.GETFINANCIALYEARS, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.yearData = res.data
        }
        this.spinner.stop('financialyear');
      },
      (err) => {
        this.spinner.stop('financialyear');
      },
    );

  }

  onSubmit(){
    if(!this.filterForm.valid) return;
    if(this.filterForm.value.amount < 0){
      this.commonNotificationService.handleError('Amount Must be Positive value!');
      return;
    }

    this.body.financialYear = this.filterForm.value.financialYear;
    this.body.regime = this.filterForm.value.regime;
    this.body.amount = this.filterForm.value.amount;
    
    this.spinner.start('AddTaxRebate');
    this.api.callApi(this.constant.ADDTAXREBATE, this.body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res?.message);
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/tax-rebate']);
            this.filterForm.resetForm()
          }, 3000);
        }
        this.spinner.stop('AddTaxRebate');
      },
      (err) => {
        this.commonNotificationService.handleError(err?.error?.message);
        this.spinner.stop('AddTaxRebate');
      },
    );
  }

  cancel(){
    this.router.navigate([this.adminRoot + '/superadminmenus/tax-rebate']);
  }
}
