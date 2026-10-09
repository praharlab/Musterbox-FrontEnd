import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-list-add-leave-balance-master',
    templateUrl: './list-add-leave-balance-master.component.html',
    styleUrls: ['./list-add-leave-balance-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ListAddLeaveBalanceMasterComponent implements OnInit {

  rows: any = [];
  page = {
    totalCount: 0,
    offset: 0,
  };

  filterData = {
    page: 1,
    limit: 10,
    userMasterID: null,
    exportData: false,
    fromMonth: '',
    toMonth: '',
    status: 1
  };
  scrollBarHorizontal = window.innerWidth < 1201;

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
    // this.getAllData()
  }

  onPageChange(data) {
    this.filterData.page = data.page;
    this.filterData.limit = data.itemsPerPage;
    this.getAllData();
  }

  getAllData() {
    this.spinner.start('getAll');
    this.api
      .callApi(this.constant.GETADDEDLEAVEBALANCEBYUSER, this.filterData, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.page.totalCount = res.totalCount;
        }
        this.spinner.stop('getAll');
      });
  }

  setData(data?: any){
    this.filterData.userMasterID = data.userMasterID;
    this.filterData.fromMonth = data.fromMonth;
    this.filterData.toMonth = data.toMonth;
    this.filterData.limit = data.limit;
  }

}
