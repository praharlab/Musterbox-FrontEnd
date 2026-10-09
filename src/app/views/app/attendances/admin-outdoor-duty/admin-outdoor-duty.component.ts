import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { ModalService } from 'src/app/services/modal.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';

@Component({
    selector: 'app-admin-outdoor-duty',
    templateUrl: './admin-outdoor-duty.component.html',
    styleUrls: ['./admin-outdoor-duty.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AdminOutdoorDutyComponent implements OnInit {
  @ViewChild('addOutdoorDuty') addOutdoorDuty: NgForm;
  permissioncreate: any = [];
  permissionview: any = [];
  allusersData: any;
  allBranchData: any;
  allCompanyData: any;
  filterData = {
    companyMasterID: +localStorage.getItem('company_id'),
    branchMasterID: null,
    userMasterID: null,
    dayType: null,
    fromDate: '',
    toDate: '',
    totalDays: 0,
    Remark: '',
  };
  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    this.checkpermission();
    this.getcompany();
  }

  getcompany() {
    const body = {
      companyMasterID: this.filterData.companyMasterID,
    };

    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allCompanyData = res.data;
          this.selectcompany(this.filterData.companyMasterID);
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
              permissionval.formName == 'AdminOutdoorDuty' &&
              permissionval.operationName.includes('View')
            );
          });
          this.permissioncreate = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'AdminOutdoorDuty' &&
              permissionval.operationName.includes('Create')
            );
          });
          this.spinner.stop();
        }
      });
  }

  selectcompany(id) {
    this.filterData.branchMasterID = null;
    this.filterData.userMasterID = null;
    if (id == undefined) {
      window.location.reload();
    } else {
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allBranchData = res;
        });

      const filterData = {
        page: '',
        limit: '',
        companyMasterID: id,
      };
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allusersData = res.data;
          }
        });
    }
  }

  selectbranch(id) {
    this.filterData.userMasterID = null
    const filterData = {
      branchMasterID: id,
    };
    if (id != '' && id != null) {
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allusersData = res.data;

            this.spinner.stop();
          }
        });
    } else {
      const filterData = {
        page: '',
        limit: '',
        companyMasterID: this.filterData.companyMasterID,
      };
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allusersData = res.data;
          }
        });
    }
  }

  calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in milliseconds
    const diffInMs = end.getTime() - start.getTime();

    // Convert milliseconds to days
    return (diffInMs + 1000 * 60 * 60 * 24) / (1000 * 60 * 60 * 24);
  }

  changeDayType() {
    this.filterData.fromDate = '';
    this.filterData.toDate = '';
    if (this.filterData.dayType == 'First Half' || this.filterData.dayType == 'Second Half') {
      this.filterData.totalDays = 0.5;
    } else {
      this.filterData.totalDays = 0;
    }
  }

  changeFromDate() {
    this.filterData.toDate = '';
    if (this.filterData.dayType == 'First Half' || this.filterData.dayType == 'Second Half') {
      this.filterData.totalDays = 0.5;
    } else {
      this.filterData.totalDays = 0;
    }
    if (this.filterData.dayType == 'Full Day' && this.filterData.fromDate) {
      this.filterData.totalDays = 0;

      if (this.filterData.fromDate && this.filterData.toDate) {
        if (this.filterData.fromDate > this.filterData.toDate) {
          return this.commonNotificationService.handleWarning(
            'Fromdate should be less then Or equal to todate ',
          );
        }
        this.filterData.totalDays = this.calculateDays(
          this.filterData.fromDate,
          this.filterData.toDate,
        );
      }
    }
  }

  changeToDate() {
    if (this.filterData.dayType == 'First Half' || this.filterData.dayType == 'Second Half') {
      this.filterData.totalDays = 0.5;
    } else {
      this.filterData.totalDays = 0;
    }
    if (this.filterData.fromDate && this.filterData.toDate) {
      this.filterData.totalDays = this.calculateDays(
        this.filterData.fromDate,
        this.filterData.toDate,
      );
    }
  }

  onSubmit() {
    if (!this.addOutdoorDuty.valid) return;
    if (this.filterData.dayType == 'Full Day') {
      if (this.filterData.fromDate > this.filterData.toDate) {
        return this.commonNotificationService.handleWarning(
          'Fromdate should be less then Or equal to todate ',
        );
      }
    }
    const body = {
      userMasterID: this.addOutdoorDuty.value.employee,
      companyMasterID: this.addOutdoorDuty.value.company,
      FromDate: this.filterData.fromDate,
      ToDate:
        this.filterData.dayType == 'First Half' || this.filterData.dayType == 'Second Half'
          ? this.filterData.fromDate
          : this.filterData.toDate,
      LeaveDays: this.filterData.totalDays,
      Remark: this.addOutdoorDuty.value.Remark,
      DayType: this.filterData.dayType,
    };

    this.spinner.start('add');
    this.api.callApi(this.constant.ADDMYOUTDOORDUTY, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.addOutdoorDuty.resetForm();
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.filterData = {
              companyMasterID: +localStorage.getItem('company_id'),
              branchMasterID: null,
              userMasterID: null,
              dayType: null,
              fromDate: '',
              toDate: '',
              totalDays: 0,
              Remark: '',
            };
            this.ngOnInit();
            this.spinner.stop('add');
          }, 3000);
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop('add');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('add');
      },
    );
  }
}
