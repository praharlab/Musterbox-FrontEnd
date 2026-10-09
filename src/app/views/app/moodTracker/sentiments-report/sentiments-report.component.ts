import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { saveAs } from 'file-saver';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-sentiments-report',
    templateUrl: './sentiments-report.component.html',
    styleUrls: ['./sentiments-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SentimentsReportComponent implements OnInit {
  @ViewChild('companyfilter') companyfilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;


  rows = [];
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  ColumnMode = ColumnMode.force;
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  Order = { label: 'Mood', value: 'mood' };
  changeOrderBy = [{ label: 'Mood', value: 'mood' }];

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];

  scrollBarHorizontal = window.innerWidth < 1201;
  body = {
    page: 1,
    limit: 10,
    company_id: '',
    searchQuery: '',
    sortByField: '',
    sortByValue: 'ASC',
    mood: '',
    startdate: '',
    enddate: '',
    userMasterID: '',
    showAll: true
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  permissionview: any = [];
  limit = 10;
  company_id: any;
  selectedValue: string;
  enddate1: any;
  currentPage: number;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private router: Router,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.limit = 10;
    this.body = {
      page: 1,
      limit: 10,
      company_id: '',
      searchQuery: '',
      sortByField: '',
      sortByValue: 'ASC',
      mood: '',
      startdate: '',
      enddate: '',
      userMasterID: '',
      showAll: true
    };

    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.checkpermission();
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  getSentimentsData() {
    this.spinner.start();
    this.api
      .callApi(this.constant.GETSENTIMENTPUNCHINAPI, this.body, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.body.page;
            this.itemsPerPage = this.body.limit;
          }, 100);
          this.spinner.stop();
        },
        (err) => {
          this.notifications.create('Error', 'Someting Went Wrong!', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
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
              permissionval.formName == 'SentimentReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onChangeOrderBy(event): void {
    this.body.sortByField = event.value;
    this.getSentimentsData();
  }


  updateFilter(event): void {
    const inputValue = event.target.value.trim().toLowerCase();
    if (inputValue.length == 0) {
      this.body.searchQuery = '';
      setTimeout(() => {
        this.getSentimentsData();
      }, 100);
    } else {
      this.body.searchQuery = inputValue;
      this.getSentimentsData();
    }
  }

  selectfrom() {
    this.enddate1 = new Date().toISOString().split('T')[0];
  }

  onSubmit(val: any) {
    if (
      (!val.startdate && this.enddate1) ||
      (val.startdate && (!this.enddate1 && !val?.enddate))
    ) {
      this.notifications.create(
        'Error',
        'Start & End date both Required!',
        NotificationType.Error,
        {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        },
      );
      return;
    }
    this.body.mood = val.mood;
    this.body.startdate = val.startdate;
    this.body.enddate = val?.enddate ? val?.enddate : this.enddate1;
    this.body.company_id = val.company;
    this.body.userMasterID = val.user;
    this.getSentimentsData();
  }



  onChange(e: any) {
    if (e) {
      this.body.page = e.offset + 1;
      this.getSentimentsData();
    } else {
      console.log('error');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body.limit = ev;
      this.limit = this.body.limit;
      this.getSentimentsData();
    } else {
      console.log('error');
    }
  }

  clear() {
    this.enddate1 = null;
    this.company_id = null;
    this.body = {
      page: 1,
      limit: 10,
      company_id: '',
      searchQuery: '',
      sortByField: '',
      sortByValue: 'ASC',
      mood: '',
      startdate: '',
      enddate: '',
      userMasterID: '',
      showAll: true
    };
  }
  onOptionSelectDownlad(val: any) {
    if (!this.selectedValue && this.selectedValue == null) {
      return;
    }

    let body = {
      page: 1,
      limit: 10,
      searchQuery: '',
      mood: this.body.mood,
      startdate: this.body.startdate,
      enddate: this.body.enddate,
      company_id: this.body.company_id,
      userMasterID: this.body.userMasterID,
      exportData: true,
      exportFileType: this.selectedValue,
      showAll: true,
    };

    this.spinner.start('download');
    this.api
      .callApi(this.constant.GETSENTIMENTPUNCHINAPI, body, 'POST', true, false, true, true)
      .subscribe((res: any) => {
        if (this.selectedValue == 'csv') {
          var blob = new Blob([res], { type: 'text/csv' });
          saveAs(blob, 'SentimentsReport.csv');
        } else {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, 'SentimentsReport.xlsx');
        }
        this.spinner.stop('download');
      });
  }

  getCompany(companyMasterID: string){
    this.body.company_id = companyMasterID;
    this.getSentimentsData();
  }

  selectto(val: any){
    this.enddate1 = val.target.value;
  }

}
