import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ConstantService } from 'src/app/services/constant.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-tickets',
    templateUrl: './tickets.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TicketsComponent {
  apiURL = environment.apiUrl;
  showloader: any = 'true';
  data: any = [];
  id: string;
  imgshow1: boolean;
  constructor(
    private api: ApiService,
    private constant: ConstantService,
  ) {}
  ngOnInit(): void {
    this.id = localStorage.getItem('id');
    this.api.callApi(this.constant.REPORTTO3 + this.id, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        this.data = res.data;

        this.showloader = 'false';
      },
      (err) => {
        console.log(err, 'ERROR');
      },
    );
  }
}
