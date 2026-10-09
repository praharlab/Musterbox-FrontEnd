import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdvanceRejectModalComponent } from './advance-reject-modal.component';

describe('AdvanceRejectModalComponent', () => {
  let component: AdvanceRejectModalComponent;
  let fixture: ComponentFixture<AdvanceRejectModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceRejectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceRejectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
