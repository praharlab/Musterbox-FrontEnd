import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditLateEarlyPolicyComponent } from './edit-late-early-policy.component';

describe('EditLateEarlyPolicyComponent', () => {
  let component: EditLateEarlyPolicyComponent;
  let fixture: ComponentFixture<EditLateEarlyPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLateEarlyPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLateEarlyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
