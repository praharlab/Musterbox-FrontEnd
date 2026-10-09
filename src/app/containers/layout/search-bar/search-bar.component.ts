import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

interface Item {
  formName: string;
  path: string | null;
  menuName: string | null;
  parent: string | null;
}

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SearchBarComponent implements OnInit {
  searchData: Item[] = [];
  searchTerm: undefined;
  adminRoot = environment.adminRoot;

  constructor(
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
  ) {}

  ngOnInit(): void {
    this.getSearchData();
  }

  onSearchSelect(item) {
    if (!item) {
      this.searchTerm = undefined;
      return;
    }
    this.router.navigate([this.adminRoot + item.path]).then(() => {
      setTimeout(() => {
        this.searchTerm = undefined;
      });
    });
  }

  getSearchData() {
    this.api.callApi(this.constant.SEARCHUSERPAGES, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        this.searchData = res.data;
        setTimeout(() => {
          this.onSearchSelect(undefined);
        });
      },
      (err) => {
        this.notifications.create('Error', 'Notable Get Search Data!', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 2000,
          showProgressBar: false,
        });
      },
    );
  }
}
