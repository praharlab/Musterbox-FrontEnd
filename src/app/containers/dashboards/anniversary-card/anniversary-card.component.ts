import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IProduct } from 'src/app/data/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-anniversary-card',
    templateUrl: './anniversary-card.component.html',
    styleUrls: ['./anniversary-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AnniversaryCardComponent implements OnInit {
  apiURL = environment.apiUrl;
  showloader: any = 'true';
  data: any = [];
  maindata: IProduct[];
  id: string;
  imgshow1: boolean;
  company_id: string; 

  yesterdayData: any = [];
  todayData: any = [];
  tomorrowData: any = [];

  constructor(
    private api: ApiService,
    private constant: ConstantService,
  ) {}

  ngOnInit(): void {
    try {
      this.api.callApi(this.constant.ANNIVERSARYDATE, {}, 'GET', true, false, true).subscribe(
        (res: any) => {
          this.data = res.data;
          this.data.forEach((item) => {
            item.dob = item['employeeJoiningDetails.dob'];
            delete item['employeeJoiningDetails.dob'];
          });

          this.data.forEach((item) => {
            const day = item.day;

            if (day === 'Yesterday') {
              this.yesterdayData.push(item);
            } else if (day === 'Today') {
              this.todayData.push(item);
            } else if (day === 'Tomorrow') {
              this.tomorrowData.push(item);
            }
          });
          this.showloader = 'false';
        },
        (err) => {
          console.log(err, 'ERROR');
        },
      );
    } catch (e) {
    }
  }
}
