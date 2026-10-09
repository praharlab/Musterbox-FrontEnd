import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';
import { ListAddLeaveBalanceMasterComponent } from '../../list-add-leave-balance-master/list-add-leave-balance-master.component';
import { ListLeaveEncashmentMasterComponent } from '../../list-leave-encashment-master/list-leave-encashment-master.component';
import { ApprovedLeaveTransactionMasterComponent } from '../../approved-leave-transaction-master/approved-leave-transaction-master.component';
import { LapseLeaveMasterComponent } from '../../lapse-leave-master/lapse-leave-master.component';
import { NgForm } from '@angular/forms';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-view-leave-balance',
    templateUrl: './view-leave-balance.component.html',
    styleUrls: ['./view-leave-balance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViewLeaveBalanceComponent implements OnInit {

  @ViewChild('ListAddLeaveBalanceMasterComponent') listAddLeaveBalanceMasterComponent: ListAddLeaveBalanceMasterComponent;
  @ViewChild('ListLeaveEncashmentMasterComponent') listLeaveEncashmentMasterComponent: ListLeaveEncashmentMasterComponent;
  @ViewChild('ApprovedLeaveTransactionMasterComponent') approvedLeaveTransactionMasterComponent: ApprovedLeaveTransactionMasterComponent;
  @ViewChild('LapseLeaveMasterComponent') lapseLeaveMasterComponent: LapseLeaveMasterComponent;

  @ViewChild('filterForm') filterForm: NgForm;
  selectedFromMonth: string = ''
  selectedToMonth: string = ''

  scrollBarHorizontal = window.innerWidth < 1201;
  adminRoot = environment.adminRoot;
  filterData = {
    userMasterID: null,
    fromMonth: '',
    toMonth: '',
    limit: 10
  }

  itemOptionsPerPage = ItemOptionsPerPageArray;

  page = {
    page: 1,
    limit: 10
  }
  leaveData: any = {}

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
    const protectedRoutes = [
      this.adminRoot + '/payrolls/manage-leave-balance',
      this.adminRoot + '/payrolls/manage-leave-balance/view',
    ];

    const isProtectedRoute = protectedRoutes.some((route) => router.url.includes(route));
    if (!isProtectedRoute) {
      formValueStorageService.removeData('ListManageLeaveBalanceComponent', false);
    }
  }

  ngOnInit(): void {
    this.filterData.userMasterID = this.formValueStorageService.getData().ListManageLeaveBalanceComponent.id;
    const currentDate = new Date();
    this.filterData.toMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`.replace('-', ''); // Current month in 'YYYY-MM' format
    this.selectedToMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    this.filterData.fromMonth = `${sixMonthsAgo.getFullYear()}-${(sixMonthsAgo.getMonth() + 1).toString().padStart(2, '0')}`.replace('-', '');
    this.selectedFromMonth = `${sixMonthsAgo.getFullYear()}-${(sixMonthsAgo.getMonth() + 1).toString().padStart(2, '0')}`
  }

  ngAfterViewInit(): void {
    
    setTimeout(() => {
      if (this.listAddLeaveBalanceMasterComponent) {
        this.listAddLeaveBalanceMasterComponent.setData(this.filterData);
        this.listAddLeaveBalanceMasterComponent.getAllData()
      }

      if (this.listLeaveEncashmentMasterComponent) {
        this.listLeaveEncashmentMasterComponent.setData(this.filterData);
        this.listLeaveEncashmentMasterComponent.getAllData()
      }

      if (this.approvedLeaveTransactionMasterComponent) {
        this.approvedLeaveTransactionMasterComponent.setData(this.filterData);
        this.approvedLeaveTransactionMasterComponent.getAllData()
      }

      if (this.lapseLeaveMasterComponent) {
        this.lapseLeaveMasterComponent.setData(this.filterData);
        this.lapseLeaveMasterComponent.getAllData()
      }
    })
  }

  onSubmit(){

    this.filterData.fromMonth = this.filterForm.value.fromMonth.replace('-', '');
    this.filterData.toMonth = this.filterForm.value.toMonth.replace('-', '');

    if (this.listAddLeaveBalanceMasterComponent) {
      this.listAddLeaveBalanceMasterComponent.setData(this.filterData);
      this.listAddLeaveBalanceMasterComponent.getAllData()
    }

    if (this.listLeaveEncashmentMasterComponent) {
      this.listLeaveEncashmentMasterComponent.setData(this.filterData);
      this.listLeaveEncashmentMasterComponent.getAllData()
    }

    if (this.approvedLeaveTransactionMasterComponent) {
      this.approvedLeaveTransactionMasterComponent.setData(this.filterData);
      this.approvedLeaveTransactionMasterComponent.getAllData()
    }

    if (this.lapseLeaveMasterComponent) {
      this.lapseLeaveMasterComponent.setData(this.filterData);
      this.lapseLeaveMasterComponent.getAllData()
    }

  }

  onLimitChange(ev: any) {
    if (ev) {
      this.filterData.limit = ev;
      if (this.listAddLeaveBalanceMasterComponent) {
        this.listAddLeaveBalanceMasterComponent.setData(this.filterData);
        this.listAddLeaveBalanceMasterComponent.getAllData()
      }

      if (this.listLeaveEncashmentMasterComponent) {
        this.listLeaveEncashmentMasterComponent.setData(this.filterData);
        this.listLeaveEncashmentMasterComponent.getAllData()
      }

      if (this.approvedLeaveTransactionMasterComponent) {
        this.approvedLeaveTransactionMasterComponent.setData(this.filterData);
        this.approvedLeaveTransactionMasterComponent.getAllData()
      }

      if (this.lapseLeaveMasterComponent) {
        this.lapseLeaveMasterComponent.setData(this.filterData);
        this.lapseLeaveMasterComponent.getAllData()
      }
    }
  }

}
