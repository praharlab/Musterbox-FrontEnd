import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ModalService } from 'src/app/services/modal.service';


@Component({
    selector: 'app-add-loan-userwise',
    templateUrl: './add-loan-userwise.component.html',
    styleUrls: ['./add-loan-userwise.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddLoanUserwiseComponent implements OnInit {
  @ViewChild('addloanMaster') addloanMaster: NgForm;
  adminRoot = environment.adminRoot;

  isdisabled = false;
  childcompany: any;
  ipAddress: any;
  usertype: any;
  company_id: any;
  allcomp: any;
  company: any;
  yearmonth: any;
  employee: any;
  userMaster: any;
  datearr: any[];
  type: any;
  i: any;
  selected: boolean = false;
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private datepipe: DatePipe,
    private modalService: ModalService

  ) { }

  ngOnInit(): void {
    this.getIPAddress();
  }

  onSubmit() {
    if (!this.addloanMaster.valid) {
      return;
    }
    let body = {
      companyMasterID: localStorage.getItem('company_id'),
      userMasterID: localStorage.getItem('id'),
      LoanAmount: this.addloanMaster.value.loanAmount,
      LoanRemark: this.addloanMaster.value.loanRemark,
      // loanstatus:this.addloanMaster.value.loanstatus,
      // rejectionremarks:this.addloanMaster.value.rejectionremarks,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.spinner.start();
    this.api.callApi(this.constant.LOANUSERREQUEST, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', 'Loan Added successfully', NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.modalService.refreshUserRequestStatus();
            this.router.navigate(['app/finances/loanUserwise']);
            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
