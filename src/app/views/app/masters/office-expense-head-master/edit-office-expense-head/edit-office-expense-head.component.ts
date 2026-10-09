import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-office-expense-head',
    templateUrl: './edit-office-expense-head.component.html',
    styleUrls: ['./edit-office-expense-head.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditOfficeExpenseHeadComponent implements OnInit {

  @ViewChild('editForm') editForm: NgForm;

  expenseCategories: any = []
  allCompany: any = [];

  filterData = {
    companyMasterID: null,
    officeExpenseHead: '',
    officeExpenseHeadID: null,
    officeExpenseCategoryID: null
  }

  formValue: any

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.getcompany()
    this.formValue = this.formValueStorageService.getData();
    this.filterData.officeExpenseHeadID = this.formValue.ListOfficeExpenseHeadComponent.body.officeExpenseHeadID;
    if (this.filterData.officeExpenseHeadID)
      this.getAllData()
  }

  getAllData() {
    this.spinner.start('getbyid');
    this.api.callApi(this.constant.GETOFFICEEXPENSEHEADBYID + this.filterData.officeExpenseHeadID, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        this.filterData.companyMasterID = res.data?.officeExpenseCategory?.companyMasterID;
        if (this.filterData.companyMasterID)
          this.getAllCategories();
        this.filterData.officeExpenseCategoryID = res.data?.officeExpenseCategoryID;
        this.filterData.officeExpenseHead = res.data?.officeExpenseHead;
        this.spinner.stop('getbyid');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
        this.spinner.stop('getbyid');
      },
    )
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.allCompany = res.data;
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

  getAllCategories() {
    let body = {
      companyMasterID: this.filterData.companyMasterID
    }
    this.spinner.stop('OfficeExpenseCategories');
    this.api.callApi(this.constant.GETALLOFFICEEXPENSECATEGORY, body, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.expenseCategories = res.data;
        this.spinner.stop('OfficeExpenseCategories');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
      },
    )
  }

  onSubmit() {
    if (!this.editForm.valid) return;
    this.filterData.officeExpenseHead = this.editForm.value.officeExpenseHead;
    this.spinner.start('editofficeExpenseCategory');
    this.api.callApi(this.constant.UPDATEOFFICEEXPENSEHEAD, this.filterData, 'PUT', false, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          setTimeout(() => {
            this.router.navigate(['/app/masters/officeExpenseHead'])
          }, 3000);
        }
        this.commonNotificationService.handleSuccess(res.message);
        this.spinner.stop('editofficeExpenseCategory');
      },
      (err) => {
        this.spinner.stop('editofficeExpenseCategory');
        this.commonNotificationService.handleError(err.error.message);
      },
    )

  }

  cancel() {
    this.router.navigate(['/app/masters/officeExpenseHead'])
  }
}
