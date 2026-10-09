import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-landscape-id-cards',
    templateUrl: './landscape-id-cards.component.html',
    styleUrls: ['./landscape-id-cards.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LandscapeIdCardsComponent implements OnInit {
  @Input() idCardDataArray = [];

  apiURL = environment.apiUrl;
  idCardForAsopalav: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (Number(localStorage.getItem('company_id')) == 277) {
      this.idCardForAsopalav = true;
    }else{
      this.idCardForAsopalav = false;
    }
  }
}
