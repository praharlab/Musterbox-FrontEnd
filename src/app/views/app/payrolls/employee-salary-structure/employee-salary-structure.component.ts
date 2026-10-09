import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-employee-salary-structure',
    templateUrl: './employee-salary-structure.component.html',
    styleUrls: ['./employee-salary-structure.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeeSalaryStructureComponent implements OnInit {

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];

  incrementdata: any
  limit = 10;
  permissionview: any = [];
  permissiondelete: any;
  body = {
    userMasterID: '',
    companyMasterID: '',
    branchMasterID: '',
    page: 1,
    limit: 10,
    exportData: false,
    view: 'EmployeeSalaryStructure'
  };

  page = {
    totalCount: 0,
    offset: 0,
  };
  finaldata: boolean = false;
  itemOptionsPerPage = ItemOptionsPerPageArray;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
  ) {}

  ngOnInit(): void {
    this.checkpermission();
  }

  onLimitChange(ev: any) {
    if (!this.incrementdata) return;
    if (ev) {
      this.limit = ev;
      this.getIncrementReportData();
    } else {
      console.log('error');
    }
  }

  onSubmit(val?: any) {
    this.body.exportData = false;
    this.body.branchMasterID = val?.branch;
    this.body.userMasterID = val?.user;
    this.body.companyMasterID = val?.company;
    this.body.limit = this.limit;

    this.getIncrementReportData();
  }

  getIncrementReportData(){
    this.spinner.start();
    this.api
      .callApi(this.constant.INCREMENTREPORT, this.body, 'POST', true, false, true, this.body.exportData)
      .subscribe((res: any) => {
        if (res.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.body.exportData = false;
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, `Increment Report.xlsx`);
        } else {
          if (res.status == 200) {
            this.incrementdata = res.data;
            this.page.totalCount = res.totalcount;
            this.spinner.stop();
          }
        }

      });
      this.finaldata = true
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  clear() {
      this.incrementdata = [];
      this.body = { userMasterID: '', companyMasterID: '', branchMasterID: '', page: 1, limit: 10, exportData: false, view: 'EmployeeSalaryStructure' };
      this.page = {
        totalCount: 0,
        offset: 0,
      };
  }

  onChange(event: any) {
    this.body.page = event.page;
    this.getIncrementReportData()
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
              permissionval.formName == 'EmployeeSalaryStructure' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeeSalaryStructure' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  remove(salaryMasterIds: number, userMasterID: number) {
    const body = {
      userMasterID: userMasterID,
      salaryMasterIDs: [salaryMasterIds],
    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete it?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.start('delete');

        this.api
          .callApi(this.constant.DELETESALARYMASTER, body, 'POST', true, false, true)
          .subscribe(
            (res: any) => {
              if (res.status == 200) {
                this.notifications.create('Done', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: true,
                });
                this.getIncrementReportData();

                this.spinner.stop('delete');
              } else {
                this.notifications.create('Error', res.message, NotificationType.Bare, {
                  theClass: 'outline primary',
                  timeOut: 3000,
                  showProgressBar: false,
                });
                this.spinner.stop('delete');
              }
            },
            (err) => {
              this.notifications.create('Error', err, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: false,
              });
              this.spinner.stop('delete');
            },
          );
      }
    });
  }

  init(val: any){
    this.body.userMasterID = val.map((x) => x.userMasterID)
    this.getIncrementReportData();
  }

  getCompany(companyMasterID: any){
    this.body.companyMasterID = String(companyMasterID);
  }

}
