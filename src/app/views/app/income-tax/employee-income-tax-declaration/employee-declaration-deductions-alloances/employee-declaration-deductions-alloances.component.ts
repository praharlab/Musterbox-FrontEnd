import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
    selector: 'app-employee-declaration-deductions-alloances',
    templateUrl: './employee-declaration-deductions-alloances.component.html',
    styleUrls: ['./employee-declaration-deductions-alloances.component.scss', '../loader/loader.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeDeclarationDeductionsAlloancesComponent implements OnInit {
  // [x: string]: any;
  @Input() data: any;
  tdsSubSectionCategoryID: any;
  fiscalYear: string;
  subSectionData: any = [];
  sanitizedData: SafeHtml;
  employeeDeclarationData: any = []
  originalsubSectionData: any = [];
  userId: string;

  @Input()
  set selectedFiscalYear(selectedFiscalYear: string) {
    this.fiscalYear = selectedFiscalYear;
  };

  @Input()
  set selectedUserId(selectedUserId: string) {
    this.userId = selectedUserId;

  }

  apiURL = environment.apiUrl;

  body = {
    page: 1,
    limit: 10
  }

  limit: number = 10;

  page = {
    totalCount: 0,
    offset: 0,
  };

  tableStatus: boolean = false
  ipAddress: any
  file: any = []
  loaderstatus: boolean = false;


  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getItemsForCurrentPage()
  }


  onSaveClick(item) {
    if (!item.amount) return this.handleError('Amount is required field!');

    const formData = new FormData();

    formData.append('userMasterID', this.userId);
    formData.append('tdsSubSectionID', item.tdsSubSectionID);
    formData.append('assessmentYear', this.fiscalYear);
    formData.append('declarationAmount', item.amount);
    formData.append('declarationFrom', 'admin');

    if (item.newProof.length > 0) {
      for (let i = 0; i < item.newProof.length; i++) {
        formData.append('attachments', item.newProof[i]);
      }
    }

    if (item.proof.length > 0) {
      formData.append('oldAttachments', item.proof);
    }
    formData.append('remarks', '');
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);
    this.spinner.start('save')
    // this.loaderstatus = !this.loaderstatus
    this.api
      .callApi(this.constant.ADDEMPLOYEEDECLARATION, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            item.editMode = false;
            this.showNotification(res.message);
            this.ngOnInit();
          } else {
            this.handleError(res.message);
            this.ngOnInit();
          }
          this.spinner.stop('save')
          // this.loaderstatus = !this.loaderstatus
        },
        (err) => {
          this.handleError(err.error.message);
          this.ngOnInit();
          this.spinner.stop('save')
          // this.loaderstatus = !this.loaderstatus
        },
      );
  }

  pageChanged(event: any): void {
    this.body.page = event.page;
    this.getItemsForCurrentPage();

  }

  getItemsForCurrentPage() {
    let queryString = `?page=${this.body.page}&limit=${this.body.limit}`;

    if (this.tdsSubSectionCategoryID)
      queryString += `&tdsSubSectionCategoryID=${this.tdsSubSectionCategoryID}`;
    this.spinner.start('item');
    // this.loaderstatus = !this.loaderstatus;

    this.api
      .callApi(this.constant.GETALLDATATDSSUBSECTION + queryString, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.subSectionData = res.data;
            this.page.totalCount = res.totalcount
            const query = `?userMasterID=${this.userId}&assessmentYear=${this.fiscalYear}`;

            // this.loaderstatus = !this.loaderstatus
            this.api
              .callApi(
                this.constant.GETEMPLOYEEDECLARATIONBYUSERID + query,
                {},
                'GET',
                true,
                false,
                true,
              )
              .subscribe(
                (res: any) => {
                  if (res.status == 200) {
                    this.employeeDeclarationData = res.data;

                    this.subSectionData.map((e) => {

                      e.tdsSubSectionDescription = e.tdsSubSectionDescription.replace(/<[^>]*>/g, '');
                      const employeedata = this.employeeDeclarationData.find(
                        (d) => d.tdsSubSectionID == e.tdsSubSectionID,
                      );

                      if (employeedata) {
                        e.proof = employeedata.attachments;
                        e.newProof = [];
                        e.authStatus = employeedata.authStatus;
                        e.amount = employeedata.declarationAmount;
                        e.employeeDeclarationID = employeedata.employeeDeclarationID
                      } else {
                        e.newProof = [];
                        e.proof = [];
                        e.authStatus = null;
                        e.amount = '';
                        e.employeeDeclarationID = null
                      }
                      e.editMode = false;
                    });

                    // Assigning a deep copy of subSectionData to originalsubSectionData
                    this.originalsubSectionData = JSON.parse(JSON.stringify(this.subSectionData));;

                    this.tableStatus = true;
                    this.spinner.stop('item');
                    // this.loaderstatus = !this.loaderstatus

                  } else {
                    this.handleError('Something Went Wrong!');
                    this.spinner.stop('item');
                    // this.loaderstatus = !this.loaderstatus

                  }
                },
                (err) => {
                  this.handleError(err.error.message);
                  this.spinner.stop('item');
                  // this.loaderstatus = !this.loaderstatus

                },
              );
            this.spinner.stop('item');
            // this.loaderstatus = !this.loaderstatus

          } else {
            this.handleError('Something Went Wrong!');
            this.spinner.stop('item');
            // this.loaderstatus = !this.loaderstatus

          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('item');
          // this.loaderstatus = !this.loaderstatus

        },
      );
  }


  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  onEditClick(item) {
    item.editMode = true; // Toggle edit mode for the clicked item
  }

  onDeleteClick(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          employeeDeclarationID: id,
        }
        this.spinner.start('delete')
        // this.loaderstatus = !this.loaderstatus
        this.api
          .callApi(this.constant.DELETEEMPLOYEEDECLARATION, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.showNotification(res.message)
                this.getItemsForCurrentPage();

                this.spinner.stop('delete')
                // this.loaderstatus = !this.loaderstatus

              } else {
                this.handleError(res.message || 'Something Went Wrong!');
                this.getItemsForCurrentPage();

                this.spinner.stop('delete')
                // this.loaderstatus = !this.loaderstatus
              }
            },
            (err) => {
              this.handleError(err.error.message);

              this.spinner.stop('delete')
              // this.loaderstatus = !this.loaderstatus
            },
          );
      }
    })

  }

  onCalcelClick(item) {
    const lastdata = this.originalsubSectionData.find(e => e.tdsSubSectionID == item.tdsSubSectionID);
    if (lastdata) {
      //  item.amount = lastdata.amount,
      //  item.proof = lastdata.proof
      Object.assign(item, lastdata);
    }
    item.newProof = [];
    item.editMode = false; // Toggle edit mode off
    this.file = [];


    // this.ngOnInit();
  }

  onSelectFile(event: any, item: any) {
    if (event.target.files && event.target.files.length > 0) {
      const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
      ];
      const files = event.target.files;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileMimeType = file.type;

        if (allowedMimeTypes.includes(fileMimeType)) {
          item.newProof.push(file);
        } else {
          this.handleError(`File '${file.name}' has invalid type. Only jpeg, jpg, png, doc, pdf, xlsx, and csv are allowed.`)
          // this.onCalcelClick(item)
        }
      }
    }
  }

  removeImage(i: any, j: any) {
    this.subSectionData[i].proof.splice(j, 1)
  }

  view(item: any) {
    window.open(this.apiURL + 'uploads/employee-declaration-attachments/' + item, '_blank');
  }

  private showNotification(message: string) {
    this.notifications.create('Done', message, NotificationType.Bare, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: true,
    });
  }

}
