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
    selector: 'app-outdoor-duty-cancellation',
    templateUrl: './outdoor-duty-cancellation.component.html',
    styleUrls: ['./outdoor-duty-cancellation.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class OutdoorDutyCancellationComponent implements OnInit {
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
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
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
  limit = 10;
  company_id: any;
  leavedata :any;
 

  UserMasterIDS: any;
  type: string;
  leaveDate: string;

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
    this.company_id = localStorage.getItem('company_id');
    this.filterData = {
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
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'OutdoorDutyCancellation' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit(val?: any) {
    this.filterData.userMasterID = val?.user ? val?.user : this.filterData.userMasterID;
    this.getAllData();
  }

  getAllData(){
    this.spinner.start('oninit2');
    this.api
      .callApi(this.constant.OUTDOORDUTYCANCELLIST, this.filterData, 'POST', true, false, true)
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
      )
  }

  alertDeactiveConfirmation(row) {
    
    this.leavedata = row;
    this.UserMasterIDS = row.userLeave.userMaster.userMasterID;
    this.type ='Outdoor Duty';
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
      userMasterID: this.UserMasterIDS,
    };

    this.spinner.start('cancel');
    this.api
      .callApi(this.constant.LEAVECANCEL, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create(
            'Success',
            'Outdoor Duty Cancel Successfully.',
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
          this.getAllData();
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
          this.getAllData();
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
