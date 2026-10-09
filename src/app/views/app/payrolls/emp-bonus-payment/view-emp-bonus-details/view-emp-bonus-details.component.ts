import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { PaidBonusComponent } from '../../paid-bonus/paid-bonus.component';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { PendingBonusComponent } from '../../pending-bonus/pending-bonus.component';
import { NgForm } from '@angular/forms';
import { paymentMode } from 'src/app/constants/commonVariables';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { AppNotificationService } from 'src/app/services/app-notification.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-view-emp-bonus-details',
    templateUrl: './view-emp-bonus-details.component.html',
    styleUrls: ['./view-emp-bonus-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViewEmpBonusDetailsComponent implements OnInit {

  @ViewChild('PaidBonusComponent') paidBonusComponent: PaidBonusComponent;
  @ViewChild('PendingBonusComponent') pendingBonusComponent: PendingBonusComponent;

  @ViewChild('bonusForm') bonusForm!: NgForm
  adminRoot = environment.adminRoot;
  public paymentModes = paymentMode;
  paymentMode: any;
  employeeBonusIds: any = []

  filterData = {
    userMasterID: null
  }

  amountToPay: number = 0;
  currentMonth: string;
  maxMonth: string = '';

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    this.currentMonth = new Date().toISOString().slice(0, 7);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0'); // Ensures 2-digit month format
    this.maxMonth = `${currentYear}-${currentMonth}`;
    this.filterData.userMasterID = this.formValueStorageService.getData()?.EmpBonusPaymentComponent?.id;
    setTimeout(() => {
      this.paidBonusComponent.filterData.userMasterID = this.filterData.userMasterID;
      this.paidBonusComponent.getPaidBonusData();

      this.pendingBonusComponent.filterData.userMasterID = this.filterData.userMasterID;
      this.pendingBonusComponent.getPendingBonusData();
    });
  }


  checkEvent(val: any) {
    if (val?.checked) {
      this.employeeBonusIds.push(val?.id)
      this.amountToPay += val.amount;
    } else {
      if (this.employeeBonusIds.findIndex(x => x == val?.id) != -1) {
        this.employeeBonusIds.splice(this.employeeBonusIds.findIndex(x => x == val?.id), 1);
      }
      this.amountToPay -= val.amount;
    }
  }

}
