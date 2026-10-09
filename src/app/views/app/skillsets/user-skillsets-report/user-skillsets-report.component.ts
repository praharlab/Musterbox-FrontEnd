
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { CommonFilterButtonFields, CommonFilterFields } from 'src/app/constants/CommonFilterFields';


@Component({
    selector: 'app-user-skillsets-report',
    templateUrl: './user-skillsets-report.component.html',
    styleUrls: ['./user-skillsets-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UserSkillsetsReportComponent implements OnInit {

  filterData = {
    userMasterID: '',
    YearMMArray: [],
  };

  permissionview: any = [];

  maxYearMonth: any;
  notAssignedFormYearMonth: any = [];

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Excel, CommonFilterButtonFields.Clear];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) {

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
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'UserSkillsetFormReport' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }


  selectToYearMonth(event) {
    this.maxYearMonth = event.target.value
  }


  clear() {
    this.notAssignedFormYearMonth = [];
  }

  download(val: any) {
    this.filterData.userMasterID = val.user;
    this.filterData.YearMMArray = this.generateMonthSequence(val?.fromyearmonth, val?.toyearmonth)
    try {
      this.spinner.start();
      this.api
        .callApi(this.constant.USERSKILLSETSREPORT, this.filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {

            this.notAssignedFormYearMonth = res.notAssignedFormYearMonth

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
          else {
            this.notifications.create('Error in Download', 'Please Try Again', NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
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

  generateMonthSequence(start, end) {
    let result = [];
    let currentDate = new Date(start);

    while (currentDate.toISOString().slice(0, 7) <= end) {
      let formattedDate = currentDate.toISOString().slice(0, 7).replace(/-/g, '');
      result.push(parseInt(formattedDate));

      // Move to the next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return result;
  }


}



