import { ChangeDetectorRef, Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { officeExpenseTypeArray, officeExpenseTypes } from 'src/app/constants/commonVariables';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ModalService } from 'src/app/services/modal.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-edit-office-expense',
    templateUrl: './edit-office-expense.component.html',
    styleUrls: ['./edit-office-expense.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditOfficeExpenseComponent implements OnInit {
  @ViewChild('editOfficeExpense') editOfficeExpense: NgForm;
  formValue: any
  editData: any

  apiURL = environment.apiUrl
  officeExpenseTypeArrayData = officeExpenseTypeArray;
  officeExpenseTypes = officeExpenseTypes;
  selectedOfficeType: any

  allcomp: any
  allbranch: any
  allSites: any
  officeExpenseCategory: any
  filesTobeRemoved: any[] = [];
  
  selectedExpenseDate: any;
  currDate: any
  
  permissioncreate: any = []
  permissionedit: any = []
  permissiondelete: any = []

  adminRoot = environment.adminRoot

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData()
    this.checkpermission()
  }
  
  ngAfterViewInit(): void {
    this.getOfficeExpenseCategory()
    this.getOfficeExpenseData();
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          if (this.formValue?.ListOfficeExpenseComponent?.body?.navigatedFrom == 'ListOfficeExpenseComponent') {
            this.permissiondelete = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'OfficeExpense' &&
                permissionval.operationName.includes('Delete')
              );
            });
            this.permissionedit = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'OfficeExpense' &&
                permissionval.operationName.includes('Edit')
              );
            });
            this.permissioncreate = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'OfficeExpense' &&
                permissionval.operationName.includes('Create')
              );
            });
          } else {
            this.permissiondelete = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'OfficeExpenseRequest' &&
                permissionval.operationName.includes('Delete')
              );
            });
            this.permissionedit = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'OfficeExpenseRequest' &&
                permissionval.operationName.includes('Edit')
              );
            });
          }
          this.spinner.stop();
        }
      });
  }

  getOfficeExpenseData() {
    const body = {
      officeExpenseID: +this.formValue?.ListOfficeExpenseComponent?.id,
    };
    this.spinner.start('editData');
    this.api.callApi(this.constant.GETOFFICEEXPENSEBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.editData = res.data;
          this.selectedOfficeType = this.editData.siteID ? officeExpenseTypes.SITE : officeExpenseTypes.BRANCH;

          this.editData.branchMasterID = this.editData.siteID ? +this.editData.site.branchMasterID : +this.editData.branchMasterID;
          if(this.editData.branchMasterID)
            this.getAllAllocatedBranches();

          this.editData.siteID = this.editData.siteID ? String(this.editData.siteID) : null;
          if(this.editData.siteID)
            this.getAllocatedSites()

          this.editData.officeExpenseTransactions = this.editData.officeExpenseTransactions.map(
            (x) => ({ ...x, checked: false, isOpen: false }),
          );

          this.editData?.officeExpenseTransactions.forEach((val: any, index: number) => {
            const obj = this.editData.officeExpenseTransactions[index];

            obj.isDeleted = false;
            obj.isAdded = false;
            obj.filteredExpenseHeads = [];
            obj.expensePriceRuleID = null;

            // Initialize attachments array and new flags array
            obj.attachments = [];
            obj.isNewAttachmentFlags = [];

            // Push each existing attachment into array
            if (val.attachFile) {
              obj.attachments.push(val.attachFile);
              obj.isNewAttachmentFlags.push(false);
            }
            if (val.attachFile2) {
              obj.attachments.push(val.attachFile2);
              obj.isNewAttachmentFlags.push(false);
            }
            if (val.attachFile3) {
              obj.attachments.push(val.attachFile3);
              obj.isNewAttachmentFlags.push(false);
            }
            if (val.attachFile4) {
              obj.attachments.push(val.attachFile4);
              obj.isNewAttachmentFlags.push(false);
            }
            
            if(!val.attachFile && !val.attachFile2 && !val.attachFile3 && !val.attachFile4){
              obj.attachments.push(null);
              obj.isNewAttachmentFlags.push(false);  
            }

            // Optional flags to show additional attachment inputs in the UI
            obj.showAttachment2 = !!val.attachFile2;
            obj.showAttachment3 = !!val.attachFile3;
            obj.showAttachment4 = !!val.attachFile4;

            // Initialize dropdown values
            this.onCategoryChange(val.officeExpenseHead.officeExpenseCategoryID, index);
            this.onExpenseHeadChange(val.officeExpenseHead.officeExpenseHeadID, index);
          });
          this.editData.transactionLength = this.editData.officeExpenseTransactions.filter(
            (x) => !x.isDeleted,
          )?.length;

        }
        this.spinner.stop('editData');
      },
      (error: any) => {
        this.spinner.stop('editData');
        this.commonNotificationService.handleError(error.error.message);
      },
    );
  }

  view(attachment: any) {
    window.open(this.apiURL + attachment, '_blank');
  }

  showImage(data: string) {
    if (data && data != null && data != 'null' && !String(data).endsWith('.pdf') ) {
      return true;
    } else {
      return false;
    }
  }

  onSubmit() {
    if (!this.editOfficeExpense.valid) {
      return;
    }
    if (this.currDate < this.editOfficeExpense.value.expense_date) {
      return this.commonNotificationService.handleWarning(
        `You cannot apply expense for Future Dates`,
      );
    }
    this.editData.officeExpenseTransactions = this.editData.officeExpenseTransactions.filter((e) => !e.deleted);

    const negativeData = this.editData.officeExpenseTransactions.find((e) => e.expenseAmount <= 0);
    if (negativeData) {
      return this.commonNotificationService.handleWarning('Expense Amount Can not be Negative or Zero');
    }
    const formData = new FormData();
    formData.append(`officeExpenseID`, this.editData.officeExpenseID);
    formData.append(`companyMasterID`, localStorage.getItem('company_id'));
    formData.append('filesTobeRemoved', this.filesTobeRemoved.join(','));
    if (this.selectedOfficeType == officeExpenseTypes.BRANCH)
      formData.append(`branchMasterID`, this.editOfficeExpense.value.branch);
    if (this.selectedOfficeType == officeExpenseTypes.SITE)
      formData.append(`siteID`, this.editOfficeExpense.value.siteID);
    
    formData.append(`expense_date`, this.editData.expense_date);

    this.editData.officeExpenseTransactions.forEach((element, index) => {
      if (element.isDeleted && element.isAdded) {
        return;
      } else {
        if (!element.isAdded)
          formData.append(`officeExpenseTransactionID_${index}`, element.officeExpenseTransactionID);

        formData.append(`isRemoved_${index}`, element.isDeleted);
        formData.append(`isNewAdded_${index}`, element.isAdded);

        if (element?.authorizationStatus) {
          formData.append(`authorizationStatus${index}`, element?.authorizationStatus);
        }

        formData.append(`officeExpenseHeadID${index}`, element.officeExpenseHeadID);
        if (element.expensePriceRuleID) {
          formData.append(`expensePriceRuleID${index}`, element.expensePriceRuleID);
        }
        formData.append(`expenseAmount${index}`, element.expenseAmount);
        formData.append(`description${index}`, element.description);

        if (element?.attachments && element.attachments.length > 0) {
          element.attachments.forEach((file, fileIndex) => {
            const isNew = element?.isNewAttachmentFlags?.[fileIndex];

            if (file && typeof file === 'object') {
              formData.append(`attachFile`, file);
            } else if (file && typeof file === 'string' && file !== 'null' && file !== '') {
              formData.append(`attachFile${fileIndex + 1}_${index}`, file);
            }

            formData.append(
              fileIndex === 0 ? `isattachment_${index}` : `isattachment${fileIndex + 1}_${index}`,
              'true',
            );

            formData.append(
              fileIndex === 0
                ? `isNewAttachment_${index}`
                : `isNewAttachment${fileIndex + 1}_${index}`,
              isNew ? 'true' : 'false',
            );
          });
        } else {
          formData.append(`isattachment_${index}`, 'false');
          formData.append(`isNewAttachment_${index}`, 'false');
        }
      }
    });
    this.spinner.start();
    this.api.callApi(this.constant.UPDATEOFFICEEXPENSE, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.spinner.stop();
            this.cancel()
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

  selectcompany(event) {
    if (!event) {
      this.allbranch = [];
      return;
    }
    // this.spinner.start('branch');
    // this.api
    //   .callApi(this.constant.BRANCHBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
    //   .subscribe((res: any) => {
    //     this.allbranch = res;
    //     this.spinner.stop('branch');
    //   });
  }

  getAllAllocatedBranches() {
    const body = {
      userMasterID: +localStorage.getItem('id')
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
  
  getAllocatedSites() {
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

  onExpenseDateChange(newDate: string) {
    this.selectedExpenseDate = newDate;
  }

  onCategoryChange(officeExpenseCategoryID: number, rowIndex: number): void {
    this.getExpenseHeadDataForRow(officeExpenseCategoryID, rowIndex);
  }
  getExpenseHeadDataForRow(officeExpenseCategoryID: number, rowIndex: number): void {
    if (!officeExpenseCategoryID) return;

    this.api
      .callApi(this.constant.GETALLOFFICEEXPENSEHEAD, {officeExpenseCategoryID, companyMasterID: this.editData.companyMasterID}, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status === 200) {
          this.editData.officeExpenseTransactions[rowIndex].filteredExpenseHeads = res.data;
          this.editData.officeExpenseTransactions[rowIndex].expenseHeadId = null; // reset head
        }
      });
  }

  onExpenseHeadChange(event, i) {
    this.editData.officeExpenseTransactions[i].expensePriceRuleID = null;
    const index = this.editData.officeExpenseTransactions[i].filteredExpenseHeads.findIndex(x => event.expenseHeadId == x.expenseHeadId);
    this.editData.officeExpenseTransactions[i].expenseHeadName = this.editData.officeExpenseTransactions[i].filteredExpenseHeads[index]?.expenseHead;
    // this.spinner.start();
    // this.api
    //   .callApi(this.constant.GETEXPENSEPRICEBYHEAD + event.expenseHeadId, {}, 'GET', true, false, true)
    //   .subscribe((res: any) => {
    //     if (res.status == 200) {
    //       this.editData.officeExpenseTransactions[i].expensePriceRuleID = res.data?.expensePriceRuleID ? res.data?.expensePriceRuleID : null;
    //       this.editData.officeExpenseTransactions[i].rule = res.data?.rule ? res.data?.rule : null;
    //       this.spinner.stop();
    //     }
    //   });
  }

  trackByFn(index: number, item: any): number {
  return index;
}

// Add a new empty attachment slot
addAttachment(index: number) {
    const transaction = this.editData.officeExpenseTransactions[index];

    // Ensure attachments array exists
    if (!transaction.attachments) {
      transaction.attachments = [];
    }

    // Ensure flags array exists
    if (!transaction.isNewAttachmentFlags) {
      transaction.isNewAttachmentFlags = [];
    }

    // Add placeholder for new attachment
    transaction.attachments.push(null);

    // Set flag to false initially; it will become true on file select
    transaction.isNewAttachmentFlags.push(false);
    this.cdr.detectChanges()
  }

// Remove a specific attachment slot
removeAttachment(i: number, j: number) {
    const transaction = this.editData.officeExpenseTransactions[i];
    const removed = transaction.attachments[j];

    transaction.attachments.splice(j, 1);
    if (removed && typeof removed === 'string') {
      this.filesTobeRemoved.push(removed);
    }

    this.editData.officeExpenseTransactions[i].attachments = [...transaction.attachments];

    if (transaction.isNewAttachmentFlags) {
      transaction.isNewAttachmentFlags.splice(j, 1);
    }
    this.cdr.detectChanges()
  }

// Handle file input changes and update attachments
onFileChangeAll(event: any, i: number, j: number) {
    const file = event.target.files?.[0] ?? null;
    const transaction = this.editData.officeExpenseTransactions[i];

    if (!transaction.attachments) {
      transaction.attachments = [];
    }

    const existing = transaction.attachments[j];

    transaction.attachments[j] = file;

    if (existing && typeof existing === 'string') {
      this.filesTobeRemoved.push(existing);
    }

    if (!transaction.isNewAttachmentFlags) {
      transaction.isNewAttachmentFlags = [];
    }

    // Ensure array is the correct length
    while (transaction.isNewAttachmentFlags.length < transaction.attachments.length) {
      transaction.isNewAttachmentFlags.push(false);
    }

    transaction.isNewAttachmentFlags[j] = true;
  }

  removeTransaction(i) {
    this.editData.officeExpenseTransactions[i].isDeleted = true;
    if (this.editData.officeExpenseTransactions[i].isAdded) {
      this.editData.officeExpenseTransactions[i].authorizationStatus = '3';
    }
    this.editData.transactionLength = this.editData.officeExpenseTransactions.filter(
      (x) => !x.isDeleted,
    );
    this.editData.transactionLength = this.editData.transactionLength.length;
    this.cdr.detectChanges()
    // this.expensedata.transactionLength = this.expensedata.officeExpenseTransactions.map((x) => !x.isDeleted)?.length;
    // this.expensedata.officeExpenseTransactions = this.expensedata.officeExpenseTransactions.filter((e) => e.isDeleted && e.isAdded);
  }
  
  addTransaction(): void {
    this.editData.officeExpenseTransactions.push({
      officeExpenseCategoryID: null,
      officeExpenseHead: {
        officeExpenseCategoryID: {}
      },
      officeExpenseHeadID: null,
      expenseAmount: null,
      description: '',
      attachments: [null],
      isDeleted: false,
      isAdded: true,
      headPriceRuleData: null,
      filteredExpenseHeads: [], // Unique head list per row
      authorizationStatus: '0'
    });
    this.editData.transactionLength = this.editData.officeExpenseTransactions.filter(
      (x) => !x.isDeleted,
    )?.length;
  }

  getOfficeExpenseCategory() {
    const companyMasterID = this.editOfficeExpense?.value.company ? this.editOfficeExpense?.value.company : localStorage.getItem('company_id');
    this.api
      .callApi(
        this.constant.GETALLOFFICEEXPENSECATEGORY,
        {
          companyMasterID: companyMasterID
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

  isSubmitDisabled() {
    const index = this.editData?.officeExpenseTransactions?.findIndex((x) => x.authorizationStatus == '0' || x.authorizationStatus == '1' || x.authorizationStatus == '2');
    return index != -1 ? false : true;
  }

  checkDisableByAuth(row: any) {
    const isPendingArray = row?.officeExpenseAuths?.map((x) => x.authstatus == 2);
    if (isPendingArray?.length > 0) {
      return isPendingArray.includes(false) ? true : false;
    } else {
      return row.authorizationStatus == '3' || row.authorizationStatus == '4' ? true : false
    }
  }

  cancel() {
    this.spinner.start('CANCEL')
    if (this.formValue?.ListOfficeExpenseComponent?.body?.navigatedFrom == 'ListOfficeExpenseComponent') {
      this.router.navigate([this.adminRoot + '/finances/officeExpense']).then(() => {
        this.modalService.refreshUserRequestStatus();
        this.spinner.stop('CANCEL');
      });;
    } else {
      this.router.navigate([this.adminRoot + '/finances/officeExpRequest']).then(() => {
        this.modalService.refreshUserRequestStatus();
        this.spinner.stop('CANCEL');
      });;
    }
  }

  navigateToReapplyPage(officeExpenseTransactionID: any): void {
    this.formValueStorageService.navigate(
      'ListOfficeExpenseComponent',
      {},
      '/finances/officeExpense/reapply',
      officeExpenseTransactionID,
    );
  }

}
