import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-employee-policy',
    templateUrl: './employee-policy.component.html',
    styleUrls: ['./employee-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EmployeePolicyComponent implements OnInit {
  @ViewChild('filterdate') filterdate: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];

  rows = [];
  apiURL = environment.apiUrl;
  display = false;
  userModalLeftPosition: any;
  userModalTopPosition: any;
  eventUserMasterId: any;

  ColumnMode = ColumnMode.force;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  scrollBarHorizontal = window.innerWidth < 1201;
  body1 = {
    page: 1,
    limit: 10,
    userMasterID: [],
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  permissionview: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private router: Router,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }
  limit = 10;

  ngOnInit() {
    this.body1 = {
      page: 1,
      limit: 10,
      userMasterID: [],
    };
    this.limit = 10;
    this.page = {
      totalCount: 0,
      offset: 0,
    };

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
          // this.permissiondelete = permission.filter((permissionval) => { return permissionval.formName == 'Attendance' && permissionval.operationName.includes('Delete') });
          // this.permissionedit = permission.filter((permissionval) => { return permissionval.formName == 'Attendance' && permissionval.operationName.includes('Edit') });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'EmployeePolicy' && permissionval.operationName.includes('View')
            );
          });
          // this.permissioncreate = permission.filter(permissionval => { return permissionval.formName == 'Attendance' && permissionval.operationName.includes('Create') });
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

  onSubmit(val: any) {
    this.body1.userMasterID = val?.user;
    this.getAllEmployeePolicy()
  }

  getAllEmployeePolicy() {
    this.api.showLoader(true);
    this.api
      .callApi(this.constant.GETEMPLOYEEPOLICY, this.body1, 'POST', false, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            if (this.rows.length > 0) {
              this.showButtons.push(CommonFilterButtonFields.Excel)
            } else {
              this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
            }
            this.page.totalCount = res.totalcount;
            this.api.dismissLoader();
          } else {
            this.handleError(res.message);
            this.api.dismissLoader();
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.api.dismissLoader();
        },
      );
  }

  onChange(e: any) {
    if (e) {
      this.body1.page = e.offset + 1;
      this.getAllEmployeePolicy();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  onLimitChange(ev: any) {
    if (ev) {
      this.body1.limit = ev;
      this.limit = this.body1.limit;
      this.getAllEmployeePolicy();
    } else {
      this.handleError('Something Went Wrong!');
    }
  }

  clear() {
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
    this.rows = [];
    this.body1.userMasterID = null
  }

  padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  formatDate1(date) {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('-');
  }

  download() {

    const filterData = {
      userMasterID: this.body1.userMasterID,
      Export: 'true'
    };

    this.spinner.start('a');
    this.api
      .callApi(this.constant.GETEMPLOYEEPOLICY, filterData, 'POST', false, false, true, true)
      .subscribe((res: any) => {
        if (res.type == 'application/json') {
          this.handleError('No data found to export!')
          this.spinner.stop('a');
        } else {
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, `Employee Policy.xlsx`);

          this.spinner.stop('a');
        }
      },
        (err) => {

          this.handleError(err.error.message || 'Someting Went Wrong!')
          this.spinner.stop('a');
        },);
  }

  onActivate(event) {
    if (event.type == 'click') {
      this.display = false;
    }
    if (event.cellIndex == 1) {
      this.display = !this.display;
      this.eventUserMasterId = event.row.userMasterID;
      this.userModalLeftPosition = event.event.pageX + 79 + 'px';
      this.userModalTopPosition = event.event.pageY - 223 + 'px';
    }
  }
  onChildEvent(data: boolean) {
    this.display = data;
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  init(val: any) {
    this.body1.userMasterID = val.map((x) => x.userMasterID)
    this.getAllEmployeePolicy();
  }
}
