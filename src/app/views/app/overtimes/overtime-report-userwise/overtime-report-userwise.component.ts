import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-overtime-report-userwise',
    templateUrl: './overtime-report-userwise.component.html',
    styleUrls: ['./overtime-report-userwise.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OvertimeReportUserwiseComponent implements OnInit {
  @ViewChild('closeModal1') closeModal1: ElementRef;
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('editovertime') editovertiome: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  limit = 10;
  page = {
    totalCount: 0,
    offset: 0,
  };
  filterData = {
    page: 1,
    limit: 10,
    fromdate: '',
    todate: '',
    userMasterID: '',
  };
  body1 = {
    page: '',
    limit: '',
    fromdate: '',
    todate: '',
    userMasterID: '',
    Export:''
  };
  events: any;
  childcompany: any;
  company_id: any;
  cid: any;
  company: any;
  usertype: any;
  excelevents: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  resultColumns: any = [];
  overtimedata: any;
  allbranch: any;
  allemployee: any;
  alluser: any;
  selected: any[];
  ipAddress: any;
  rows1: any[];
  selectedBranch: any = '';
  export: any;
  flag: boolean = false;
  selectedEmployee: any;
  today: any = new Date().toISOString().substring(0, 7);
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }
  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.company_id = localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.checkpermission();
    this.getcompany();
    this.getIPAddress();
  }
  getcompany() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.company = res.data;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.company = res.data;
            this.spinner.stop();
          }
        });
    }
  }
  changemonth() {
    this.rows = [];
  }
  selectcompany(id) {
    this.allbranch = [];
    this.selected = [];
    this.alluser = [];
    this.rows = [];
    this.selectedEmployee = '';
    this.selectedBranch = '';
    if (id) {
      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
        });
      this.spinner.stop('branch');
      const body = {
        page: '',
        limit: '',
        companyMasterID: id,
      };
      this.spinner.start('emp');
      this.api
        .callApi(this.constant.GETALLUSERS, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            let data1 = [];
            this.alluser.forEach(async (rating) => {
              data1.push(rating.userMasterID);
            });
            this.selected = data1;
            this.spinner.stop('emp');
          }
        });
    }
  }
  selectbranch(id) {
    this.selected = [];
    this.alluser = [];
    this.rows = [];
    this.selectedEmployee = '';
    this.selectedBranch = '';
    if (id) {
      const filterData = {
        companyMasterID: this.company_id,
        branchMasterID: id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.alluser = res.data;
            let data1 = [];
            this.alluser.forEach(async (ratiing) => {
              data1.push(ratiing.userMasterID);
            });
            this.selected = data1;
          }
        });
    }
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OvertimeRequest' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OvertimeRequest' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OvertimeRequest' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OvertimeRequest' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit() {

    if (!this.datefilter.valid) {
      return;
    }
    this.flag = true;
    this.filterData.fromdate = this.datefilter.value.startdate;
    this.filterData.todate = this.datefilter.value.enddate;

    this.filterData.userMasterID = this.datefilter.value.employee;

    this.spinner.start('overtimereport');

    this.api
      .callApi(this.constant.GETOVERTIMEUSERWISE, this.filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.rows1 = this.rows;
          this.temp = [...this.rows];
          this.page.totalCount = res.totalcount;

          this.spinner.stop('overtimereport');
        }
      });
  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.onSubmit();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.limit = this.filterData.limit;
    this.onSubmit();
  }

  formatdate(inputDate) {
    const date = new Date(inputDate);

    return `${(date.getDate() + '').padStart(2, '0')}-${(date.getMonth() + 1 + '').padStart(
      2,
      '0',
    )}-${date.getFullYear()} ${date.getHours()}:${(date.getMinutes() + '').padStart(2, '0')}:${(
      date.getSeconds() + ''
    ).padStart(2, '0')}`;
  }

  download() {
    let data = [];

    this.body1.fromdate = this.filterData.fromdate;
    this.body1.todate = this.filterData.todate;
    this.body1.userMasterID = this.filterData.userMasterID;
    this.body1.Export = 'true'
    this.spinner.start('id')
    this.api
      .callApi(this.constant.GETOVERTIMEUSERWISE, this.body1, 'POST', true, false, true,true)
      .subscribe((res: any) => {
        if (res.type == 'application/json') {
          this.notifications.create('No data found to export!', '', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('id');
        } else {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, `Overtime Report - ${this.rows[0]['userMaster.displayName']}.xlsx`);

          this.spinner.stop('id');
        }
      },
        (err) => {
          this.notifications.create(
            'Error',
            err.error.message ,
            NotificationType.Error,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('id');
        });
  }

  getPdf() {
    var doc = new jsPDF('landscape');
    let data = [];

    let results = [];
    let username;
    let fromDate;
    let toDate;
    let totalmin;
    let totalAmount;
    let totalhour;
    let employeeCode

    let col = ['Overtime Date', 'Punch In', 'Punch Out', 'Overtime Minutes', 'Overtime Hours'];

    this.body1.fromdate = this.filterData.fromdate;
    this.body1.todate = this.filterData.todate;
    this.body1.userMasterID = this.filterData.userMasterID;
    this.body1.Export = ''

    this.api
      .callApi(this.constant.GETOVERTIMEUSERWISE, this.body1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.export = res.data;

          if (this.export.length > 0) {
            username = this.export[0]['userMaster.displayName'];
            employeeCode = this.export[0]['userMaster.employeeJoiningDetails.employeeCode']

            fromDate = this.formatdate(this.filterData.fromdate).slice(0, 10);
            toDate = this.formatdate(this.filterData.todate).slice(0, 10);

            totalmin = this.export[0].finalovertimemin;
            totalhour = this.export[0].finalovertimehour;
            totalAmount = this.export[0].overtimeAmount;
          } else {
            username = '';
            fromDate = '';
            toDate = '';
            totalmin = 0;
            totalhour = 0;
            totalAmount = 0;
          }

          results = this.export.map((e) => {
            return {
              overtimeDate: this.formatdate(e.OverTimeDate).slice(0, 10),
              punchIn: e['attendanceTransaction.InDatetime']
                ? this.formatdate(e['attendanceTransaction.InDatetime'])
                : '',
              punchOut: e['attendanceTransaction.OutDateTime']
                ? this.formatdate(e['attendanceTransaction.OutDateTime'])
                : '',
              overtimeMinutes: e.UpdateOverTimeHourAndMin,
              overtimeHours: e.overtimehour,
            };
          });

          var itemNew = results;
          itemNew.forEach((element) => {
            var ele = Object.values(element);
            var array = [];
            for (let k = 0; k < ele.length; k++) {
              let string = String(ele[k])
                .replace(/\<br\>/g, '\n')
                .replace(null, '')
                .replace(/\<b\>/g, '\n')
                .replace(/\&nbsp;/g, '     ');

              array.push(string);
            }

            let temp = array;

            data.push(temp);
          });

          // data.unshift(col);

          autoTable(doc, {
            head: [col],
            body: data,
            styles: { fontSize: 10 },
            margin: { top: 35 },
            didDrawPage: (dataArg) => {
              doc.setFontSize(12);
              // doc.setFontSize(18);

              doc.text('Employee Name : ' + username, 15, 15);
              doc.text('From Date : ' + fromDate, 15, 22);
              doc.text('To Date : ' + toDate, 15, 29);
              doc.text('Employee Code : ' + employeeCode, 200, 15);
              doc.text('Total Hours : ' + totalhour + ' Hours ' + totalmin + ' Minutes', 200, 22);
              doc.text('Total Amount : ' + totalAmount, 200, 29);
            },
          });

          // Generate the PDF
          doc.save('overtime_report.pdf');
        }
      });
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
