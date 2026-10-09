import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListShortLeavePolicyComponent } from './list-short-leave-policy.component';

describe('ListShortLeavePolicyComponent', () => {
  let component: ListShortLeavePolicyComponent;
  let fixture: ComponentFixture<ListShortLeavePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListShortLeavePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListShortLeavePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
