import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-company-structure',
    templateUrl: './company-structure.component.html',
    styleUrls: ['./company-structure.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CompanyStructureComponent implements OnInit {
  items: any;

  constructor(
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.allparentform();
  }
  allparentform() {
    this.api
      .callApi(this.constant.REPORTTO1 + localStorage.getItem('id'), {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.items = res.data[0];
        }
      });
  }
}
