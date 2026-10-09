import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DepositUserwiseComponent } from './deposit-userwise.component';

describe('DepositUserwiseComponent', () => {
  let component: DepositUserwiseComponent;
  let fixture: ComponentFixture<DepositUserwiseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DepositUserwiseComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositUserwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
