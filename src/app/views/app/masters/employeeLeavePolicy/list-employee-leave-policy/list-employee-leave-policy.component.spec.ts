import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeLeavePolicyComponent } from './list-employee-leave-policy.component';

describe('ListEmployeeLeavePolicyComponent', () => {
  let component: ListEmployeeLeavePolicyComponent;
  let fixture: ComponentFixture<ListEmployeeLeavePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeLeavePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeLeavePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
