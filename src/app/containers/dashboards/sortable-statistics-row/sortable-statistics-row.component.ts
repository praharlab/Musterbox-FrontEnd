import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { ProfileStatusService } from 'src/app/services/profile-status.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';

@Component({
    selector: 'app-sortable-statistics-row',
    templateUrl: './sortable-statistics-row.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SortableStatisticsRowComponent {
  id: any;
  itemsRow = [1, 2, 3, 4];
  profileStatusTrueCount: number = 0;
  profileStatusFalseCount: number = 0;
  profileStatusData: any = [];

  @Input()
  set userId(userId: any) {
    this.id = userId;
  }

  userID: any;

  constructor(
    private profileStatusService: ProfileStatusService,
    private api: ApiService,
    private notifications: AppNotificationService,
    private constant: ConstantService,
  ) {}

  ngOnInit() {
    this.userID = localStorage.getItem('id');

    this.profileStatusService.profileStatusRefresh$.subscribe(() => {
      this.getdata();
    });
  }

  getdata() {

    const filterData = {
      page: 1,
      limit: 1,
      users: [this.id],
      userMasterID: this.userID,
    };

    this.api
      .callApi(this.constant.GETPROFILEPERCENTAGE, filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.profileStatusData = res.data[0];
            this.profileStatusTrueCount = this.profileStatusData.profilePercentage;
          } else {
            this.handleError(res.message);
          }
        },
        (err) => {
          this.handleError(err.error.message);
        },
      );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
