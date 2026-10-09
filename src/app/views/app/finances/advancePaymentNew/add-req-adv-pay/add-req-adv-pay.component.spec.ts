import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddReqAdvPayComponent } from './add-req-adv-pay.component';

describe('AddReqAdvPayComponent', () => {
  let component: AddReqAdvPayComponent;
  let fixture: ComponentFixture<AddReqAdvPayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddReqAdvPayComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReqAdvPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
