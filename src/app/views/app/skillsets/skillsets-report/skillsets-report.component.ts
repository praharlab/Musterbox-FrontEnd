import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-skillsets-report',
    templateUrl: './skillsets-report.component.html',
    styleUrls: ['./skillsets-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SkillsetsReportComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];
  selected: any = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    companyMasterID: '',
    designation: '',
    YearMM: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  filter: any;
  export: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  usertype: any;
  company_id: any;
  company1: any;
  designation1: any;
  target: any;
  resultColumns: any[];
  childcompany: string;
  cid: string;
  companydata: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stop();
        }
      });
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
              permissionval.formName == 'SkillSetsReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  selectcompany(id) {
    if (!id) return;

    this.rows = [];
    this.selected = [];
    this.designation1 = [];

    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.designation1 = res.data;
          this.selectAllForDropdownItems(this.designation1);
        }
      });
  }

  clear() {
    this.datefilter.resetForm();
    this.rows = [];
    this.selected = [];
    this.designation1 = [];
  }

  download() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.companyMasterID = this.datefilter.value.company;

    if (this.selected.length == 0) {
      this.filterData.designation = this.designation1.map((item) => {
        return item.designationId;
      });
    } else {
      this.filterData.designation = this.selected;
    }

    this.filterData.YearMM = this.datefilter.value.YearMM.replace('-', '');

    try {
      this.spinner.start();
      this.api
        .callApi(this.constant.SKILLSETSREPORT, this.filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            let check = res.questionArray;
            if (check.length == 0) {
              this.notifications.create('Done', 'No Data To Download', NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
            } else {
              let data = res.data1;
              let data2 = [];

              let workbook = new Workbook();
              let worksheet = workbook.addWorksheet('Skillsets Data');

              const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
              const header = data[0];
              // let headerRow = worksheet.addRow(header);
              let headerRow = worksheet.addRow(res.data);
              headerRow.eachCell((cell, number) => {
                cell.font = {
                  bold: true,
                  color: { argb: '000000' },
                  size: 18,
                };
              });

              worksheet.mergeCells(1, 1, 1, header.length);

              headerRow.alignment = {
                vertical: 'middle',
                horizontal: 'center',
              };

              data.forEach((row: any) => {
                data2.push(Object.values(row));
              });
              data2.forEach((d) => {
                let row = worksheet.addRow(d);
              });

              worksheet.mergeCells(2, 1, 3, 1);
              worksheet.mergeCells(2, 2, 3, 2);

              worksheet.getRow(2).font = {
                bold: true,
                color: { argb: '000000' },
                size: 14,
              };

              worksheet.getRow(2).alignment = {
                vertical: 'middle',
                horizontal: 'center',
              };

              worksheet.getRow(3).font = {
                bold: true,
                color: { argb: '000000' },
                size: 14,
              };

              worksheet.getRow(3).alignment = {
                vertical: 'middle',
                horizontal: 'center',
              };

              workbook.xlsx.writeBuffer().then((data) => {
                let blob = new Blob([data], {
                  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                fs.saveAs(blob, 'Report' + '.xlsx');
              });
              data2.splice(0);
            }
          }
        });
    } catch (err) {
      this.notifications.create('Error in Download', 'Please Try Again', NotificationType.Bare, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
    }
  }
  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }
}
