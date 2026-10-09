import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ModalService } from 'src/app/services/modal.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';

@Component({
    selector: 'app-reapply',
    templateUrl: './reapply.component.html',
    styleUrls: ['./reapply.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ReapplyComponent implements OnInit {
  @ViewChild('editexpense') editexpense: NgForm;
  adminRoot = environment.adminRoot;

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
  filesTobeRemoved: string[] = [];
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private modalService: ModalService,
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
        this.constant.GETBYIDEXPENSE + this.formValue.ListExpenseComponent.id,
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

            this.expensedata.attachments = []
            this.expensedata.isNewAttachmentFlags = [];

            if (this.expensedata.attachFile) {
                this.expensedata.attachments.push(this.expensedata.attachFile);
                this.expensedata.isNewAttachmentFlags.push(false);
              }
              if (this.expensedata.attachFile2) {
                this.expensedata.attachments.push(this.expensedata.attachFile2);
                this.expensedata.isNewAttachmentFlags.push(false);
              }
              if (this.expensedata.attachFile3) {
                this.expensedata.attachments.push(this.expensedata.attachFile3);
                this.expensedata.isNewAttachmentFlags.push(false);
              }
              if (this.expensedata.attachFile4) {
                this.expensedata.attachments.push(this.expensedata.attachFile4);
                this.expensedata.isNewAttachmentFlags.push(false);
              }
            if (this.expensedata.attachFile2) {
              this.showAttachment2 = true;
            }
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
            this.getExpenseHeadData();
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
  onSubmit() {
    if (!this.editexpense.valid) {
      return;
    }
    if (this.editexpense.value.expenseAmount < 0) {
      return this.commonNotificationService.handleWarning('Expense Amount Can not be Negative');
    }
    let version;
    if (this.expensedata.version == null) {
      version = 1;
    } else {
      version = Number(this.expensedata.version) + 1;
    }

    const formData = new FormData();
    formData.append(`oldExpenseTransID`, this.expensedata.userExpenseTransactionID);
    formData.append(`userExpenseID`, this.expensedata.userExpenseID);
    formData.append(`expenseAmount`, this.editexpense.value.expenseAmount);
    // if (this.expensedata.attachFile && this.expensedata.attachFile != 'null' && this.expensedata.attachFile != null && this.expensedata.attachFile != '') {
    //   formData.append(`attachFile`, this.expensedata.attachFile);
    // }
    // formData.append(`isNewAttachment`, this.expensedata.isNewAttachment);
    // formData.append(`isNewAttachment2`, this.expensedata.isNewAttachment2);
    formData.append(`description`, this.editexpense.value.description);
    formData.append(`expenseHeadId`, this.expensedata.expenseHeadId);
    if(this.expensedata?.expensePriceRuleID != '' && this.expensedata?.expensePriceRuleID != null)
    formData.append(`expensePriceRuleID`, this.expensedata?.expensePriceRuleID);
    formData.append(`version`, version);
    formData.append(`userMasterID`, localStorage.getItem('id'));
    formData.append('filesTobeRemoved', this.filesTobeRemoved.join(','));

    if (this.expensedata.attachments && this.expensedata.attachments.length > 0) {
    this.expensedata.attachments.forEach((file, index) => {
      const isNew = this.expensedata.isNewAttachmentFlags?.[index];

      if (file && typeof file === 'object') {
        // New file upload
        formData.append(`attachFile`, file);
      } else if (file && typeof file === 'string' && file !== 'null' && file !== '') {
        // Existing file reference
        formData.append(`attachFile${index === 0 ? '' : index + 1}`, file);
      }

      // Attachment exists flag
      formData.append(`isattachment${index === 0 ? '' : index + 1}`, 'true');

      // New upload flag
      formData.append(`isNewAttachment${index === 0 ? '' : index + 1}`, isNew ? 'true' : 'false');
    });
  } else {
    // No attachments
    formData.append(`isattachment`, 'false');
    formData.append(`isNewAttachment`, 'false');
  }

    // if (this.expensedata.attachFile2 && this.expensedata.attachFile2 != 'null' && this.expensedata.attachFile2 != null && this.expensedata.attachFile2 != '') {
    //   if (this.expensedata.isNewAttachment2) {
    //     formData.append(`attachFile`, this.expensedata.attachFile2);
    //   } else {
    //     formData.append(`attachFile2`, this.expensedata.attachFile2);
    //   }
    // } else {
    //   formData.append(`attachFile2`, '');
    // }
    this.spinner.start();
    this.api.callApi(this.constant.REAPPLYEXPENSE_V2, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.modalService.refreshUserRequestStatus();
            this.spinner.stop();
            this.router.navigate([this.adminRoot + '/finances/expense']).then(() => {
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

  onCategoryChange($event, i){
    this.getExpenseHeadData($event, true)
  }

  getExpenseHeadData(categoryId?: any, isCatID: boolean = false) {
    const id = isCatID ? categoryId : this.expensedata.expenseHead.expenseCategoryId
    this.api
      .callApi(
        this.constant.VIEWEXPENSEHEADDATABYCATEGORY + id,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.expenseHeadData = res.data;
          if(isCatID && categoryId)
          this.expensedata.expenseHeadId = null
        }
      });
  }

  onFileChange(event: any) {
    this.image = null;

    if (event.target.files && event.target.files.length > 0) this.image = event.target.files[0];
    else this.image = null;

    this.expensedata.attachFile = this.image;
    this.expensedata.isNewAttachment = true;
  }

  onFileChange1(event: any) {
    this.image2 = null;

    if (event.target.files && event.target.files.length > 0) this.image2 = event.target.files[0];
    else this.image2 = null;

    this.expensedata.attachFile2 = this.image2;
    this.expensedata.isNewAttachment2 = true;
  }

  removeAttachmentvalue() {
    this.showAttachment2 = false;
    this.expensedata.attachFile2 = '';
  }
  addAttachmentvalue() {
    this.showAttachment2 = true;
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
          this.expensedata.visitDate = this.visitdata.find(x => x.visitID == this.expensedata.userExpense.visitID)?.visitDate ? this.visitdata.find(x => x.visitID == this.expensedata.userExpense.visitID)?.visitDate : '';
          if(this.expensedata.visitDate && this.expensedata.visitDate != ''){
            this.expensedata.visitDate = new Date(this.expensedata.visitDate).toISOString().split('T')[0];
          }
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

  trackByFn(index: number, item: any): number {
  return index;
}

addAttachment() {
  // const transaction = this.expensedata.userExpenseTransactions[index];

  // Ensure attachments array exists
  if (!this.expensedata.attachments) {
    this.expensedata.attachments = [];
  }

  // Ensure flags array exists
  if (!this.expensedata.isNewAttachmentFlags) {
    this.expensedata.isNewAttachmentFlags = [];
  }

  // Add placeholder for new attachment
  this.expensedata.attachments.push(null);

  // Set flag to false initially; it will become true on file select
  this.expensedata.isNewAttachmentFlags.push(false);
}


removeAttachment(j: number) {
  const existing = this.expensedata.attachments[j];
  this.expensedata.attachments.splice(j, 1);
  this.expensedata.attachments = [...this.expensedata.attachments]

  if (existing && typeof existing === 'string') {
      this.filesTobeRemoved.push(existing);
    }
  
  if (this.expensedata.isNewAttachmentFlags) {
    this.expensedata.isNewAttachmentFlags.splice(j, 1);
  }
}

onFileChangeAll(event: any, j: number) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

  if (!allowedTypes.includes(file.type)) {
    this.commonNotificationService.handleWarning('Only PDF, JPG, JPEG, and PNG files are allowed.');
    input.value = ''; // Reset the file input
    return;
  }
  // const transaction = this.expensedata.userExpenseTransactions[i];

  if (!this.expensedata.attachments) {
    this.expensedata.attachments = [];
  }

  const existing = this.expensedata.attachments[j];

  if (existing && typeof existing === 'string') {
    this.filesTobeRemoved.push(existing);
  }

  this.expensedata.attachments[j] = file;

  if (!this.expensedata.isNewAttachmentFlags) {
    this.expensedata.isNewAttachmentFlags = [];
  }

  // Ensure array is the correct length
  while (this.expensedata.isNewAttachmentFlags.length < this.expensedata.attachments.length) {
    this.expensedata.isNewAttachmentFlags.push(false);
  }

  this.expensedata.isNewAttachmentFlags[j] = true;
}
}
