import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NotificationComponent implements OnInit {
  notificationList: any = [];
  apiURL = environment.apiUrl;
  showViewButton: boolean = false;
  notificationcount: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.getNotification();
  }

  getNotification() {
    let announcementID = this.activatedRoute.snapshot.params.id;
    let body = {
      limit: 10,
      page: 1,
      userMasterID: localStorage.getItem('id'),
    };

    this.spinner.start();
    this.api.callApi(this.constant.GETNOTIFICATION, body, 'POST', false, true, true).subscribe(
      (res: any) => {
        this.notificationList = res.data;
        this.spinner.stop();
        this.checkViewButtonVisibility();
      },
      (err) => {
        console.log('error', err);
      },
    );
  }

  checkViewButtonVisibility() {
    this.showViewButton = this.notificationList.some((item: any) => {
      return !this.isImage(item.attachment);
    });
  }

  isImage(fileUrl: string): boolean {
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    return extension === 'png' || extension === 'jpg' || extension === 'jpeg';
  }

  handleViewButtonClick(attachment: string) {
    if (!this.isImage(attachment)) {
      const fileUrl = `${this.apiURL}uploads/announcement/${attachment}`;
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', 'file');
      link.click();
    }
  }

  view(att: any) {
    window.open(this.apiURL + 'uploads/announcement/' + att, '_blank');
  }
}
