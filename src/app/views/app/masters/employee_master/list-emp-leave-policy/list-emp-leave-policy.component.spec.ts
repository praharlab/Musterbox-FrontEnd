import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmpLeavePolicyComponent } from './list-emp-leave-policy.component';

describe('ListEmpLeavePolicyComponent', () => {
  let component: ListEmpLeavePolicyComponent;
  let fixture: ComponentFixture<ListEmpLeavePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmpLeavePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmpLeavePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
