import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { DatePipe } from '@angular/common';
import { CommonFilterButtonFields, CommonFilterFields, CommonRequiredFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-short-leave-cancellation',
    templateUrl: './short-leave-cancellation.component.html',
    styleUrls: ['./short-leave-cancellation.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ShortLeaveCancellationComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('accept') accept: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('closeModal') closeModal: ElementRef;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showRequiredFields: any = [CommonRequiredFields.Company]
  
  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode.force;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    userMasterID: null,
    companyMasterID: +localStorage.getItem('company_id')
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  permissionview: any = [];
  leavedata: any;
  leaveDate: any;
  type: string;
  
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
      userMasterID: null,
      companyMasterID: +localStorage.getItem('company_id')
    };
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
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'ShortLeaveCancellation' &&
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
    this.filterData.userMasterID = val.user ? val.user : this.filterData.userMasterID;
    this.filterData.companyMasterID = val.company ? val.company : null;
    this.getShortLeave()
  }

  getShortLeave() {
    this.spinner.start('oninit2');

    this.api
      .callApi(this.constant.LISTUSERSHORTLEAVEFORCANCELSHORTLEAVE, this.filterData, 'POST', true, false, true)
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

  alertDeactiveConfirmation(row) {
    this.leavedata = row;
    this.type ='Short Leave';
    this.leaveDate = this.datePipe.transform(row.date, 'dd-MM-yyyy');
  }

  cancel() {
    if (!this.accept.valid) {
      return;
    }

    let body = {
      userShortLeaveId: this.leavedata.userShortLeaveId,
      cancelRemarks: this.accept.value.cancelRemarks,
      updateBy: localStorage.getItem('id'),
    };

    this.spinner.start('cancel');
    this.api
      .callApi(this.constant.CANCELSHORTLEAVE, body, 'POST', true, false, true)
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
          this.getShortLeave();
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
          this.getShortLeave();
        }
      });
  }

  clear() {
    this.filterData.userMasterID = null;
    this.filterData.companyMasterID = null;
    this.rows = [];
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  getCompany(companyMasterID: number){
    this.filterData.companyMasterID = companyMasterID;
    this.getShortLeave()
  }

  emitUsers(users: any){
    this.filterData.userMasterID = users.map((x) => x.userMasterID);
  }
}
