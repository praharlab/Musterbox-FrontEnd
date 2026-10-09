import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IProduct } from 'src/app/data/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-work-anniversary',
    templateUrl: './work-anniversary.component.html',
    styleUrls: ['./work-anniversary.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class WorkAnniversaryComponent implements OnInit {
  apiURL = environment.apiUrl;
  showloader: any = 'true';
  data: any = [];
  maindata: IProduct[];
  id: string;
  imgshow1: boolean;
  company_id: string;

  constructor(
    private api: ApiService,
    private constant: ConstantService,
  ) {}
  ngOnInit(): void {
    this.id = localStorage.getItem('id');
    this.company_id = localStorage.getItem('company_id');

    this.api
      .callApi(this.constant.ANNIVERSARY + this.company_id, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          this.data = res.data.filter(
            (employee: any) => this.calculateYears(employee.joiningDate) >= 1,
          );
          this.showloader = 'false';
        },
        (err) => {
          console.log(err, 'ERROR');
        },
      );
  }

  calculateYears(joiningDate: string): number | null {
    const today = new Date();
    const joinDate = new Date(joiningDate.split('T')[0]);

    const yearsDiff = today.getFullYear() - joinDate.getFullYear();
    const isAnniversaryPassed = today > joinDate && yearsDiff > 0;

    if (isAnniversaryPassed) {
      return yearsDiff;
    }

    return null;
  }
}
