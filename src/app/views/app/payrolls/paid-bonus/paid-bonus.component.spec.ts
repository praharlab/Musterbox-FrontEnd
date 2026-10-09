import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaidBonusComponent } from './paid-bonus.component';

describe('PaidBonusComponent', () => {
  let component: PaidBonusComponent;
  let fixture: ComponentFixture<PaidBonusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidBonusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
