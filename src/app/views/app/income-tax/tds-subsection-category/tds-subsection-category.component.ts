import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-tds-subsection-category',
    templateUrl: './tds-subsection-category.component.html',
    styleUrls: ['./tds-subsection-category.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TdsSubsectionCategoryComponent implements OnInit {

  @ViewChild('sectionfilter') sectionfilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild('lgModal') modal: any;

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('datefilter') datefilter: NgForm;

  @ViewChild('closeModal1') closeModal1: ElementRef;

  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('editcomp') editcomp: NgForm;
  @ViewChild('lgModal') lgModal: any;

  rows = [];
  apiURL = environment.apiUrl;
  myInputVariable: ElementRef;
  adminRoot = environment.adminRoot;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  Order = { label: 'Title', value: 'title' };
  changeOrderBy = [
    { label: 'title', value: 'title' },
    { label: 'Description', value: 'description' },
    { label: 'Created By', value: 'createdBy' },
  ];
  selectAllState = '';

  body = {
    page: 1,
    limit: 10,
    searchQuery: '',
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [1];
  permissionedit: any = [1];
  permissionview: any = [1];
  permissiondelete: any = [1];
  limit = 10;
  company_id: any;
  ipAddress: any;
  comp: any;
  selectedValue: string;
  query: string;
  file: any;
  tdsSectionData: any = [];
  editdata: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.limit = 10;
    this.body = {
      page: 1,
      limit: 10,
      searchQuery: '',
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.company_id = localStorage.getItem('company_id');

    this.getTDSSubSectionCategoryData();
 
    this.getTDSSection();
    this.getIPAddress()
  }

  getTDSSubSectionCategoryData() {
    this.spinner.start('start');
    let queryString = `?page=${this.body.page}&limit=${this.body.limit}`;

    if (this.body.searchQuery) {
      queryString += `&searchQuery=${this.body.searchQuery}`;
    }

    this.query = queryString;
    this.api
      .callApi(this.constant.GETTDSSUBSECTIONCATEGORYLIST + queryString, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
          }

          this.spinner.stop('start');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  showAddNewModal() {
    this.lgModal.show();
  }

  onSubmit() {
    if (!this.addcomp.valid) return
    const addbody = {
      categoryName: this.addcomp.value.categoryName,
      description: this.addcomp.value.description,
      createBy:localStorage.getItem('id'),
      createByIp:this.ipAddress
    }

    this.spinner.start('add');
    this.api
      .callApi(this.constant.ADDTDSSUBSECTIONCATEGORY, addbody, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });

            this.closeModal.nativeElement.click();
            this.addcomp.resetForm();
            this.ngOnInit();
            this.spinner.stop('add');
          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            }),

              this.spinner.stop('add');
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('add');
        },
      );

  }

  edit(id: any) {
    this.spinner.start('edit')
    this.api
      .callApi(this.constant.GETTDSSUBSECTIONCATEGORYBYID + id, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.editdata = res.data;
          }

          this.spinner.stop('edit');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('edit');
        },
      );
  }

  onSubmit1(){
    if (!this.editcomp.valid) return
    const editbody = {
      categoryName: this.editcomp.value.categoryName,
      description: this.editcomp.value.description
    }

    this.spinner.start('editform');
    this.api
      .callApi(this.constant.UPDATETDSSUBSECTIONCATEGORY + this.editdata.tdsSubSectionCategoryID, editbody, 'PUT', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.closeModal1.nativeElement.click();
            this.addcomp.resetForm();
            this.ngOnInit();
            this.spinner.stop('editform');
          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            }),

              this.spinner.stop('editform');
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('editform');
        },
      );

  }


  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.ngOnInit();
      this.body.searchQuery = '';
    }

    if (inputValue.length >= 1) {
      this.body.searchQuery = inputValue;
      this.getTDSSubSectionCategoryData();
    }
  }


  getTDSSection() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLDATATDSSECTION, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.tdsSectionData = res.data;
          this.spinner.stop();
        }
      });
  }

  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.getTDSSubSectionCategoryData();
    } else {
      this.handleError('Something Went Wrong!');
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
       
        this.spinner.start('delete');
        this.api
          .callApi(this.constant.DELETETDSSUBSECTIONCATEGORY + id, {}, 'DELETE', true, true, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.ngOnInit();
                this.spinner.stop('delete');
              } else {
                this.handleError('Something Went Wrong!');
                this.spinner.stop('delete');
              }
            },
            (err) => {
              this.handleError(err.error.message);
              this.spinner.stop('delete');
            },
          );
      }
    });
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.getTDSSubSectionCategoryData();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }


  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }


  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
 


}
