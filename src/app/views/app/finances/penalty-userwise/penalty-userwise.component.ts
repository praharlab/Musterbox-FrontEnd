import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-penalty-userwise',
    templateUrl: './penalty-userwise.component.html',
    styleUrls: ['./penalty-userwise.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PenaltyUserwiseComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('addrefund') addrefund: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('closeModal') closeModal: ElementRef;
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 5;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  selected = ['PenaltyName', 'UserName', 'Amount', 'PenaltyDate', 'Description'];
  SelectionType = SelectionType;
  tabledata = [
    'PenaltyID',
    'PenaltyName',
    'UserName',
    'Amount',
    'PenaltyDate',
    'Description',
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
    startdate: '',
    enddate: '',
    userMasterID: localStorage.getItem('id'),
    searchQuery: '',
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  export: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  usertype: any;
  company_id: any;
  ipAddress: any;
  depositid: any;
  rows1: any = [];
  excelData: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');

    this.filterData = {
      page: 1,
      limit: 10,
      startdate: '',
      enddate: '',
      userMasterID: localStorage.getItem('id'),
      searchQuery: '',
    };
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.getPenaltycategory();
    this.checkpermission();
  }
  getPenaltycategory() {
    this.spinner.start('data');
    this.api
      .callApi(this.constant.GETUSERPENALTY, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;
          this.spinner.stop('data');
          } else {
            this.handleError(res.message);
            this.spinner.stop('data');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('data');
        },
      );
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
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeePenalty' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
  }

  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.filterData.searchQuery = '';
      setTimeout(() => {
        this.getPenaltycategory();
      }, 100);
    } else {
      this.filterData.searchQuery = inputValue;
      this.getPenaltycategory();
    }
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.page = 1;
    this.filterData.startdate = this.datefilter.value.startdate;
    this.filterData.enddate = this.datefilter.value.enddate;


   this.getPenaltycategory();
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getPenaltycategory();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.limit = this.filterData.limit;
      this.getPenaltycategory();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  downloadFile() {
    let data1 = [];


      let filterData = {
        page: '',
        limit: '',
        startdate: this.filterData.startdate,
        enddate: this.filterData.enddate,
        userMasterID: this.filterData.userMasterID,
      };

      this.api
        .callApi(this.constant.GETUSERPENALTY, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.excelData = res.data;
          }
      try {
        for (var i = 0; i < this.excelData.length; i++) {
          const data2 = {
            employeePenaltyID: this.excelData[i].employeePenaltyID,
            penaltyName: this.excelData[i].penalty.penaltyName,
            UserName: this.excelData[i].employee.displayName,
            Amount: this.excelData[i].penaltyAmount,
            Date: new Date(this.excelData[i].penaltyDate).toISOString().split('T')[0],
            Description: this.excelData[i].description,
            CreateBy: this.excelData[i].createBy,
            CreateByIp: this.excelData[i].createByIp,
            CreateAt: new Date(this.excelData[i].createdAt).toISOString().split('T')[0],
          };
          data1.push(data2);
        }

        const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
        const header = Object.keys(data1[0]);
        let csv = data1.map((row) =>
          header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','),
        );
        csv.unshift(header.join(','));
        let csvArray = csv.join('\r\n');

        var blob = new Blob([csvArray], { type: 'text/csv' });
        saveAs(blob, 'Penalty.csv');
      } catch (err) {
        this.notifications.create('Error in Download', 'Please Try Again', NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 1000,
          showProgressBar: false,
        });
      }
    });
  }

  openAttachment(item: any) {
    window.open(this.apiURL + 'uploads/employee-penalty-attachments/' + item, '_blank');
  }

  clear() {
    this.datefilter.resetForm();

    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  changeshowfields() {
    this.ngOnInit();
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
