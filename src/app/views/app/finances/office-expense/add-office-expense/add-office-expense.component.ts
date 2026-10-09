import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { expenseTypeArray, expenseTypes, officeExpenseTypeArray, officeExpenseTypes } from 'src/app/constants/commonVariables';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { ModalService } from 'src/app/services/modal.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-office-expense',
    templateUrl: './add-office-expense.component.html',
    styleUrls: ['./add-office-expense.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddOfficeExpenseComponent implements OnInit {
@ViewChild('addOfficeExpense') addOfficeExpense: NgForm;
  adminRoot = environment.adminRoot;
  usertype: any;
  company_id: any;
  values = [];
  officeExpenseCategory: any;
  filterData = {
    branchMasterID: null
  }

  allbranch: any
  allSites: any
  selectedExpenseDate: any;
  currDate: any = new Date().toISOString().slice(0, 10);
  minDate: any;
  selectedBranch: any
  selectedSite: any
  officeExpenseTypeArrayData = officeExpenseTypeArray;
  officeExpenseTypes = officeExpenseTypes;
  selectedOfficeType: any
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private modalService: ModalService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    this.company_id = +localStorage.getItem('company_id');
    this.addTransaction();
    this.getOfficeExpenseCategory();
  }

  removeTransaction(i) {
    this.values[i].isDeleted = true;
    this.values = this.values.filter((e) => !e.isDeleted);
  }
  
  addTransaction(): void {
    this.values.push({
      expenseCategoryId: null,
      expenseHeadId: null,
      expenseAmount: null,
      description: '',
      attachments: [null],
      attachFile: null,
      attachFile2: null,
      showAttachment2: false,
      isDeleted: false,
      headPriceRuleData: null,
      filteredExpenseHeads: [] // Unique head list per row
    });
  }

  onCategoryChange(officeExpenseCategoryID: number, rowIndex: number): void {
    this.getExpenseHeadDataForRow(officeExpenseCategoryID, rowIndex);
  }
  getExpenseHeadDataForRow(officeExpenseCategoryID: number, rowIndex: number): void {
    if (!officeExpenseCategoryID) return;

    this.api
      .callApi(this.constant.GETALLOFFICEEXPENSEHEAD, {officeExpenseCategoryID, companyMasterID: this.company_id}, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status === 200) {
          this.values[rowIndex].filteredExpenseHeads = res.data;
          this.values[rowIndex].expenseHeadId = null; // reset head
        }
      });
  }

  onSubmit() {
    if (!this.addOfficeExpense.valid) {
      return;
    }
    if (this.currDate < this.addOfficeExpense.value.expense_date) {
      return this.commonNotificationService.handleWarning(
        `You cannot apply expense for Future Dates`,
      );
    }
    this.values = this.values.filter((e) => !e.deleted);

    const negativeData = this.values.find((e) => e.expenseAmount <= 0);
    if (negativeData) {
      return this.commonNotificationService.handleWarning('Expense Amount Can not be Negative or Zero');
    }
    const formData = new FormData();
    if (this.selectedOfficeType == officeExpenseTypes.BRANCH)
      formData.append(`branchMasterID`, this.addOfficeExpense.value.branch);
    if (this.selectedOfficeType == officeExpenseTypes.SITE)
      formData.append(`siteID`, this.addOfficeExpense.value.siteID);
    
    formData.append(`expense_date`, this.addOfficeExpense.value.expense_date);

    this.values.forEach((element, index) => {
      formData.append(`officeExpenseHeadID${index}`, element.officeExpenseHeadID);
      if (element.expensePriceRuleID) {
        formData.append(`expensePriceRuleID${index}`, element.expensePriceRuleID);
      }
      formData.append(`expenseAmount${index}`, element.expenseAmount);
      formData.append(`description${index}`, element.description);

      if (element?.attachments && element?.attachments?.length > 0) {
        element.attachments.forEach((file, fileIndex) => {
          if (file) {
            formData.append(`attachFile`, file);
            formData.append(fileIndex == 0 ? `isattachment_${index}` : `isattachment${fileIndex + 1}_${index}`, 'true');
          }
        });
      }
    });
    this.spinner.start();
    this.api.callApi(this.constant.ADDOFFICEEXPENSE, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.spinner.stop();
            this.router.navigate([this.adminRoot + '/finances/officeExpense']).then(() => {
              this.modalService.refreshUserRequestStatus();
              this.spinner.stop();
            });
          }, 3000);
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop();
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);

        this.spinner.stop();
      },
    );
  }

  onExpenseDateChange(newDate: string) {
    this.selectedExpenseDate = newDate;
  }

  getOfficeExpenseCategory() {
    this.api
      .callApi(
        this.constant.GETALLOFFICEEXPENSECATEGORY,
        {
          companyMasterID: this.company_id
        },
        'POST',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.officeExpenseCategory = res.data;

          this.spinner.stop();
        }
      });
  }

  onExpenseHeadChange(event, i) {
    this.values[i].expensePriceRuleID = null;
    const index = this.values[i].filteredExpenseHeads.findIndex(x => event.expenseHeadId == x.expenseHeadId);
    this.values[i].expenseHeadName = this.values[i].filteredExpenseHeads[index]?.expenseHead;
    // this.spinner.start();
    // this.api
    //   .callApi(this.constant.GETEXPENSEPRICEBYHEAD + event.expenseHeadId, {}, 'GET', true, false, true)
    //   .subscribe((res: any) => {
    //     if (res.status == 200) {
    //       this.values[i].expensePriceRuleID = res.data?.expensePriceRuleID ? res.data?.expensePriceRuleID : null;
    //       this.values[i].rule = res.data?.rule ? res.data?.rule : null;
    //       this.spinner.stop();
    //     }
    //   });
  }

  // Add attachment slot
