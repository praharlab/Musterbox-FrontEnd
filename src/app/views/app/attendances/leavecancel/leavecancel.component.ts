import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-leavecancel',
    templateUrl: './leavecancel.component.html',
    styleUrls: ['./leavecancel.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LeavecancelComponent implements OnInit {
  @ViewChild('accept') accept: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('closeModal') closeModal: ElementRef;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]

  rows = [];
  rows1 = [];
  selected: any = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: null,
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  filter: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;
  company_id: any;
  alluser: any;
  company1: any;
  cid: string;
  allasset: any = [];
  selected2: any = [];
  salary: boolean;
  companymasterName: any;
  employee: any;
  allbranch: any;
  branchfilter: boolean = false;
  employeedata: any;
  leavedata:any;
  type: string;
  leaveDate: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
     private datePipe: DatePipe
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.filterData = {
      page: 1,
      limit: 10,
      userMasterID: null,
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
          this.permissiondelete = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'LeaveCancellation' &&
              permissionval.operationName.includes('Delete')
            );
          });
          this.permissionedit = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'LeaveCancellation' &&
              permissionval.operationName.includes('Edit')
            );
          });
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'LeaveCancellation' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit(val?: any) {
    if(val?.user)
    this.filterData.page = 1;

    this.filterData.userMasterID = val?.user ? val?.user : this.filterData.userMasterID;
    this.spinner.start('oninit2');

    this.api
      .callApi(this.constant.LEAVECANCELLIST, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            this.spinner.stop('oninit2');
          } else {
            this.handleError(res.message);
            this.spinner.stop('oninit2');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('oninit2');
        },
      );
  }

  onItemsPerPageChange(itemCount): void {
    this.itemsPerPage = itemCount;
  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.onSubmit();
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.filterData.limit = this.filterData.limit;
    this.onSubmit();
  }

  alertDeactiveConfirmation(row) {
    this.leavedata = row;
    this.leaveDate = this.datePipe.transform(row.date, 'dd-MM-yyyy');
  }

  cancel() {
    if (!this.accept.valid) {
      return;
    }

    let body = {
      userLeaveTransactionID: this.leavedata['userLeaveTransactionID'],
      LeaveCancelRemark: this.accept.value.remarks,
      updateBy: localStorage.getItem('id'),
      userMasterID: this.leavedata['userMasterID'],
    };

    this.spinner.start('cancel');
    this.api
      .callApi(this.constant.LEAVECANCEL, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create(
            'Success',
            res.message,
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            },
            setTimeout(() => { }, 3000),
          );
          this.closeModal.nativeElement.click();
          this.accept.resetForm();
          this.spinner.stop('cancel');
          this.onSubmit();
        } else {
          this.notifications.create(
            'Error',
            'Error!',
            NotificationType.Error,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
            setTimeout(() => { }, 3000),
          );
          this.closeModal.nativeElement.click();
          this.accept.resetForm();
          this.spinner.stop('cancel');
          this.onSubmit();
        }
      });
  }

  clear() {
    this.rows = [];
    setTimeout(() => {
      this.ngOnInit();
    }, 100);
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  init(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }

  emitUsers(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
