import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MonthYearGraphComponent } from './month-year-graph.component';

describe('MonthYearGraphComponent', () => {
  let component: MonthYearGraphComponent;
  let fixture: ComponentFixture<MonthYearGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MonthYearGraphComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthYearGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
