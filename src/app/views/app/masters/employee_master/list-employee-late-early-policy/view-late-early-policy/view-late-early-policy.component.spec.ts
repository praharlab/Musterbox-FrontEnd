import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewLateEarlyPolicyComponent } from './view-late-early-policy.component';

describe('ViewLateEarlyPolicyComponent', () => {
  let component: ViewLateEarlyPolicyComponent;
  let fixture: ComponentFixture<ViewLateEarlyPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLateEarlyPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLateEarlyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
