import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { NgForm } from '@angular/forms';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-tracking-report',
    templateUrl: './tracking-report.component.html',
    styleUrls: ['./tracking-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TrackingReportComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]

  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    companyMasterID: '',
    startDate: '',
    endDate: '',
    userMasterID: null,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

  image: any;
  enddate: any;
  selectedValue: any;
  currentPage: number;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.checkpermission();
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

          this.permissionview = permission.filter(
            (permissionval: { formName: string; operationName: string | string[] }) => {
              return (
                permissionval.formName == 'TrackingReport' &&
                permissionval.operationName.includes('View')
              );
            },
          );

          this.spinner.stop();
        }
      });
  }

  selectfrom() {
    this.enddate = new Date().toISOString().split('T')[0];
  }

  onSubmit(val?: any) {
    this.filterData.companyMasterID = val?.company;
    this.filterData.startDate = val?.fromdate;
    this.filterData.endDate = val?.todate ? val?.todate : this.enddate;
    this.filterData.userMasterID = val?.user ? val.user : this.filterData.userMasterID;
    this.getTrackingData();
  }

  getTrackingData(){
    this.api
      .callApi(this.constant.GETTRACKINGREPORT, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalcount;
          setTimeout(() => {
            this.currentPage = this.filterData.page;
          }, 100);
        }
      });
  }

  onChange(e: any) {
    if (e) {
      this.filterData.page = e.offset + 1;
      this.getTrackingData();
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      this.getTrackingData();
    }
  }

  clear() {
    this.rows = [];
    this.filterData = {
      page: 1,
      limit: 10,
      companyMasterID: '',
      startDate: '',
      endDate: '',
      userMasterID: null,
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };
    this.enddate = ''
  }

  editimage(image: any) {
    this.image = image;
  }

  download() {
    if (!this.selectedValue && this.selectedValue == null) {
      return;
    }

    let body1 = {
      page: '',
      limit: '',
      userMasterID: this.filterData.userMasterID,
      startDate: this.filterData.startDate,
      endDate: this.filterData.endDate,
      exportData: true,
      exportFileType: this.selectedValue,
    };

    // this.spinner.start('download');
    this.api
      .callApi(this.constant.GETTRACKINGREPORT, body1, 'POST', true, false, true, true)
      .subscribe((res: any) => {
        if (this.selectedValue == 'csv') {
          var blob = new Blob([res], { type: 'text/csv' });
          saveAs(blob, 'TrackingReport.csv');
        } else {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, 'TrackingReport.xlsx');
        }
        // this.spinner.stop('download');
      });
  }

  calculateMaxAddressLength(): number {
    // Assuming 'rows' is an array of data with 'Address' property
    const maxLength = Math.max(...this.rows.map((row) => row.Address.length));
    // You can add some extra padding or multiplier if needed
    return maxLength + (maxLength / 2) * 15; // Adjust this value accordingly
  }
  
  init(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any) {
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}

// updateFilter(event: { target: { value: string; }; }): void {
//   const val = event.target.value.toLowerCase().trim();
//   const count = this.resultColumns.length;
//   const keys = Object.keys(this.temp[0]);
//   const temp = this.temp.filter((item) => {
//     for (let i = 0; i < count; i++) {
//       if (
//         (item[keys[i]] &&
//           item[keys[i]].toString().toLowerCase().indexOf(val) != -1) ||
//         !val
//       ) {
//         return true;
//       }
//     }
//   });
//   this.rows = temp;
//   this.table.offset = 0;
// }
