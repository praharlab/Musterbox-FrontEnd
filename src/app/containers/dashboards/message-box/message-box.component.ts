import { Component, Input, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-message-box',
    templateUrl: './message-box.component.html',
    styleUrls: ['./message-box.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MessageBoxComponent implements OnInit {
  employeedata: any;
  showloader: any = 'true';
  employee: any;
  company: any;
  allbranch: any;
  company_id: string;
  leavependingCount: number = 0;
  loanCount: number = 0;
  OTcount: number = 0;
  leaveapproveCount: number = 0;
  loanapprove: number = 0;
  OTapprove: number = 0;
  leaverejectedCount: number = 0;
  loanrejected: number = 0;
  OTrejected: number = 0;
  TotalLeaveCount: number = 0;
  ToataLoanCount: number = 0;
  TotalOverTimeCount: number = 0;
  advanceapprove: number = 0;
  advancerejected: number = 0;
  advancependingCount: number = 0;
  expenseAuthorizationsapprove: number = 0;
  expenseAuthorizationsrejected: number = 0;
  expenseAuthorizationspendingCount: number = 0;
  adminRoot = environment.adminRoot;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,

    private router: Router,
  ) {}

  ngOnInit(): void {
    this.showdata();
  }

  // count

  showdata() {
    const body = {
      userMasterID: localStorage.getItem('id'),
      // company_id: localStorage.getItem('company_id'),
    };
    this.api
      .callApi(this.constant.PENDINGREQUEST, body, 'POST', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.leavependingCount = res.leaveCount;
          // this.loanCount = res.loanCount;
          this.OTcount = res.OTcount;
          // this.advancependingCount = res.AdvanceCount;
          this.expenseAuthorizationspendingCount = res.expenseAuthorizationsCount;
          //approve
          this.leaveapproveCount = res.leaveapprove;
          // this.loanapprove = res.loanapprove;
          this.OTapprove = res.Otapprove;
          // this.advanceapprove = res.advanceapprove;
          this.expenseAuthorizationsapprove = res.expenseAuthorizationsapprove;
          //rejected
          this.leaverejectedCount = res.leaveRejected;
          // this.loanrejected = res.loanRejected;
          this.OTrejected = res.OTrejected;
          // this.advancerejected = res.advanceRejected;
          this.expenseAuthorizationsrejected = res.expenseAuthorizationsRejected;
        }
        this.showloader = 'false';
      });
  }

  //leave,expense,overtime
  ViewstatusAll(e: any, tableName: any) {
    let bb1 = {
      userMasterID: localStorage.getItem('id'),
      authstatus: +e,
      tableName: tableName,
    };
    this.showloader = 'true';
    this.api
      .callApi(this.constant.UPDATEVIEWSTATUSLEAVE, bb1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.showloader = 'false';
          if (tableName == 'leave') {
            this.router.navigate([this.adminRoot + '/attendances/leave_auth_request/' + `${e}`]);
          } else if (tableName == 'overtime') {
            this.router.navigate([this.adminRoot + '/overtimes/overtime_request/' + `${e}`]);
          } else if (tableName == 'expense') {
            this.router.navigate([this.adminRoot + '/finances/expense_request']);
          }
        }
      });
  }
}
