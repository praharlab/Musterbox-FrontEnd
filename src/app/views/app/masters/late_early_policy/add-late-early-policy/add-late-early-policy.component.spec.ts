import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddLateEarlyPolicyComponent } from './add-late-early-policy.component';

describe('AddLateEarlyPolicyComponent', () => {
  let component: AddLateEarlyPolicyComponent;
  let fixture: ComponentFixture<AddLateEarlyPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLateEarlyPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLateEarlyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
