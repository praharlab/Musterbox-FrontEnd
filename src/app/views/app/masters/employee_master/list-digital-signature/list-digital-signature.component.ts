import { HttpClient } from '@angular/common/http';
import {
  Component,
  ViewChild,
  OnInit,
  ElementRef,
  TemplateRef,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-list-digital-signature',
    templateUrl: './list-digital-signature.component.html',
    styleUrls: ['./list-digital-signature.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListDigitalSignatureComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('editcomp') editcomp: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModal1') closeModal1: ElementRef;
  rows: any = [];
  apiURL = environment.apiUrl;

  columns = [
    { name: 'Id', prop: 'companyTypeID' },
    { name: 'Company Name', prop: 'companyTypename' },
    { name: 'Status', prop: 'status' },
  ];
  ColumnMode = ColumnMode;
  temp = [];
  file: any;
  format: any;
  url: any;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    company_id: localStorage.getItem('company_id'),
  };
  filterData1 = {
    page: '',
    limit: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  ipAddress: any;
  rows1: any = [];
  modalRef: BsModalRef;
  country: any;
  state: any;
  city: any;
  finalcityid: any;
  editbyid: any;
  alldocumenttypedata: any;
  usertype: any;
  
formValue: any;

  constructor(
    private modalService: BsModalService,
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private profileStatusService: ProfileStatusService,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }
  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.alldata();
    this.getIPAddress();
    this.usertype = localStorage.getItem('usertype');
    this.profileStatusService.refreshProfileStatus();
  }

  onSelectFile(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    if (ext.toLowerCase() != 'png' && ext.toLowerCase() != 'jpg' && ext.toLowerCase() != 'jpeg') {
      // this.toastr.error('Selected file format is not supported!!', 'Success!',{timeOut:3000});
    } else {
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
      }
    }
  }
  alldata() {
    this.spinner.start();
    this.api
      .callApi(
        this.constant.GETALLDIGITALSIGNATURE + this.formValue.ListEmployeeMasterComponent.id,
        this.filterData,
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    const formData = new FormData();
    formData.append('userMasterID', this.formValue.ListEmployeeMasterComponent.id);
    formData.append('signature', this.file);
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);
    this.spinner.start();
    this.api
      .callApi(this.constant.CREATEDIGITALSIGNATURE, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal.nativeElement.click();
            this.ngOnInit();
            this.addcomp.reset();
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

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
  edit(item) {
    this.editbyid = item;
  }
  onSubmit1() {
    if (!this.editcomp.valid) {
      return;
    }
    const formData = new FormData();
    formData.append('employeeDigitalSignatureID', this.editbyid.employeeDigitalSignatureID);
    formData.append('userMasterID', this.formValue.ListEmployeeMasterComponent.id);
    if (this.file) {
      formData.append('signature', this.file);
    }
    formData.append('updateBy', localStorage.getItem('id'));
    formData.append('updateByIp', this.ipAddress);
    this.spinner.start();
    this.api
      .callApi(this.constant.UPDATEDIGITALSIGNATURE, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal1.nativeElement.click();
            this.ngOnInit();

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

  alertConfirmation(id: any) {
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
          employeeDigitalSignatureID: id,
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DELETEDIGITALSIGNATURE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.ngOnInit();
              this.spinner.stop();
            },
            (err) => {
              this.notifications.create('Error', err.error.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop();
            },
          );
      }
    });
  }
  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          employeeDigitalSignatureID: id,
          status: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DIGITALSIGNATURETATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.ngOnInit();
              this.spinner.stop();
            },
            (err) => {
              this.notifications.create('Error', err.error.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop();
            },
          );
      }
    });
  }
  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          employeeDigitalSignatureID: id,
          status: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.DIGITALSIGNATURETATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.ngOnInit();
              this.spinner.stop();
            },
            (err) => {
              this.notifications.create('Error', err.error.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop();
            },
          );
      }
    });
  }
}
