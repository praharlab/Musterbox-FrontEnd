import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewSalaryPolicyComponent } from './view-salary-policy.component';

describe('ViewSalaryPolicyComponent', () => {
  let component: ViewSalaryPolicyComponent;
  let fixture: ComponentFixture<ViewSalaryPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSalaryPolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSalaryPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
