import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AppNotificationService } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-pending-bonus',
    templateUrl: './pending-bonus.component.html',
    styleUrls: ['./pending-bonus.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PendingBonusComponent implements OnInit {

  @Output('checkEvent') checkEvent = new EventEmitter<any>();
  @Input('showCheckbox') showCheckbox: boolean = false;

  showloader: boolean = false;

filterData = {
    page: 1,
    limit: 10,
    userMasterID: null,
    type: 'Pending'
  }
  currentPage: number = 1;

  amountToPay: number = 0;

  rows: any = [];
  page = {
    totalCount: 0,
    offset: 0,
  }

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private formValueStorageService: FormValueStorageService,
    private notifications: AppNotificationService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    // this.filterData = this.formValueStorageService.getData().EmpBonusPaymentComponent.id;
  }

  getPendingBonusData() {
    this.showloader = true;
    this.api
      .callApi(this.constant.EMPLOYEEBONUSBYUSERID, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalcount;
            setTimeout(() => {
              this.currentPage = this.filterData.page;
            }, 100);
            this.showloader = false
          } else {
            this.commonNotificationService.handleError(res.message)
            this.showloader = false
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message)
          this.showloader = false
        },
      );
  }

  onCheck(event: any, val: any){
    val.checked = event.target?.checked;
    this.checkEvent.emit(val);

    if(event.target?.checked){
      this.amountToPay += val.amount;
    }else{
      this.amountToPay -= val.amount;
    }
  }

  onChange(event: any) {
    if(this.rows.length > 0){
      this.filterData.page = event.page;
      this.getPendingBonusData();
    }
  }
}
