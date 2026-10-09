import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { PerfectScrollbarComponent } from 'src/app/components/perfect-scrollbar/perfect-scrollbar.module';
import { ModalService } from 'src/app/services/modal.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
@Component({
    selector: 'app-user-request-box',
    templateUrl: './user-request-box.component.html',
    styleUrls: ['./user-request-box.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UserRequestBoxComponent implements OnInit {
  @ViewChild('scroll')
  scrollRef: PerfectScrollbarComponent;
  adminRoot = environment.adminRoot;
  messageResData: any = [];
  messageTotalCount: any;
  permissionview: any = [];

  constructor(
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private modalService: ModalService,
    private commonNotificationService: CommonNotificationService,

  ) { }

  ngOnInit(): void {
    this.modalService.userRequestRefresh$.subscribe(() => {
      this.getData();
    });

    this.getData();
  }

  getData() {
    this.api
      .callApi(this.constant.GETUSERINBOXDATA + `?page=1&limit=25`, {}, 'GET', false, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.messageResData = [];
            this.messageTotalCount = res.totalcount;
            res.data.forEach((element) => {
              this.messageResData.push(element);
            });
          } else {
            this.commonNotificationService.handleError('Something Went Wrong!');
          }
        },
        (err) => {
          this.commonNotificationService.handleError('Something Went Wrong!');
        },
      );
  }

  redirect() {
    this.router.navigate([this.adminRoot + '/reuqestInbox']);
  }


  setType(tab: string) {
    const typeMapping = {
      gatePasses: 'Gatepass',
      advancePayments: 'Advance',
      leaveAuthorizations: 'Leave',
      outdoorDutyAuthorizations: 'Outdoor Duty',
      userExpenses: 'Expense',
      loanMasters: 'Loan',
      ticketCategories: 'Ticket',
      userExperiences: 'Experiences',
      userEducations: 'Educations',
      userFamilies: 'Families',
      userDocuments: 'Documents',
      compensatoryOffAuthorizations: 'Compensatory Off',
      userTasks: 'Task',
      attendanceCorrectionAuthorizations: 'Attendace Correction',
      gatePassAuthorizations: 'Employee Gatepass',
      resignationAuthorizations: 'Resignation',
      resignTaskAssigns: 'Resignation Task',
      shortLeaveAuthorizations: 'Short Leave',
      extraDaysAuthorizations: 'Extra Days',
      preboardings: 'Pre-Boarding',
      jobApplications: 'Job-Application',
      preboardingRequests: 'Pre-boarding Request',
    };

    return typeMapping[tab] || '';
  }

  setIcon(tab: string) {
    const iconMappings = {
      gatePasses: 'iconsminds-id-card',
      advancePayments: 'iconsminds-increase-inedit',
      leaveAuthorizations: 'iconsminds-calendar-4',
      outdoorDutyAuthorizations: 'iconsminds-calendar-4',
      userExpenses: 'iconsminds-money-bag',
      loanMasters: 'iconsminds-bank',
      ticketCategories: 'iconsminds-support',
      userFamilies: 'simple-icon-people',
      userEducations: 'iconsminds-book',
      userDocuments: 'iconsminds-project',
      userExperiences: 'simple-icon-star',
      compensatoryOffAuthorizations: 'iconsminds-calendar-4',
      userTasks: 'simple-icon-event',
      attendanceCorrectionAuthorizations: 'iconsminds-calendar-4',
      gatePassAuthorizations: 'iconsminds-id-card',
      resignationAuthorizations: 'iconsminds-calendar-4',
      resignTaskAssigns: 'iconsminds-id-card',
      shortLeaveAuthorizations: 'iconsminds-calendar-4',
      extraDaysAuthorizations: 'iconsminds-calendar-4',
      preboardings: 'simple-icon-event',
      jobApplications: 'simple-icon-event',
      preboardingRequests: 'simple-icon-event',
    };

    return iconMappings[tab] || '';
  }
}
