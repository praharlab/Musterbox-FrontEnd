import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SalarySummaryComponent } from './salary-summary.component';

describe('SalarySummaryComponent', () => {
  let component: SalarySummaryComponent;
  let fixture: ComponentFixture<SalarySummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalarySummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
