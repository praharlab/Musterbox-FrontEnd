import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApproveReqAdvPayComponent } from './approve-req-adv-pay.component';

describe('ApproveReqAdvPayComponent', () => {
  let component: ApproveReqAdvPayComponent;
  let fixture: ComponentFixture<ApproveReqAdvPayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ApproveReqAdvPayComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveReqAdvPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
