import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OutdoorDutyAcceptRejectModalComponent } from './outdoor-duty-accept-reject-modal.component';

describe('OutdoorDutyAcceptRejectModalComponent', () => {
  let component: OutdoorDutyAcceptRejectModalComponent;
  let fixture: ComponentFixture<OutdoorDutyAcceptRejectModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OutdoorDutyAcceptRejectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutdoorDutyAcceptRejectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
