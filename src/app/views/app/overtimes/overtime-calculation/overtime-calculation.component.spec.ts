import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OvertimeCalculationComponent } from './overtime-calculation.component';

describe('OvertimeCalculationComponent', () => {
  let component: OvertimeCalculationComponent;
  let fixture: ComponentFixture<OvertimeCalculationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OvertimeCalculationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvertimeCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
