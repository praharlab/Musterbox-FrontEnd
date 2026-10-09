import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PerdayCostReportComponent } from './perday-cost-report.component';

describe('PerdayCostReportComponent', () => {
  let component: PerdayCostReportComponent;
  let fixture: ComponentFixture<PerdayCostReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PerdayCostReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerdayCostReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
