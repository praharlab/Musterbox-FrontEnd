import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LateearlyreportComponent } from './lateearlyreport.component';

describe('LateearlyreportComponent', () => {
  let component: LateearlyreportComponent;
  let fixture: ComponentFixture<LateearlyreportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LateearlyreportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LateearlyreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
