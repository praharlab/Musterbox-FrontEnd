import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonFilterButtonFields, CommonFilterFields } from 'src/app/constants/CommonFilterFields';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-manage-leave-balance',
    templateUrl: './manage-leave-balance.component.html',
    styleUrls: ['./manage-leave-balance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ManageLeaveBalanceComponent implements OnInit {

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status, CommonFilterFields.Department, CommonFilterFields.Designation, CommonFilterFields.Division, CommonFilterFields.Project, CommonFilterFields.SalaryType, CommonFilterFields.SkillCategory, CommonFilterFields.WorkingArea];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear, CommonFilterButtonFields.Cancel];

  selectedOperationType: string;
  selectedLeave: string;
  selectedMonth: string = '';
  minMonth: string = '';
  maxMonth: string = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  companyMasterID: number = null;
  allLeaves: any = [];
  adminRoot = environment.adminRoot;
  invalidBalance: boolean = false
  balanceVal: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
  }

  onSubmit(val: any) {
    if(val.balance % 0.25 != 0){
      this.invalidBalance = true;
      return
    }
    this.spinner.start('manageLeave');
    this.invalidBalance = false;
    const filterData = {
      userMasterID: [],
      yearMonth: '',
      operationType: '',
      LeaveTranId: null,
      balance: null
    }

    filterData.userMasterID = val.user;
    filterData.yearMonth = val.month.replace('-', '');
    filterData.operationType = val.operationType;
    filterData.LeaveTranId = val.LeaveTranId;
    filterData.balance = val.balance;

    this.api
      .callApi(this.constant.MANAGELEAVEBALANCE, filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/payrolls/manage-leave-balance']);
          }, 3000);
        }else if(res.status == 401){
          this.notifications.create('Warning', res.message, NotificationType.Warn, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
        }
        this.spinner.stop('manageLeave');
      }, (error) => {
        this.spinner.stop('manageLeave');
        this.handleError(error.error.message);
      });
  }

  getAllLeaves() {
    this.spinner.start('getLeaves');
    this.api
      .callApi(
        this.constant.LISTLEAVETYPEFORMANAGELEAVE + '/' + this.companyMasterID,
        {},
        'GET',
        false,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allLeaves = res.data;
        }

        this.spinner.stop('getLeaves');
      }, (err) => {
        this.handleError(err.error.message)
        this.spinner.stop('getLeaves');
      });
  }

  updateMonthLimits() {
    this.selectedMonth = '';
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0'); // Ensures 2-digit month format

    if (this.selectedOperationType === 'AddLeaveBalance') {
      // No min limit, max set to current month
      this.minMonth = '';
      this.maxMonth = `${currentYear}-${currentMonth}`;
    } else if (this.selectedOperationType === 'Lapse') {
      // Only current month is allowed
      this.minMonth = `${currentYear}-${currentMonth}`;
      this.maxMonth = `${currentYear}-${currentMonth}`;
    } else if (this.selectedOperationType === 'Encashment') {
      // Only previous and current month allowed
      const prevMonthDate = new Date();
      prevMonthDate.setMonth(today.getMonth() - 1);
      const prevYear = prevMonthDate.getFullYear();
      const prevMonth = String(prevMonthDate.getMonth() + 1).padStart(2, '0');

      this.minMonth = `${prevYear}-${prevMonth}`;
      this.maxMonth = `${currentYear}-${currentMonth}`;
    } else {
      // Default state - clear restrictions
      this.minMonth = '';
      this.maxMonth = `${currentYear}-${currentMonth}`;
    }
  }

  getCompany(val: any) {
    this.companyMasterID = val;
    this.getAllLeaves()
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  preventArrowKeys(event: KeyboardEvent) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
    }
  }
}
