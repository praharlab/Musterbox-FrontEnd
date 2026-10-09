import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';

@Component({
    selector: 'app-company-subscription-plan-expiration',
    templateUrl: './company-subscription-plan-expiration.component.html',
    styleUrls: ['./company-subscription-plan-expiration.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CompanySubscriptionPlanExpirationComponent implements OnInit {
  showloader: boolean = true;
  getReponseData: any;

  constructor(
    private api: ApiService,
    private constant: ConstantService,
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.api
      .callApi(this.constant.CHECKSUBSCRIPTIONPLANEXPIRATION, {}, 'GET', false, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.getReponseData = res.data;
          this.showloader = false;
        }
      });
  }
}
