import { HttpClient } from '@angular/common/http';
import {
  Component,
  ViewChild,
  OnInit,
  ElementRef,
  Output,
  EventEmitter,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'app-employee-house-property',
    templateUrl: './employee-house-property.component.html',
    styleUrls: ['./employee-house-property.component.scss', '../loader/loader.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeHousePropertyComponent implements OnInit {
  @ViewChild('addrentedresidence') addrentedresidence: NgForm;
  @ViewChild('closeModal') closeModal: any;
  @Input() data: any;
  tdsSubSectionCategoryID: any;

  fiscalYear: string;
  disabledPAN: any;
  values: any = [];
  minYear: string;
  maxYear: string;
  selectedRanges: { from: string; to: string }[] = [];
  file: any;
  format: string;
  url: string | ArrayBuffer;
  file1: any;
  panCardError: boolean = false;
  rows: any = [];
  apiURL = environment.apiUrl;
  loaderstatus: boolean = false;
  editRows: any = [];
  ipAddress: string | Blob;
  userId: any;
  // @Input() selectedFiscalYear: string;

  @Input()
  set selectedFiscalYear(selectedFiscalYear: string) {
    this.fiscalYear = selectedFiscalYear;
  }

  @Input()
  set selectedUserId(selectedUserId: string) {
    this.userId = selectedUserId;

  }

  body = {
    page: 1,
    limit: 10,
  };

  limit: number = 10;

  page = {
    totalCount: 0,
    offset: 0,
  };
  subSectionData: any = [];
  employeeDeclarationData: any = [];
  originalsubSectionData: any = [];
  tableStatus: boolean = false;

  constructor(
    private spinner: NgxUiLoaderService,

    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    const splityear = this.fiscalYear.split('-');
    this.minYear = splityear[0] + '-' + '04';
    this.maxYear = splityear[1] + '-' + '03';
    this.values = [];
    this.getData();
    this.getItemsForCurrentPage();

    // this.addMoreList()
  }

  getData() {
    let string = `?userMasterID=${this.userId}&financialYear=${this.fiscalYear}`;

    this.spinner.start('get');
    this.api
      .callApi(this.constant.GETEMPLOYEEDATAOFRENTEDRESIDENCE + string, {}, 'GET', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;

            if (this.rows.length === 0) this.addMoreList();
          }
          this.spinner.stop('get')
        },
        (err) => {
          this.handleError(err.error.message);
          // this.ngOnInit();

          this.spinner.stop('get')
        },
      );
  }

  addMoreList() {
    this.values.push({
      userMasterID: this.userId,
      financialYear: this.fiscalYear,
      fromMonth: '',
      toMonth: '',
      amount: '',
      address: '',
      city: '',
      attachment: '',
      ownerName: '',
      ownerAddress: '',
      ownerPAN: '',
      ownerAttachment: '',
      show: '',
      isDeleted: false,
      totalmonth: 0,
      showOwnerAttachment: false,
      min: '',
      panCardError: false,
    });
    this.getMinMonth(this.values[this.values.length - 2]);
  }

  removevalue(i) {
    this.values[i].isDeleted = true;
  }

  getMinMonth(data) {
    if (this.values.length <= 1) return;
    const min = data.toMonth;
    let final = new Date(min);
    final.setMonth(final.getMonth() + 1);
    const finalData =
      final.getFullYear() +
      '-' +
      (+final.getMonth() + 1 > 9 ? +final.getMonth() + 1 : '0' + (+final.getMonth() + 1));
    this.values[this.values.length - 1].min = finalData;
    // return final
  }

  calculateMonthDifference(fromMonth: string, toMonth: string): number {
    if (!fromMonth || !toMonth) {
      return 0;
    }

    const from = new Date(fromMonth);
    const to = new Date(toMonth);

    return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1;
  }

  selectdate(event: any, type: string, index: number) {
    const value = event.target.value;

    if (type === 'f') {
      this.values[index].fromMonth = value;
    } else {
      this.values[index].toMonth = value;
    }

    this.values[index].totalmonth = this.calculateMonthDifference(
      this.values[index].fromMonth,
      this.values[index].toMonth,
    );
  }

  showdata(event, i) {
    if (event) {
      this.values[i].show = event.target.value;
    } else {
      this.values[i].show = '';
    }
  }

  sameAddress(event, i) {
    if (event.target.checked) {
      this.values[i].ownerAddress = this.values[i].address;
    } else {
      this.values[i].ownerAddress = '';
    }
  }
  changeAmount(event, i) {
    if (event && +event.target.value < 0) {
      this.handleError('Rent Amount should Be positive Value!');
      this.values[i].amount = 0;
      return;
    }

    if (+this.values[i].totalmonth <= 0) return;

    const amount = (+event.target.value / this.values[i].totalmonth) * 12;

    this.values[i].showOwnerAttachment = amount > 100000 ? true : false;

    if (amount > 100000) {
      this.values[i].ownerAttachment = '';
      this.values[i].ownerPAN = '';
    }
  }

  onSubmit() {
    if (!this.addrentedresidence.valid) return;

    const data = this.values.filter((e) => !e.isDeleted);
    const findPanError = data.find((e) => e.panCardError && !e.isDeleted);
    if (findPanError) return;

    const formData = new FormData();
    data.forEach((value, index) => {
      formData.append(`userMasterID${index}`, this.userId);
      formData.append(`financialYear${index}`, this.fiscalYear);
      formData.append(`fromMonth${index}`, value.fromMonth.replace('-', ''));
      formData.append(`toMonth${index}`, value.toMonth.replace('-', ''));
      formData.append(`amount${index}`, value.amount);
      formData.append(`address${index}`, value.address);
      formData.append(`city${index}`, value.city);
      formData.append(`ownerName${index}`, value.ownerName);
      formData.append(`ownerAddress${index}`, value.ownerAddress);
      formData.append(`ownerPAN${index}`, value.ownerPAN);
      formData.append(`isattachment${index}`, value.attachment ? 'yes' : 'no');
      formData.append(`isownerAttachment${index}`, value.ownerAttachment ? 'yes' : 'no');
      formData.append(`attachment`, value.attachment);
      formData.append(`ownerAttachment`, value.ownerAttachment);
    });

    this.spinner.start('submit');
    this.api
      .callApi(this.constant.ADDEMPLOYEERENTEDRESIDENCE, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.showNotification(res.message);
            this.closeModal.nativeElement.click();
            this.addrentedresidence.resetForm();
            this.values = [];
            setTimeout(() => {
              this.getData();
            }, 500);

            // this.ngOnInit();
          } else {
            this.handleError(res.message);
          }
          this.spinner.stop('submit');
        },
        (err) => {
          this.handleError(err.error.message);
          // this.ngOnInit();

          this.spinner.stop('submit');
        },
      );
  }

  onDeleteClick() {
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
          userMasterID: this.userId,
          financialYear: this.fiscalYear,
        };
        this.spinner.start('delete')
        this.api
          .callApi(
            this.constant.DELETEEMPLOYEEDATAOFRENTEDRESIDENCE,
            body,
            'POST',
            true,
            true,
            true,
          )
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.showNotification(res.message);
                this.getData();
                this.spinner.stop('delete')
              } else {
                this.handleError(res.message || 'Something Went Wrong!');
                this.getData();
                this.spinner.stop('delete')
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('delete')
            },
          );
      }
    });
  }

  pageChanged(event: any): void {
    this.body.page = event.page;
    this.getItemsForCurrentPage();
  }

  onSelectFile(event, index) {
    if (event.target.files.length === 0) {
      this.values[index].attachment = '';
      return;
    }

    if (event.target.files.length > 0) {
      let filename = event.target.files[0].name;

      let ext = filename.substring(filename.lastIndexOf('.') + 1);
      if (
        ext.toLowerCase() != 'png' &&
        ext.toLowerCase() != 'jpg' &&
        ext.toLowerCase() != 'jpeg' &&
        ext.toLowerCase() != 'pdf'
      ) {
        return this.handleError('Selected file format is not supported!');
      }

      const file = event.target.files[0];
      this.values[index].attachment = file;
    }
  }

  onSelectFile1(event, index) {
    if (event.target.files.length === 0) {
      this.values[index].ownerAttachment = '';
      return;
    }

    if (event.target.files.length > 0) {
      let filename = event.target.files[0].name;

      let ext = filename.substring(filename.lastIndexOf('.') + 1);
      if (
        ext.toLowerCase() != 'png' &&
        ext.toLowerCase() != 'jpg' &&
        ext.toLowerCase() != 'jpeg' &&
        ext.toLowerCase() != 'pdf'
      ) {
        return this.handleError('Selected file format is not supported!');
      }

      const file = event.target.files[0];
      this.values[index].ownerAttachment = file;
    }
  }

  validatePanCardNumber(pancard: string, i): void {
    const pattern = /^[A-Z]{5}\d{4}[A-Z]{1}$/;
    if (pancard != null && pancard != '') {
      if (!pattern.test(pancard)) {
        this.values[i].panCardError = true;
      } else {
        this.values[i].panCardError = false;
      }
    } else {
      this.values[i].panCardError = false;
    }
  }

  view(item: any) {
    window.open(this.apiURL + 'uploads/hra-proof/' + item, '_blank');
  }

  ownView(item: any) {
    window.open(this.apiURL + 'uploads/employee-declaration-attachments/' + item, '_blank');
  }

  editData() {
    this.editRows = this.rows.map((e) => {
      e.fromMonth = String(e.fromMonth).slice(0, 4) + '-' + String(e.fromMonth).slice(4, 6);
      e.toMonth = String(e.toMonth).slice(0, 4) + '-' + String(e.toMonth).slice(4, 6);
      e.isdisable = e.authStatus != 0 ? true : false;

      return e;
    });
  }

  private showNotification(message: string) {
    this.notifications.create('Done', message, NotificationType.Bare, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: true,
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  getItemsForCurrentPage() {
    let queryString = `?page=${this.body.page}&limit=${this.body.limit}`;

    if (this.tdsSubSectionCategoryID)
      queryString += `&tdsSubSectionCategoryID=${this.tdsSubSectionCategoryID}`;
    this.spinner.start('curr')
    this.api
      .callApi(this.constant.GETALLDATATDSSUBSECTION + queryString, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.subSectionData = res.data;
            this.page.totalCount = res.totalcount;
            const query = `?userMasterID=${this.userId}&assessmentYear=${this.fiscalYear}`;

            this.spinner.stop('curr')
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
                      e.tdsSubSectionDescription = e.tdsSubSectionDescription.replace(
                        /<[^>]*>/g,
                        '',
                      );
                      const employeedata = this.employeeDeclarationData.find(
                        (d) => d.tdsSubSectionID == e.tdsSubSectionID,
                      );

                      if (employeedata) {
                        e.proof = employeedata.attachments;
                        e.newProof = [];
                        e.authStatus = employeedata.authStatus;
                        e.amount = employeedata.declarationAmount;
                        e.employeeDeclarationID = employeedata.employeeDeclarationID;
                      } else {
                        e.newProof = [];
                        e.proof = [];
                        e.authStatus = null;
                        e.amount = '';
                        e.employeeDeclarationID = null;
                      }
                      e.editMode = false;
                    });

                    // Assigning a deep copy of subSectionData to originalsubSectionData
                    this.originalsubSectionData = JSON.parse(JSON.stringify(this.subSectionData));

                    this.tableStatus = true;
                    this.spinner.stop('curr')
                  } else {
                    this.handleError('Something Went Wrong!');
                    this.spinner.stop('curr')
                  }
                },
                (err) => {
                  this.handleError(err.error.message);
                  this.spinner.stop('curr')
                },
              );

            this.spinner.stop('curr')
          } else {
            this.handleError('Something Went Wrong!');
            this.spinner.stop('curr')
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('curr')
        },
      );
  }


  onOwnSelectFile(event: any, item: any) {
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

  onEditClick(item) {
    item.editMode = true; // Toggle edit mode for the clicked item
  }

  onOwnDeleteClick(id) {
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
        this.spinner.start('owndelete')
        this.api
          .callApi(this.constant.DELETEEMPLOYEEDECLARATION, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.showNotification(res.message)
                this.getItemsForCurrentPage();
                this.spinner.stop('owndelete')

              } else {
                this.handleError(res.message || 'Something Went Wrong!');
                this.getItemsForCurrentPage();
                this.spinner.stop('owndelete')
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('owndelete')
            },
          );
      }
    })

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
        },
        (err) => {
          this.handleError(err.error.message);
          this.ngOnInit();
          this.spinner.stop('save')
        },
      );
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

}
