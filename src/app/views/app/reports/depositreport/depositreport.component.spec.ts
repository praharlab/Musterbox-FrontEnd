import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DepositreportComponent } from './depositreport.component';

describe('DepositreportComponent', () => {
  let component: DepositreportComponent;
  let fixture: ComponentFixture<DepositreportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DepositreportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
