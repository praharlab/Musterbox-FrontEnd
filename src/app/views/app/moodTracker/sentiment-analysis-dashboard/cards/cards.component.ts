import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-cards',
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CardsComponent implements OnInit {
  class = 'icon-cards-row';

  statusCounts: any = [];

  @Input()
  set totalSentiments(totalSentiments: any) {
    this.statusCounts = totalSentiments;
    this.updateCardsData();
  }

  cardsData = [
    {
      mood: 'Positive',
      count: 0,
    },
    {
      mood: 'Negative',
      count: 0,
    },
    {
      mood: 'Neutral',
      count: 0,
    },
  ];

  totalCount = 0;

  constructor() {}

  ngOnInit(): void {}

  updateCardsData(): void {
    this.cardsData.forEach((item) => (item.count = 0));

    this.statusCounts.forEach((item) => {
      const lowerCaseMood = item.mood.toLowerCase();

      if (['sad', 'angry', 'stressed'].includes(lowerCaseMood)) {
        if (item.count > 0) {
          let correspondingItem = this.cardsData.find((d) => d.mood.toLowerCase() === 'negative');
          correspondingItem.count += 1;
        }
      } else if (['happy'].includes(lowerCaseMood)) {
        if (item.count > 0) {
          let correspondingItem = this.cardsData.find((d) => d.mood.toLowerCase() === 'positive');
          correspondingItem.count += 1;
        }
      } else if (['notSure', 'ok'].includes(lowerCaseMood)) {
        if (item.count > 0) {
          let correspondingItem = this.cardsData.find((d) => d.mood.toLowerCase() === 'neutral');
          correspondingItem.count += 1;
        }
      }
    });

    this.totalCount = this.cardsData.reduce((total, item) => total + item.count, 0);
  }

  ngOnDestroy() {}
}
