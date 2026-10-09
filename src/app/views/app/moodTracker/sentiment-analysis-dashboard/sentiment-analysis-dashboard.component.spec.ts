import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SentimentAnalysisDashboardComponent } from './sentiment-analysis-dashboard.component';

describe('SentimentAnalysisDashboardComponent', () => {
  let component: SentimentAnalysisDashboardComponent;
  let fixture: ComponentFixture<SentimentAnalysisDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SentimentAnalysisDashboardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentimentAnalysisDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
