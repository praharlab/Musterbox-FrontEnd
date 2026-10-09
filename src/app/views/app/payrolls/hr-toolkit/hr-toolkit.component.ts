import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <== add the imports!
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-hr-toolkit',
    templateUrl: './hr-toolkit.component.html',
    styleUrls: ['./hr-toolkit.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HrToolkitComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = ['hrTollKitID', 'DocumentName', 'No_of_file', 'Status'];
  SelectionType = SelectionType;
  tabledata = [
    'hrTollKitID',
    'DocumentName',
    'No_of_file',
    'Status',
    'CreateBy',
    'CreateByIp',
    'CreatedAt',
    'updateBy',
    'UpdateByIp',
    'UpdatedAt',
  ];
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: localStorage.getItem('company_id'),
  };
  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
    companyMasterID: localStorage.getItem('company_id'),
  };
  body1 = {
    page: 1,
    limit: 10,
    startdate: '',
    enddate: '',
    id: localStorage.getItem('company_id'),
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  adminRoot = environment.adminRoot;

  events: any;
  filter: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  usertype: any;
  company_id: any;
  childcompany: string;
  images: any = [];
  ipAddress: any;
  file: any;
  format: any;
  url: any;
  zip: any;
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private router: Router,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getHRTOOLKIT();
    this.checkpermission();
  }
  getHRTOOLKIT() {
    let usertype: any = localStorage.getItem('usertype');
    this.spinner.start();
    this.api
      .callApi(this.constant.GETHRTOOLKIT, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.filter = 'main';
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop();
        }
      });
  }
  checkpermission() {
    if (this.usertype != 2) {
      this.spinner.start();
      let body = {
        userMasterID: localStorage.getItem('id'),
      };
      this.api
        .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            let permission = res.data;
            this.permissiondelete = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'Company' &&
                permissionval.operationName.includes('Delete')
              );
            });
            this.permissionedit = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'Company' && permissionval.operationName.includes('Edit')
              );
            });
            this.permissionview = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'Company' && permissionval.operationName.includes('View')
              );
            });
            this.permissioncreate = permission.filter((permissionval) => {
              return (
                permissionval.formName == 'Company' &&
                permissionval.operationName.includes('Create')
              );
            });
            this.spinner.stop();
          }
        });
    } else {
      this.permissioncreate = [1];
      this.permissionedit = [1];
      this.permissionview = [1];
      this.permissiondelete = [1];
    }
  }

  updateFilter(event): void {
    this.events = event;
    this.excelevents = event.target.value;
    const val = event.target.value.toLowerCase().trim();
    this.body.searchQuery = val;

    if (this.usertype == 2) {
      this.api
        .callApi(this.constant.GETHRTOOLKIT, this.body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.filter = 'search';
            this.rows = res.data;
            this.temp = [...this.rows];
            this.page.totalCount = res.totalcount;
            this.spinner.stop();
          }
        });
    }
  }
  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        // reader.readAsDataURL(event.target.files[i]);
        this.images.push(event.target.files[i]);
        // reader.onload = (event:any) => {
        //   var reader = new FileReader();

        // }
        // reader.onload = (event) => {

        //       this.url = (<FileReader>event.target).result;
        //     }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  onSelectFile(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'png' && ext.toLowerCase() == 'jpg' && ext.toLowerCase() == 'jpeg') {
      //this.toastr.error('Selected file format is not supported!!', 'Success!',{timeOut:3000});
      this.notifications.create(
        'Error',
        'Selected file format is not supported',
        NotificationType.Bare,
        {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        },
      );
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
  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    this.spinner.start();
    const formData = new FormData();
    formData.append('DocumentZip', this.file);
    formData.append('DocumentName', this.addcomp.value.filename);
    formData.append('No_of_file', this.addcomp.value.numberoffile);
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);

    this.api.callApi(this.constant.ADDHRTOOLKIT, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            window.location.reload();
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

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (this.filter == 'main') {
      this.filterData.page = e.offset + 1;
      this.ngOnInit();
    } else if (this.filter == 'search') {
      this.body.page = e.offset + 1;
      this.updateFilter(this.events);
    } else if (this.filter == 'filter') {
      this.body1.page = e.offset + 1;
      this.onSubmit();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (this.filter == 'main') {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.ngOnInit();
    } else if (this.filter == 'search') {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.updateFilter(this.events);
    } else if (this.filter == 'filter') {
      this.body1.limit = ev;
      this.limit = this.body1.limit;
      this.onSubmit();
    } else {
      console.log('error');
    }
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
          hrTollKitID: id,
        };
        this.spinner.start();
        this.api.callApi(this.constant.DELETEHRTOOLKIT, body, 'POST', true, true, true).subscribe(
          (res: any) => {
            this.ngOnInit();
            this.spinner.stop();
          },
          (err) => {
            console.log('error', err);
            this.spinner.stop();
          },
        );
      }
    });
  }
  alertDeactiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Data will deactive!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          hrTollKitID: id,
          status: '0',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.HRTOOLKITSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.ngOnInit();
              this.spinner.stop();
            },
            (err) => {
              console.log('error', err);
              this.spinner.stop();
            },
          );
      }
    });
  }
  alertActiveConfirmation(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Data will active!',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, active it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = {
          hrTollKitID: id,
          status: '1',
        };
        this.spinner.start();
        this.api
          .callApi(this.constant.HRTOOLKITSTATUSCHANGE, body, 'POST', true, true, true)
          .subscribe(
            (res: any) => {
              this.ngOnInit();
              this.spinner.stop();
            },
            (err) => {
              console.log('error', err);
              this.spinner.stop();
            },
          );
      }
    });
  }

  downloadpdf(pdf: any) {
    const pdfUrl = this.apiURL + 'uploads/hrtoolkit/' + pdf.DocumentZip;
    const pdfName = pdf.DocumentName;
    saveAs(pdfUrl, pdfName);
  }

  clear() {
    window.location.reload();
  }
  changeshowfields() {
    this.ngOnInit();
  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
