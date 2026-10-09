import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PendingBonusComponent } from './pending-bonus.component';

describe('PendingBonusComponent', () => {
  let component: PendingBonusComponent;
  let fixture: ComponentFixture<PendingBonusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingBonusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
