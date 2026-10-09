import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'app-employee-document',
    templateUrl: './employee-document.component.html',
    styleUrls: ['./employee-document.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeDocumentComponent implements OnInit {

  @ViewChild('addcomp4') addcomp4: NgForm;
  @ViewChild('closeModal4') closeModal4: ElementRef;
  @ViewChild('editcompdoc') editcompdoc: NgForm;
  @ViewChild('closeEdutDocModal1') closeEdutDocModal1: ElementRef;

  rows9: any;
  rows: any;
  format: string;
  url: string | ArrayBuffer;
  page = {
    totalCount: 0,
    offset: 0,
  };
  apiURL = environment.apiUrl;
  temp: any[];
  filterData = {
    page: 1,
    limit: 10,
    company_id: localStorage.getItem('company_id'),
  };
  editbyid: any;
  expiryDate: string;
  showExpiryDate: boolean = false;
  ipAddress: any;
  companydata1 = {
    showdate1: 'no', // Initialize with appropriate default value if needed
  };
  alldocumenttypedata: any;
  file: any;
  filterData1 = {
    page: '',
    limit: '',
  };
  adharNumberError: boolean = false;
  panCardError: boolean = false;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,


  ) { }

  ngOnInit(): void {
    this.alldocumenttype()
    this.employeeDocument()
  }

  employeeDocument() {
    this.spinner.start('DOC');
    this.api
      .callApi(
        this.constant.GETUSERDOCUMENT + localStorage.getItem('id'),
        this.filterData,
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {

        if (res.status == 200) {
          this.rows9 = res.data;
          for (var i = 0; i < this.rows9.length; i++) {
            let extension = this.rows9[i].document.substring(
              this.rows9[i].document.lastIndexOf('.') + 1,
            );
            if (extension == 'pdf') {
              this.rows9[i].checkpdf = true;
            } else {
              this.rows9[i].checkpdf = false;
            }
          }

          this.page.totalCount = res.totalcount;
        }
        this.spinner.stop('DOC');
      });
  }

  onSubmit4() {
    if (!this.addcomp4.valid || this.adharNumberError || this.panCardError) {
      return;
    }
    // let body={
    //   userMasterID:this.activatedRoute.snapshot.params.id,
    //   documentListID:this.addcomp4.value.documentListID,
    //   createBy:localStorage.getItem('id'),
    //   createByIp:this.ipAddress
    // }
    const formData = new FormData();
    formData.append('userMasterID', localStorage.getItem('id'));
    formData.append('documentListID', this.addcomp4.value.documentListID);
    formData.append('adharPhoto', this.file);
    formData.append('documentNumber', this.addcomp4.value.documentNumber ? this.addcomp4.value.documentNumber : '');
    formData.append('nameOnDocument', this.addcomp4.value.nameOnDocument ? this.addcomp4.value.nameOnDocument : '');
    formData.append('verifyStatus', '0');
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);
    formData.append('expiryDate', this.addcomp4.value.expiryDate ? this.addcomp4.value.expiryDate : null);

    this.spinner.start();
    this.api
      .callApi(this.constant.CREATEUSERDOCUMENT, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal4.nativeElement.click();
            this.employeeDocument();
            this.addcomp4.resetForm();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.spinner.stop();
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }

  alldocumenttype() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETDOCUMENTDATA, this.filterData1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldocumenttypedata = res.data;

          this.spinner.stop();
        }
      });
  }

  toggleExpiryDateField(show: boolean) {
    this.showExpiryDate = show;
    if (!show) {
      this.expiryDate = ''; // Reset expiryDate when hiding the field
    }
  }

  download1(item: any) {
    const image = item.document;

    window.open(this.apiURL + 'uploads/user/document/' + image, '_blank');
    return;


  }

  editDocuments(item) {
    this.adharNumberError = false;
    this.panCardError = false;
    this.spinner.start();
    this.api
      .callApi(this.constant.GETUSERDOCUMENTBYID + item.userDocumentID, {}, 'GET', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.editbyid = res.data;
          if (+this.editbyid.documentListID == 1) {
            this.validateadharNumber(this.editbyid.documentNumber);
          }
          if (+this.editbyid.documentListID == 2) {
            this.validatePanCardNumber(this.editbyid.documentNumber);
          }

          this.showExpiryDate = false;

          if (this.editbyid.expiryDate) {
            this.editbyid.expiryDate = new Date(this.editbyid.expiryDate).toISOString().slice(0, 10);
            this.showExpiryDate = true;
          }

        }
      });
  }

  validateadharNumber(adharcard: string): void {
    const pattern = /^\d{12}$/;
    if (adharcard != null && adharcard != '') {
      if (!pattern.test(adharcard)) {
        this.adharNumberError = true;
      } else {
        this.adharNumberError = false;
      }
    } else {
      this.adharNumberError = false;
    }
  }

  validatePanCardNumber(pancard: string): void {
    const pattern = /^[A-Z]{5}\d{4}[A-Z]{1}$/;
    if (pancard != null && pancard != '') {
      if (!pattern.test(pancard)) {
        this.panCardError = true;
      } else {
        this.panCardError = false;
      }
    } else {
      this.panCardError = false;
    }



  }

  deleteDoc(item) {
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
          userDocumentID: item.userDocumentID,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEUSERDocument, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.employeeDocument();
              this.spinner.stop();
            },
            (err) => {
              this.spinner.stop();
            },
          );
      }
    });
  }

  onSelectFilee(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    // if (ext.toLowerCase() != 'png' && ext.toLowerCase() != 'jpg' && ext.toLowerCase() != 'jpeg') {
    //   // this.toastr.error('Selected file format is not supported!!', 'Success!',{timeOut:3000});
    // } else {
    this.file = event.target.files && event.target.files[0];
    if (this.file) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      if (this.file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
      // }
    }
  }

  onDocumentsEditSubmit1() {
    if (!this.editcompdoc.valid || this.adharNumberError || this.panCardError) {
      return;
    }
    const formData = new FormData();
    formData.append('userDocumentID', this.editbyid.userDocumentID);
    formData.append('documentListID', this.editbyid.documentListID);
    if (this.file) {
      formData.append('adharPhoto', this.file);
    }
    formData.append('documentNumber', this.editcompdoc.value.documentNumber ? this.editcompdoc.value.documentNumber : '');
    formData.append('nameOnDocument', this.editcompdoc.value.nameOnDocument ? this.editcompdoc.value.nameOnDocument : '');
    formData.append('updateBy', localStorage.getItem('id'));
    formData.append('updateByIp', this.ipAddress);
    formData.append('verifyStatus', '0');
    formData.append('expiryDate', this.editcompdoc.value.expiryDate ? this.editcompdoc.value.expiryDate : null);


    this.spinner.start();
    this.api
      .callApi(this.constant.UPDATEUSERDOCUMENT, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeEdutDocModal1.nativeElement.click();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.employeeDocument();
              this.editcompdoc.resetForm();
              this.spinner.stop();
            }, 3000);
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop();
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
  }
}
