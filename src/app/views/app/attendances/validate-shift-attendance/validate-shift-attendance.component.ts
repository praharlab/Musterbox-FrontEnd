import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-validate-shift-attendance',
    templateUrl: './validate-shift-attendance.component.html',
    styleUrls: ['./validate-shift-attendance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ValidateShiftAttendanceComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];

  apiURL = environment.apiUrl;

  itemOptionsPerPage = ItemOptionsPerPageArray;

  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    userMasterID: '',
    companyMasterID: '',
    startdate: '',
    enddate: '',
    shiftID: '',
    updateByIp: '',
    updateBy: '',
    shiftSelection:''
  };
  shiftId: any

  permissionview: any = [];

  allshift: any;
  ipAddress: any;

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
              permissionval.formName == 'ShiftValidate' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  onSubmit(val?: any) {
    this.filterData.userMasterID = val?.user;
    this.filterData.startdate = val?.startdate.slice(0, 10);
    this.filterData.enddate = val?.enddate.slice(0, 10);
    this.filterData.companyMasterID = val?.company;
    this.filterData.shiftID = this.shiftId;
    this.filterData.updateByIp = this.ipAddress;
    this.filterData.updateBy = localStorage.getItem('id');
    this.filterData.shiftSelection = val?.shiftSelection

    this.spinner.start('shift');
    this.api
      .callApi(this.constant.SHIFTUPDATE, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            let updatedUserId = res.notattendanceVerifyUser;
            let VerifyUser = res.attendanceVerifyUserData;

            if (updatedUserId != '' && VerifyUser != '') {
              this.notifications.create(updatedUserId, VerifyUser, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 5000,
                showProgressBar: true,
              });
              setTimeout(() => {
                this.spinner.stop('shift');
              }, 5000);
            } else if (updatedUserId == '' && VerifyUser != '') {
              this.notifications.create(' ', VerifyUser, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 5000,
                showProgressBar: true,
              });
              setTimeout(() => {
                this.spinner.stop('shift');
              }, 5000);
            } else if (updatedUserId != '' && VerifyUser == '') {
              this.notifications.create(updatedUserId, '', NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 5000,
                showProgressBar: true,
              });
              setTimeout(() => {
                this.spinner.stop('shift');
              }, 5000);
            } else {
              this.notifications.create('Done', 'No Change In Data', NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 5000,
                showProgressBar: true,
              });
              setTimeout(() => {
                this.spinner.stop('shift');
              }, 5000);
            }
          } else {
            this.notifications.create('Error', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            setTimeout(() => {
              this.spinner.stop('shift');
            }, 5000);
          }
        },
        (err) => {
          this.notifications.create('Error', err, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('shift');
        },
      );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  clear() {
    this.filterData.userMasterID = '';
    this.filterData.companyMasterID = '';
    this.filterData.startdate = '';
    this.filterData.enddate = '';
    this.filterData.shiftID = '';
    this.shiftId = ''
    this.filterData.updateByIp = '';
    this.filterData.updateBy = '';
    this.filterData.shiftSelection = '';
  }

  getCompany(companyMasterID: number){
    this.spinner.start('shiftData');
    this.api
      .callApi(this.constant.SHIFTBYCOMPANYDATA2 + companyMasterID, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allshift = res.data;
          this.spinner.stop('shiftData');
        }
      });
  }

  onShiftChange(val: any){
    this.shiftId = val
  }
}