// TrackBy function to avoid DOM reuse issues
trackByFn(index: number, item: any): number {
  return index;
}

// Add a new empty attachment slot
addAttachment(i: number): void {
  if (!this.values[i].attachments) {
    this.values[i].attachments = [];
  }
  this.values[i].attachments.push(null); // Push placeholder
}

// Remove a specific attachment slot
removeAttachment(i: number, j: number): void {
  this.values[i].attachments.splice(j, 1);
  this.values[i].attachments = [...this.values[i].attachments];
}

// Handle file input changes and update attachments
onFileChangeAll(event: any, i: number, j: number): void {
  const file = event.target.files?.[0] ?? null;
  if (!this.values[i].attachments) {
    this.values[i].attachments = [];
  }
  this.values[i].attachments[j] = file;
}

  getAllAllocatedBranches() {
    this.allbranch = [];
    const body = {
      userMasterID: +localStorage.getItem('id'),
    }
    this.spinner.start('GETALLOFFICEEXPENSEALLOCATIONRIGHTS');
    this.api.callApi(this.constant.GETALLASSIGNEDBRANCHBYUSER, body, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.allbranch = res.data;
        this.spinner.stop('GETALLOFFICEEXPENSEALLOCATIONRIGHTS');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
      },
    )
  }
  
  getAllAllocatedSites() {
    const body = {
      userMasterID: +localStorage.getItem('id'),
    }
    this.spinner.start('GETALLOFFICEEXPENSEALLOCATIONRIGHTS');
    this.api.callApi(this.constant.GETALLASSIGNEDSITEBYUSER, body, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.allSites = res.data;
        this.spinner.stop('GETALLOFFICEEXPENSEALLOCATIONRIGHTS');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
      },
    )
  }

  onSelectBranch(branchMasterID: any){
    this.filterData.branchMasterID = branchMasterID
}

  onOfficeTypeSelect() {
    if(this.selectedOfficeType == officeExpenseTypes.BRANCH)
      this.getAllAllocatedBranches();

    if (this.selectedOfficeType == officeExpenseTypes.SITE)
      this.getAllAllocatedSites();
  }
}
