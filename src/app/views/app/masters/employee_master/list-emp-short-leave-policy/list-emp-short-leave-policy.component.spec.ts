import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmpShortLeavePolicyComponent } from './list-emp-short-leave-policy.component';

describe('ListEmpShortLeavePolicyComponent', () => {
  let component: ListEmpShortLeavePolicyComponent;
  let fixture: ComponentFixture<ListEmpShortLeavePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmpShortLeavePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmpShortLeavePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
