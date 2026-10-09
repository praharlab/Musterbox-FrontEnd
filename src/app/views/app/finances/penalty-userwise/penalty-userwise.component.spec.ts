import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PenaltyUserwiseComponent } from './penalty-userwise.component';

describe('PenaltyUserwiseComponent', () => {
  let component: PenaltyUserwiseComponent;
  let fixture: ComponentFixture<PenaltyUserwiseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PenaltyUserwiseComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenaltyUserwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
