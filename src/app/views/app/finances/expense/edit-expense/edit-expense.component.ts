import { Component, ViewChild, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { CommonUtils } from 'src/app/utils/common.utils';

@Component({
    selector: 'app-edit-expense',
    templateUrl: './edit-expense.component.html',
    styleUrls: ['./edit-expense.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditExpenseComponent implements OnInit {
  @ViewChild('editexpense') editexpense: NgForm;
  adminRoot = environment.adminRoot;

  allExpenseData = [];

  expenseHeadData: any;
  expensedata: any;
  formValue: any;
  image: any;
  image2: any;
  showAttachment2: boolean = false;
  apiURL = environment.apiUrl;
  expensecategory: any;
  tourdata: any = [];
  visitdata: any = [];
  projectData: any = [];
  filesTobeRemoved: any[] = [];
  currDate: any = new Date().toISOString().slice(0, 10);
  minDate: any;
  expenseDatePicker: number;
  permissionedit: any = [];
  permissiondelete: any = [];
  permissioncreate: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
    private changeDetectRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.getexpensecategory();
    this.editdata();
    this.companydata()
    this.checkpermission()
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
          if (this.formValue?.ListExpenseComponent?.body?.navigatedFrom == 'ExpenserequestComponent') {
            this.permissiondelete = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'ExpenseRequest' &&
                permissionval.operationName.includes('Delete')
              );
            });
            this.permissionedit = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'ExpenseRequest' &&
                permissionval.operationName.includes('Edit')
              );
            });
          } else {
            this.permissiondelete = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'Expense' && permissionval.operationName.includes('Delete')
              );
            });
            this.permissionedit = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'Expense' && permissionval.operationName.includes('Edit')
              );
            });
            this.permissioncreate = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'Expense' && permissionval.operationName.includes('Create')
              );
            });
          }
          this.spinner.stop();
        }
      });
  }

  companydata() {
    let companyid = localStorage.getItem('company_id');
    this.api
      .callApi(this.constant.VIEWCOMPANYDATA + companyid, {}, 'GET', false, true, true)
      .subscribe((res: any) => {
        this.minDate = CommonUtils.getDateBeforeNDays(+res.data.expenseDatePicker);
        if (res.data.expenseDatePicker) {
          this.minDate = CommonUtils.getDateBeforeNDays(res.data.expenseDatePicker);
        } else {
          this.minDate = CommonUtils.getDateBeforeNDays(30);
        }
        this.expenseDatePicker = +res.data.expenseDatePicker;
      });
  }

  editdata() {
    const body = {
      userExpenseID: +this.formValue.ListExpenseComponent.id,
    };
    this.spinner.start('editExpense');
    this.api.callApi(this.constant.GETUSEREXPENSEBYID, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.expensedata = res.data;

          this.expensedata?.userExpenseTransactions.forEach((val: any, index: number) => {
            const obj = this.expensedata.userExpenseTransactions[index];

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

            // Optional flags to show additional attachment inputs in the UI
            obj.showAttachment2 = !!val.attachFile2;
            obj.showAttachment3 = !!val.attachFile3;
            obj.showAttachment4 = !!val.attachFile4;

            // Initialize dropdown values
            this.onCategoryChange(val.expenseHead.expenseCategoryId, index);
            this.onExpenseHeadChange(val.expenseHead.expenseHeadId, index);
          });
          this.expensedata.transactionLength = this.expensedata.userExpenseTransactions.filter(
            (x) => !x.isDeleted,
          )?.length;

          if (this.expensedata.ToursMasterID) {
            this.expensedata.ToursMasterID = +this.expensedata.ToursMasterID;
            this.getUserTourdata();
          }
          if (this.expensedata.visitID) {
            this.getUserVisitData();
          }
          if (this.expensedata.projectID) {
            this.getUserProjectData();
          }
        } else {
          this.commonNotificationService.handleError(res.message);
        }
        this.spinner.stop('editExpense');
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('editExpense');
      },
    );
  }

  onSubmit() {
    if (!this.editexpense.valid) {
      return;
    }
    const negativeData = this.expensedata.userExpenseTransactions.find((e) => !e.isDeleted && e.expenseAmount <= 0);
    if (negativeData) {
      return this.commonNotificationService.handleWarning('Expense Amount Can not be Negative or Zero');
    }
    const formData = new FormData();
    formData.append(`userExpenseID`, this.formValue.ListExpenseComponent.id);
    formData.append('filesTobeRemoved', this.filesTobeRemoved.join(','));
    this.expensedata.userExpenseTransactions.forEach((value: any, index: number) => {
      if (value.isDeleted && value.isAdded) {
        return;
      } else {
        formData.append(`expenseHeadId${index}`, value.expenseHead.expenseHeadId);
        if (value?.expensePriceRuleID) {
          formData.append(`expensePriceRuleID${index}`, value?.expensePriceRuleID);
        }
        if (value?.authorizationStatus) {
          formData.append(`authorizationStatus${index}`, value?.authorizationStatus);
        }
        formData.append(`expenseAmount${index}`, value?.expenseAmount);
        formData.append(`description${index}`, value.description);
        if (!value.isAdded)
          formData.append(`userExpenseTransactionID_${index}`, value.userExpenseTransactionID);

        formData.append(`isRemoved_${index}`, value.isDeleted);
        formData.append(`isNewAdded_${index}`, value.isAdded);
        if (value?.attachments && value.attachments.length > 0) {
          value.attachments.forEach((file, fileIndex) => {
            const isNew = value?.isNewAttachmentFlags?.[fileIndex];

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

    this.spinner.start('submit');
    this.api
      .callApi(this.constant.UPDATEBYUSEREXPENSEID, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.commonNotificationService.handleSuccess(res.message);
            setTimeout(() => {
              if (
                this.formValue?.ListExpenseComponent?.body?.navigatedFrom ==
                'ExpenserequestComponent'
              ) {
                this.router.navigate([this.adminRoot + '/finances/expense_request']).then(() => {
                  this.spinner.stop('submit');
                });
              } else {
                this.router.navigate([this.adminRoot + '/finances/expense']).then(() => {
                  this.spinner.stop('submit');
                });
              }
            }, 3000);
          } else {
            this.commonNotificationService.handleError(res.message);

            this.spinner.stop('submit');
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.spinner.stop('submit');
        },
      );
  }
  // getExpenseHeadData() {
  //   this.spinner.start('expenseHeadData');
  //   this.api
  //     .callApi(
  //       this.constant.VIEWEXPENSEHEADDATABYCATEGORY +
  //       this.expensedata?.userExpense?.expenseCategoryId,
  //       {},
  //       'GET',
  //       true,
  //       false,
  //       true,
  //     )
  //     .subscribe((res: any) => {
  //       if (res.status == 200) {
  //         this.expenseHeadData = res.data;
  //       }
  //       this.spinner.stop('expenseHeadData');
  //     });
  // }

  onCategoryChange(categoryId: number, rowIndex: number): void {
    this.getExpenseHeadDataForRow(categoryId, rowIndex);
  }

  getExpenseHeadDataForRow(categoryId: number, rowIndex: number): void {
    if (!categoryId) return;

    this.api
      .callApi(
        this.constant.VIEWEXPENSEHEADDATABYCATEGORY + categoryId,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status === 200) {
          this.expensedata.userExpenseTransactions[rowIndex].filteredExpenseHeads = res.data;
          // this.expensedata.userExpenseTransactions[rowIndex].expenseHeadId = null; // reset head
        }
      });
  }

  onFileChange(event: any, index: number) {
    this.image = null;

    if (event.target.files && event.target.files.length > 0) this.image = event.target.files[0];
    else this.image = null;

    this.expensedata.userExpenseTransactions[index].isNewAttachment = true;
    this.expensedata.userExpenseTransactions[index].attachFile = this.image;
  }
  onFileChange1(event: any, index: number) {
    this.image2 = null;

    if (event.target.files && event.target.files.length > 0) this.image2 = event.target.files[0];
    else this.image2 = null;

    this.expensedata.userExpenseTransactions[index].attachFile2 = this.image2;
    this.expensedata.userExpenseTransactions[index].isNewAttachment2 = true;
  }

  removeAttachmentvalue(index: number) {
    this.expensedata.userExpenseTransactions[index].showAttachment2 = false;
    this.expensedata.userExpenseTransactions[index].attachFile2 = '';
  }
  addAttachmentvalue(index: number) {
    this.expensedata.userExpenseTransactions[index].showAttachment2 = true;
  }

  view(attachment) {
    window.open(this.apiURL + attachment, '_blank');
  }

  showImage(data: string) {
    if (typeof data == 'object') return;
    if (data && data != null && data != 'null' && !data.endsWith('.pdf')) {
      return true;
    } else {
      return false;
    }
  }
  onExpenseHeadChange(event: any, index: number) {
    this.expensedata.userExpenseTransactions[index].expensePriceRuleID = null;
    this.expensedata.userExpenseTransactions[index].rule = null
    if (!event) return

    this.spinner.start();
    this.api
      .callApi(this.constant.GETEXPENSEPRICEBYHEAD + event, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.expensedata.userExpenseTransactions[index].expensePriceRuleID = res.data
            ?.expensePriceRuleID
            ? res.data?.expensePriceRuleID
            : null;
          this.expensedata.userExpenseTransactions[index].rule = res.data?.rule ? res.data?.rule : null;

          this.spinner.stop();
        }
      });
  }

  cancel() {
    // this.router.navigate([this.adminRoot + '/finances/expense']);
    if (this.formValue?.ListExpenseComponent?.body?.navigatedFrom == 'ExpenserequestComponent') {
      this.router.navigate([this.adminRoot + '/finances/expense_request']);
    } else {
      this.router.navigate([this.adminRoot + '/finances/expense']);
    }
  }

  getexpensecategory() {
    this.spinner.start('expenseCategory');
    this.api
      .callApi(
        this.constant.EXPENSECATEGORYBYCOMPANYDATA1 + localStorage.getItem('company_id'),
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.expensecategory = res.data;
          this.spinner.stop('expenseCategory');
        }
      });
  }

  getUserTourdata() {
    this.spinner.start('tourData');
    let body = {
      userMasterID: +localStorage.getItem('id'),
      page: '',
      limit: '',
    };
    this.api
      .callApi(this.constant.GETTOURDATA, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.tourdata = res.data;
          this.spinner.stop('tourData');
        }
      });
  }

  getUserVisitData() {
    this.spinner.start('visitData');
    this.api
      .callApi(
        this.constant.VIEWVISITBYASSIGN + localStorage.getItem('id'),
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.visitdata = res.data;
          this.expensedata.visitDate = this.visitdata.find(
            (x) => x.visitID == this.expensedata.visitID,
          )?.visitDate;
          this.expensedata.visitDate = new Date(this.expensedata.visitDate)
            .toISOString()
            .split('T')[0];
          this.spinner.stop('visitData');
        }
      });
  }

  getUserProjectData() {
    const filterData = {
      userMasterID: +localStorage.getItem('id'),
    };
    this.spinner.start('projectData');
    this.api
      .callApi(this.constant.GETALLEMPLOYEEPROJECT, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.projectData = res.data;
          this.spinner.stop('projectData');
        }
      });
  }

  addTransaction(): void {
    this.expensedata?.userExpenseTransactions?.push({
      expenseCategoryId: null,
      expenseHead: {
        expenseHeadId: null,
      },
      expenseAmount: null,
      description: '',
      attachments: [null],
      attachFile: null,
      attachFile2: null,
      showAttachment2: false,
      isDeleted: false,
      isAdded: true,
      filteredExpenseHeads: [],
      authorizationStatus: '0'
    });
    this.expensedata.transactionLength = this.expensedata.userExpenseTransactions.filter(
      (x) => !x.isDeleted,
    )?.length;

    this.expensedata.userExpenseTransactions = this.expensedata?.userExpenseTransactions;
  }

  removeTransaction(i) {
    this.expensedata.userExpenseTransactions[i].isDeleted = true;
    if (this.expensedata.userExpenseTransactions[i].isAdded) {
      this.expensedata.userExpenseTransactions[i].authorizationStatus = '3';
    }
    this.expensedata.transactionLength = this.expensedata.userExpenseTransactions.filter(
      (x) => !x.isDeleted,
    );
    this.expensedata.transactionLength = this.expensedata.transactionLength.length;
    // this.expensedata.transactionLength = this.expensedata.userExpenseTransactions.map((x) => !x.isDeleted)?.length;
    // this.expensedata.userExpenseTransactions = this.expensedata.userExpenseTransactions.filter((e) => e.isDeleted && e.isAdded);
  }

  // Add attachment slot
  // TrackBy function to avoid DOM reuse issues
  trackByFn(index: number, item: any): number {
    return index;
  }

  addAttachment(index: number) {
    const transaction = this.expensedata.userExpenseTransactions[index];

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
    this.changeDetectRef.detectChanges()
  }

  removeAttachment(i: number, j: number) {
    const transaction = this.expensedata.userExpenseTransactions[i];
    const removed = transaction.attachments[j];

    transaction.attachments.splice(j, 1);
    if (removed && typeof removed === 'string') {
      this.filesTobeRemoved.push(removed);
    }

    this.expensedata.userExpenseTransactions[i].attachments = [...transaction.attachments];

    if (transaction.isNewAttachmentFlags) {
      transaction.isNewAttachmentFlags.splice(j, 1);
    }
    this.changeDetectRef.detectChanges()
  }

  onFileChangeAll(event: any, i: number, j: number) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      this.commonNotificationService.handleWarning('Only PDF, JPG, JPEG, and PNG files are allowed.');
      input.value = ''; // Reset the file input
      return;
    }
    const transaction = this.expensedata.userExpenseTransactions[i];

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

  checkAddMore() {
    const difference = CommonUtils.calculateDateDifferenceInDays(
      new Date(this.currDate),
      new Date(this.expensedata?.expense_date),
    );

    const days = this.expenseDatePicker ? this.expenseDatePicker : 30
    return difference > days ? false : true;
  }

  isSubmitDisabled() {
    const index = this.expensedata?.userExpenseTransactions?.findIndex((x) => x.authorizationStatus == '0' || x.authorizationStatus == '1' || x.authorizationStatus == '2');
    return index != -1 ? false : true;
  }

  checkDisableByAuth(row: any) {
    const isPendingArray = row?.expenseAuthorizations?.map((x) => x.authstatus == 2);
    if (isPendingArray?.length > 0) {
      return isPendingArray.includes(false) ? true : false;
    } else {
      return row.authorizationStatus == '3' || row.authorizationStatus == '4' ? true : false
    }
  }

  navigateToReapplyPage(userExpenseTransactionID: any): void {
    this.formValueStorageService.navigate(
      'ListExpenseComponent',
      {},
      '/finances/reapply',
      userExpenseTransactionID,
    );
  }
}
