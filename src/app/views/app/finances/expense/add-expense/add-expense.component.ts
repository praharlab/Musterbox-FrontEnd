import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ModalService } from 'src/app/services/modal.service';
import { expenseTypeArray, expenseTypes } from 'src/app/constants/commonVariables';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { CommonUtils } from 'src/app/utils/common.utils';
import { labelUtils } from 'src/app/constants/labelUtils';

@Component({
    selector: 'app-add-expense',
    templateUrl: './add-expense.component.html',
    styleUrls: ['./add-expense.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddExpenseComponent implements OnInit {
  @ViewChild('addexpense') addexpense: NgForm;
  adminRoot = environment.adminRoot;

  file: any;
  format: any;
  url: any;
  product: any = [];
  usertype: any;
  company_id: any;
  values = [];
  tourdata: any = [];
  visitdata: any = [];
  projectData: any = [];
  expensePurpose: any = null;
  showExpensePurposeRow = labelUtils.showExpensePurpose;
  expensecategory: any;
  expensehead: any = [];
  expenseheadprice: any = [];
  expenseTypeArrayData: any = expenseTypeArray;
  expenseTypesObj: any = expenseTypes;
  selectedTour: any = null;
  selectedVisit: any = null;
  selectedProject: any = null;
  image: any;
  image2: any;
  selectedPurpose: any;
  selectedExpenseDate: any;
  companyData: any;
  currDate: any = new Date().toISOString().slice(0, 10);
  minDate: any;
  selectedVisitDate: any;
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private modalService: ModalService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    if (!this.showExpensePurposeRow) {
      this.expensePurpose = this.expenseTypesObj.PROJECT;
      this.getUserProjectData();
      this.addTransaction();
    }
    this.getexpensecategory();
    this.companydata();
  }
  companydata() {
    let companyid = localStorage.getItem('company_id');
    this.api
      .callApi(this.constant.VIEWCOMPANYDATA + companyid, {}, 'GET', false, true, true)
      .subscribe((res: any) => {
        this.companyData = res.data;
        if (this.companyData.expenseDatePicker) {
          this.minDate = CommonUtils.getDateBeforeNDays(+this.companyData.expenseDatePicker);
        } else {
          this.minDate = CommonUtils.getDateBeforeNDays(30);
        }
        this.selectedExpenseDate = this.currDate;
      });
  }
  removeTransaction(i) {
    this.values[i].isDeleted = true;
    this.values = this.values.filter((e) => !e.isDeleted);
  }
  removeAttachmentvalue(i) {
    this.values[i].showAttachment2 = false;
    this.values[i].isattachment2 = false;
    this.values[i].attachFile2 = '';
  }
  addAttachmentvalue(i) {
    this.values[i].showAttachment2 = true;
    this.values[i].isattachment2 = true;
    this.values[i].attachFile2 = '';
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

  onCategoryChange(categoryId: number, rowIndex: number): void {
    this.getExpenseHeadDataForRow(categoryId, rowIndex);
  }
  getExpenseHeadDataForRow(categoryId: number, rowIndex: number): void {
    if (!categoryId) return;

    this.api
      .callApi(this.constant.VIEWEXPENSEHEADDATABYCATEGORY + categoryId, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status === 200) {
          this.values[rowIndex].filteredExpenseHeads = res.data;
          this.values[rowIndex].expenseHeadId = null; // reset head
        }
      });
  }

  onSubmit() {
    if (!this.addexpense.valid) {
      return;
    }
    if (
      +this.companyData.expenseDatePicker <
      CommonUtils.getDaysBefore(this.addexpense.value.expense_date)
    ) {
      return this.commonNotificationService.handleWarning(
        `You cannot apply expense after ${+this.companyData.expenseDatePicker} days.`,
      );
    }
    if (this.currDate < this.addexpense.value.expense_date) {
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
    formData.append(
      `visitID`,
      this.expensePurpose == this.expenseTypesObj.VISIT ? this.addexpense.value.visitID : null,
    );
    formData.append(
      `ToursMasterID`,
      this.expensePurpose == this.expenseTypesObj.TOUR ? this.addexpense.value.ToursMasterID : null,
    );
    formData.append(
      `projectID`,
      this.expensePurpose == this.expenseTypesObj.PROJECT ? this.addexpense.value.projectID : null,
    );
    formData.append(`userMasterID`, localStorage.getItem('id'));
    formData.append(`expense_date`, this.addexpense.value.expense_date);

    this.values.forEach((element, index) => {
      formData.append(`expenseHeadId${index}`, element.expenseHeadId);
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
    this.api.callApi(this.constant.CREATEEXPENSE_V2, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.spinner.stop();
            this.router.navigate([this.adminRoot + '/finances/expense']).then(() => {
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

  onExpensePurposeChange(event) {
    this.expensePurpose = event.target.value;
    this.selectedVisit = null;
    this.visitdata = [];
    this.selectedProject = null;
    this.projectData = [];
    this.selectedTour = null;
    this.tourdata = [];
    this.selectedExpenseDate = this.currDate;
    this.selectedVisitDate = this.currDate;
    if (this.values.length == 0)
      this.addTransaction();

    if (this.expensePurpose == this.expenseTypesObj.TOUR) {
      this.getUserTourdata();
    } else if (this.expensePurpose == this.expenseTypesObj.VISIT) {
      this.getUserVisitData();
    } else if (this.expensePurpose == this.expenseTypesObj.PROJECT) {
      this.getUserProjectData();
    }
  }
  onExpenseDateChange(newDate: string) {
    this.selectedExpenseDate = newDate;
    this.selectedTour = null;
    this.selectedProject = null;
    this.selectedVisit = null;
  }
  getUserTourdata() {
    this.spinner.start();
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

          this.spinner.stop();
        }
      });
  }

  getUserVisitData() {
    if (!this.selectedVisitDate) return
    const body = {
      date: this.selectedVisitDate,
      userMasterID: +localStorage.getItem('id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETVISITBYUSERID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.visitdata = res.data;

          this.spinner.stop();
        }
      });
  }

  getUserProjectData() {
    const filterData = {
      userMasterID: +localStorage.getItem('id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLEMPLOYEEPROJECT, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.projectData = res.data;
          this.spinner.stop();
        }
      });
  }

  getexpensecategory() {
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

          this.spinner.stop();
        }
      });
  }

  getExpenseHeadData(event) {
    this.values = [];
    this.expensehead = [];
    if (!event) return;
    this.api
      .callApi(this.constant.VIEWEXPENSEHEADDATABYCATEGORY + event, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.expensehead = res.data;
          this.addTransaction();
          this.spinner.stop();
        }
      });
  }

  onFileChange(event: any, i) {
    this.image = null;

    if (event.target.files && event.target.files.length > 0) this.image = event.target.files[0];
    else this.image = null;

    this.values[i].attachFile = this.image;
    this.values[i].isattachment = true;
  }

  onFileChange1(event: any, i) {
    this.image2 = null;

    if (event.target.files && event.target.files.length > 0) this.image2 = event.target.files[0];
    else this.image2 = null;

    this.values[i].attachFile2 = this.image2;
    this.values[i].isattachment2 = true;
  }

  onExpenseHeadChange(event, i) {
    this.values[i].expensePriceRuleID = null;
    const index = this.values[i].filteredExpenseHeads.findIndex(x => event.expenseHeadId == x.expenseHeadId);
    this.values[i].expenseHeadName = this.values[i].filteredExpenseHeads[index]?.expenseHead;
    this.spinner.start();
    this.api
      .callApi(this.constant.GETEXPENSEPRICEBYHEAD + event.expenseHeadId, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.values[i].expensePriceRuleID = res.data?.expensePriceRuleID ? res.data?.expensePriceRuleID : null;
          this.values[i].rule = res.data?.rule ? res.data?.rule : null;
          this.spinner.stop();
        }
      });
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
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      this.commonNotificationService.handleWarning('Only PDF, JPG, JPEG, and PNG files are allowed.');
      input.value = ''; // Reset the file input
      return;
    }
    // const file = event.target.files?.[0] ?? null;
    if (!this.values[i].attachments) {
      this.values[i].attachments = [];
    }
    this.values[i].attachments[j] = file;
  }


}
