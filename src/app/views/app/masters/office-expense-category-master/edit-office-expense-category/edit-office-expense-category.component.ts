import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppNotificationService } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-office-expense-category',
    templateUrl: './edit-office-expense-category.component.html',
    styleUrls: ['./edit-office-expense-category.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditOfficeExpenseCategoryComponent implements OnInit {

  @ViewChild('editForm') editForm: NgForm;

  allCompany: any = [];

  filterData = {
    companyMasterID: null,
    officeExpenseCategory: '',
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
    this.filterData.officeExpenseCategoryID = this.formValue.ListOfficeExpenseCategoryComponent.body.officeExpenseCategoryID
    if (this.filterData.officeExpenseCategoryID)
      this.getAllData()
  }

  getAllData() {
    this.spinner.start('getbyid');
    this.api.callApi(this.constant.GETOFFICEEXPENSECATEGORYBYID + this.filterData.officeExpenseCategoryID, {}, 'GET', false, true, true).subscribe(
      (res: any) => {
        this.filterData.companyMasterID = res.data?.companyMasterID;
        this.filterData.officeExpenseCategory = res.data?.officeExpenseCategory;
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

  onSubmit() {
    if (!this.editForm.valid) return;
    this.filterData.officeExpenseCategory = this.editForm.value.officeExpenseCategory;
    this.spinner.start('editofficeExpenseCategory');
    this.api.callApi(this.constant.UPDATEOFFICEEXPENSECATEGORY, this.filterData, 'PUT', false, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          setTimeout(() => {
            this.router.navigate(['/app/masters/officeExpenseCategory'])
            this.spinner.stop('editofficeExpenseCategory');
          }, 3000);
        }
        this.commonNotificationService.handleSuccess(res.message);
      },
      (err) => {
        this.spinner.stop('editofficeExpenseCategory');
        this.commonNotificationService.handleError(err.error.message);
      },
    )

  }

  cancel() {
    this.router.navigate(['/app/masters/officeExpenseCategory'])
  }
}
