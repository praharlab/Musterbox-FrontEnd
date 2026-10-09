import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddShortLeavePolicyComponent } from './add-short-leave-policy.component';

describe('AddShortLeavePolicyComponent', () => {
  let component: AddShortLeavePolicyComponent;
  let fixture: ComponentFixture<AddShortLeavePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddShortLeavePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShortLeavePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
