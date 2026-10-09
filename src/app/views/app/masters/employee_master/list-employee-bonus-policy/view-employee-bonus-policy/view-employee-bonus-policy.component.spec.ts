import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewEmployeeBonusPolicyComponent } from './view-employee-bonus-policy.component';

describe('ViewEmployeeBonusPolicyComponent', () => {
  let component: ViewEmployeeBonusPolicyComponent;
  let fixture: ComponentFixture<ViewEmployeeBonusPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEmployeeBonusPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmployeeBonusPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
