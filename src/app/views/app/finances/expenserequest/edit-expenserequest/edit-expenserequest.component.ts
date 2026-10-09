import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
@Component({
    selector: 'app-edit-expenserequest',
    templateUrl: './edit-expenserequest.component.html',
    styleUrls: ['./edit-expenserequest.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditExpenserequestComponent implements OnInit {
  @ViewChild('editexpense') editexpense: NgForm;
  adminRoot = environment.adminRoot;
  apiUrl = environment.apiUrl;

  file: any;
  format: any;
  url: any;
  url2: any;
  displayFile: any;
  displayFile2: any;
  usertype: any;
  company_id: any;
  values = [];
  purpose1: any;
  expensecategory: any;
  expensehead: any;
  expenseheadprice: any = [];
  expensedata: any;
  formValue: any;
  showAttachment2: boolean = false
  tourdata: any = [];
  visitdata: any = [];
  projectData: any = [];


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.getexpensecategory();
    this.editdata();
  }

  editdata() {
    this.api
      .callApi(
        this.constant.GETBYIDEXPENSE + this.formValue.ExpenserequestComponent.id,
        {},
        'GET',
        true,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.expensedata = res.data;
            this.expensedata.isNewAttachment = false;
            this.expensedata.isNewAttachment2 = false;
            if (this.expensedata.attachFile2 && this.expensedata.attachFile2 != '' && this.expensedata.attachFile2 != 'null') {
              this.showAttachment2 = true;
            }
            this.category();
            this.onChange(this.expensedata.expenseHeadId);
            if (this.expensedata.userExpense.ToursMasterID) {
              this.expensedata.userExpense.ToursMasterID = +this.expensedata.userExpense.ToursMasterID;
              this.getUserTourdata()
            }
            if (this.expensedata.userExpense.visitID) {
              this.getUserVisitData()
            }
            if (this.expensedata.userExpense.projectID) {
              this.getUserProjectData()
            }
          } else {
            this.commonNotificationService.handleError(res.message)

            this.spinner.stop();
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message)

          this.spinner.stop();
        },
      );
  }

  onSubmit() {
    if (!this.editexpense.valid) {
      return;
    }
    if (this.editexpense.value.expenseAmount < 0) {
      return this.commonNotificationService.handleWarning('Expense Amount Can not be Negative');
    }
    const formData = new FormData();
    formData.append(`userExpenseTransactionID`, this.formValue.ExpenserequestComponent.id);
    formData.append(`expenseAmount`, this.editexpense.value.expenseAmount);

    if (this.expensedata.attachFile && this.expensedata.attachFile != 'null' && this.expensedata.attachFile != null && this.expensedata.attachFile != '') {
      formData.append(`attachFile`, this.expensedata.attachFile);
    }
    formData.append(`isNewAttachment`, this.expensedata.isNewAttachment);
    formData.append(`isNewAttachment2`, this.expensedata.isNewAttachment2);

    formData.append(`description`, this.editexpense.value.description);
    formData.append(`expenseHeadId`, this.editexpense.value.expenseHeadId);
    formData.append(`expensePriceRuleID`, this.expensedata.expensePriceRuleID);

    if (this.expensedata.attachFile2 && this.expensedata.attachFile2 != 'null' && this.expensedata.attachFile2 != null && this.expensedata.attachFile2 != '') {
      if (this.expensedata.isNewAttachment2) {
        formData.append(`attachFile`, this.expensedata.attachFile2);
      } else {
        formData.append(`attachFile2`, this.expensedata.attachFile2);
      }
    } else {
      formData.append(`attachFile2`, '');
    }

    this.spinner.start('onUpdate');
    this.api.callApi(this.constant.EDITAUTHRIZATIONBYIDEXPENSE_V2, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message)
          setTimeout(() => {
            this.spinner.stop('onUpdate');
            this.router.navigate([this.adminRoot + '/finances/expense_request']).then(() => {
              this.spinner.stop('onUpdate');
            });
          }, 3000);
        } else {
          this.commonNotificationService.handleError(res.message)

          this.spinner.stop('onUpdate');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)

        this.spinner.stop('onUpdate');
      },
    );
  }

  onSelectFile(event: any, i) {
    const file: File = event.target.files?.[0];
    if (!file) return;

    this.url = file;
    this.expensedata.attachFile = file;
    this.expensedata.isNewAttachment = true;
  }

  onSelectFile2(event: any, i) {
    const file = event.target.files?.[0];
    if (!file) return;

    this.url2 = file;
    this.expensedata.attachFile2 = file;
    this.expensedata.isNewAttachment2 = true;
  }
  category() {
    this.api
      .callApi(
        this.constant.VIEWEXPENSEHEADDATABYCATEGORY +
        this.expensedata.userExpense.expenseCategoryId,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.expensehead = res.data;
        }
      });
  }
  onChange(event) {
    this.expenseheadprice = [];
  }

  addAttachmentvalue() {
    this.showAttachment2 = true
  }

  removeAttachmentvalue() {
    this.expensedata.attachFile2 = null;
    this.showAttachment2 = false
  }

  view(attachment) {
    window.open(this.apiUrl + attachment, '_blank');
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
          console.log(res, 'res')
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
          this.expensedata.visitDate = this.visitdata.find(x => x.visitID == this.expensedata.userExpense.visitID)?.visitDate;
          this.expensedata.visitDate = new Date(this.expensedata.visitDate).toISOString().split('T')[0];
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

  showImage(data: string) {
    if (typeof data == 'object') return;
    if (data && data != null && data != 'null' && !data.endsWith('.pdf')) {
      return true;
    } else {
      return false;
    }
  }
}
