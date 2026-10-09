import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeLateEarlyPolicyComponent } from './list-employee-late-early-policy.component';

describe('ListEmployeeLateEarlyPolicyComponent', () => {
  let component: ListEmployeeLateEarlyPolicyComponent;
  let fixture: ComponentFixture<ListEmployeeLateEarlyPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeLateEarlyPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeLateEarlyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
