import { Component, ViewChild, OnInit, ElementRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-fnf-leave',
    templateUrl: './fnf-leave.component.html',
    styleUrls: ['./fnf-leave.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FnfLeaveComponent implements OnInit {
  @ViewChild('lgModal', { static: false }) lgModal: ModalDirective;
  @ViewChild('leaveBalanceForm') leaveBalanceForm: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  showloader: boolean = false;
  leaveBalance: any = []
  body = {
    companyMasterID: null,
    userMasterID: null,
    yearMonth: '',
    operationType: '',
    LeaveTranId: null,
    balance: null,
    operationFrom:'FNF'
  }

  invalidBalance: boolean = false
  leaveBalanceData: any
  @Output('isLeaveBalanceCompleted') isLeaveBalanceCompleted = new EventEmitter<boolean>();
  @Output('reloadLeaves') reloadLeaves = new EventEmitter<any>();

  constructor(
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
  }

  getLeaveBalanceData() {
    const queryString = `?companyMasterID=${this.body.companyMasterID}&userMasterID=${this.body.userMasterID}`;


    this.showloader = true;
    this.api
      .callApi(this.constant.GETUSERLEAVEBALANCE + queryString, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.leaveBalance = (res.data || []).filter(e => e.LeaveID != 24);
          const filterData = this.leaveBalance.filter((e) => e.Balance > 0).length
          if (filterData > 0) {
            this.isLeaveBalanceCompleted.emit(false)
          } else {
            this.isLeaveBalanceCompleted.emit(true)
          }
          this.showloader = false;
        } else {
          this.commonNotificationService.handleError(res.message);
          this.showloader = false;
        }
      },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.showloader = false;
        },
      );

  }

  leaveAction(leave: any, operationType: string) {


    this.body.operationType = operationType
    this.body.LeaveTranId = leave.LeaveTranId
    this.leaveBalanceData = leave;
    this.lgModal.show()
  }
  onSubmit() {
    if (!this.leaveBalanceForm.valid) {
      return;
    }
    if (this.leaveBalanceForm.value.balance % 0.25 != 0) {
      this.invalidBalance = true;
      return
    }
    if (this.leaveBalanceForm.value.balance > this.leaveBalanceData.Balance) {
      return this.commonNotificationService.handleWarning(`User Don't Have Sufficient Balance`)
    }
    if (this.leaveBalanceForm.value.balance < 0) {
      return this.commonNotificationService.handleWarning(`Balance Can Not be Less then Zero`)
    }
    this.showloader = true;
    this.invalidBalance = false;
    this.body.balance = this.leaveBalanceForm.value.balance;

    this.api
      .callApi(this.constant.MANAGELEAVEBALANCE, this.body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message)
          this.closeModalFunction();
        } else if (res.status == 401) {
          this.commonNotificationService.handleWarning(res.message)
        }
        this.showloader = false;
      }, (error) => {
        this.showloader = false;
        this.commonNotificationService.handleSuccess(error.error.message)
      });
  }

  preventArrowKeys(event: KeyboardEvent) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
    }
  }

  closeModalFunction() {
    this.leaveBalanceForm.resetForm();
    this.reloadLeaves.emit()
    this.leaveBalanceData = null
    this.lgModal.hide();
  }
}
