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
    selector: 'app-reapply-office-expense',
    templateUrl: './reapply-office-expense.component.html',
    styleUrls: ['./reapply-office-expense.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ReapplyOfficeExpenseComponent implements OnInit {
  @ViewChild('reapplyOfficeExpense') reapplyOfficeExpense: NgForm;

  adminRoot = environment.adminRoot
  apiURL = environment.apiUrl
  officeExpenseTypeArrayData = officeExpenseTypeArray
  officeExpenseTypes = officeExpenseTypes;
  selectedOfficeType: any
  allbranch: any = []
  allSites: any = []
  officeExpenseCategory: any = []
  officeExpenseHead: any = []
  filesTobeRemoved: any = []
  transactionData: any;
  formValue: any;


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
    this.formValue = this.formValueStorageService.getData();
    this.getOfficeExpenseCategory()
    this.getOfficeExpenseTransactionData();
  }


  getOfficeExpenseTransactionData() {
    const officeExpenseTransactionID = +this.formValue?.ListOfficeExpenseComponent?.id;
    this.spinner.start('transactionData');
    this.api.callApi(this.constant.GETOFFICEEXPENSETRANSACTIONBYID + officeExpenseTransactionID, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.transactionData = res.data;
          this.selectedOfficeType = this.transactionData?.officeExpense?.siteID ? officeExpenseTypes.SITE : officeExpenseTypes.BRANCH;

          if (this.transactionData?.officeExpense.siteID) {
            this.getAllocatedSites()
          } else {
            this.getAllAllocatedBranches();
          }
          this.transactionData.officeExpense.siteID = this.transactionData?.officeExpense?.siteID ? String(this.transactionData?.officeExpense?.siteID) : null;

          // Initialize attachments array and new flags array
          this.transactionData.attachments = [];
          this.transactionData.isNewAttachmentFlags = [];

          // Push each existing attachment into array
          if (this.transactionData.attachFile) {
            this.transactionData.attachments.push(this.transactionData.attachFile);
            this.transactionData.isNewAttachmentFlags.push(false);
          }
          if (this.transactionData.attachFile2) {
            this.transactionData.attachments.push(this.transactionData.attachFile2);
            this.transactionData.isNewAttachmentFlags.push(false);
          }
          if (this.transactionData.attachFile3) {
            this.transactionData.attachments.push(this.transactionData.attachFile3);
            this.transactionData.isNewAttachmentFlags.push(false);
          }
          if (this.transactionData.attachFile4) {
            this.transactionData.attachments.push(this.transactionData.attachFile4);
            this.transactionData.isNewAttachmentFlags.push(false);
          }

          if (!this.transactionData.attachFile && !this.transactionData.attachFile2 && !this.transactionData.attachFile3 && !this.transactionData.attachFile4) {
            this.transactionData.attachments.push(null);
            this.transactionData.isNewAttachmentFlags.push(false);
          }

          this.onCategoryChange(this.transactionData?.officeExpenseHead?.officeExpenseCategoryID);
        }
        this.spinner.stop('transactionData');
      },
      (error: any) => {
        this.spinner.stop('transactionData');
        this.commonNotificationService.handleError(error.error.message);
      },
    );
  }

  onCategoryChange(officeExpenseCategoryID: number): void {
    this.getExpenseHeadDataForRow(officeExpenseCategoryID);
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

  getExpenseHeadDataForRow(officeExpenseCategoryID: number): void {
    if (!officeExpenseCategoryID) return;

    this.api
      .callApi(this.constant.GETALLOFFICEEXPENSEHEAD, { officeExpenseCategoryID, companyMasterID: this.transactionData.companyMasterID }, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status === 200) {
          this.officeExpenseHead = res.data;
        }
      });
  }

  getOfficeExpenseCategory() {
    const companyMasterID = this.reapplyOfficeExpense?.value.company ? this.reapplyOfficeExpense?.value.company : localStorage.getItem('company_id');
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

  cancel() {
    this.spinner.start('CANCEL')
    this.router.navigate([this.adminRoot + '/finances/officeExpense']).then(() => {
      this.modalService.refreshUserRequestStatus();
      this.spinner.stop('CANCEL');
    });
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('oldExpenseTransID', this.transactionData.officeExpenseTransactionID);
    formData.append('expenseAmount', this.reapplyOfficeExpense.value.expenseAmount);
    formData.append('description', this.reapplyOfficeExpense.value.description);
    formData.append('filesTobeRemoved', this.filesTobeRemoved.join(','));

    if (this.transactionData?.attachments && this.transactionData.attachments.length > 0) {
      this.transactionData.attachments.forEach((file, fileIndex) => {
        const isNew = this.transactionData?.isNewAttachmentFlags?.[fileIndex];

        if (file && typeof file === 'object') {
          formData.append(`attachFile`, file);
        } else if (file && typeof file === 'string' && file !== 'null' && file !== '') {
          formData.append(`attachFile${fileIndex + 1}`, file);
        }

        formData.append(fileIndex === 0 ? `isNewAttachment` : `isNewAttachment${fileIndex + 1}`, isNew ? 'true' : 'false');
      });
    } else {
      formData.append(`isNewAttachment`, 'false');
    }

    this.spinner.start('GETALLOFFICEEXPENSEALLOCATIONRIGHTS');
    this.api.callApi(this.constant.REAPPLYOFFICEEXPENSE, formData, 'POST', false, true, true).subscribe(
      (res: any) => {
        if(res.status == 200){
          this.allSites = res.data;
          this.commonNotificationService.handleSuccess(res.message);
        }
        this.spinner.stop('GETALLOFFICEEXPENSEALLOCATIONRIGHTS');
        this.commonNotificationService.handleSuccess(res.message);
        this.cancel()
      },
      (err) => {
        this.spinner.stop('GETALLOFFICEEXPENSEALLOCATIONRIGHTS');
        this.commonNotificationService.handleError(err.error.message)
      },
    )
  }

  view(attachment: any) {
    window.open(this.apiURL + attachment, '_blank');
  }

  showImage(data: string) {
    if (data && data != null && data != 'null' && !String(data)?.includes('.pdf')) {
      return true;
    } else {
      return false;
    }
  }

  addAttachment() {
    // Ensure attachments array exists
    if (!this.transactionData.attachments) {
      this.transactionData.attachments = [];
    }

    // Ensure flags array exists
    if (!this.transactionData.isNewAttachmentFlags) {
      this.transactionData.isNewAttachmentFlags = [];
    }

    // Add placeholder for new attachment
    this.transactionData.attachments.push(null);

    // Set flag to false initially; it will become true on file select
    this.transactionData.isNewAttachmentFlags.push(false);
    this.cdr.detectChanges()
  }

  // Remove a specific attachment slot
  removeAttachment(j: number) {
    const removed = this.transactionData.attachments[j];

    this.transactionData.attachments.splice(j, 1);
    if (removed && typeof removed === 'string') {
      this.filesTobeRemoved.push(removed);
    }

    this.transactionData.attachments = [...this.transactionData.attachments];

    if (this.transactionData.isNewAttachmentFlags) {
      this.transactionData.isNewAttachmentFlags.splice(j, 1);
    }
    this.cdr.detectChanges()
  }

  // Handle file input changes and update attachments
  onFileChangeAll(event: any, j: number) {
    const file = event.target.files?.[0] ?? null;

    if (!this.transactionData.attachments) {
      this.transactionData.attachments = [];
    }

    const existing = this.transactionData.attachments[j];

    this.transactionData.attachments[j] = file;

    if (existing && typeof existing === 'string') {
      this.filesTobeRemoved.push(existing);
    }

    if (!this.transactionData.isNewAttachmentFlags) {
      this.transactionData.isNewAttachmentFlags = [];
    }

    // Ensure array is the correct length
    while (this.transactionData.isNewAttachmentFlags.length < this.transactionData.attachments.length) {
      this.transactionData.isNewAttachmentFlags.push(false);
    }

    this.transactionData.isNewAttachmentFlags[j] = true;
  }

  trackByFn(index: number, item: any): number {
    return index;
  }

}
