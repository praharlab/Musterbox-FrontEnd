import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListLateEarlyPolicyComponent } from './list-late-early-policy.component';

describe('ListLateEarlyPolicyComponent', () => {
  let component: ListLateEarlyPolicyComponent;
  let fixture: ComponentFixture<ListLateEarlyPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLateEarlyPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLateEarlyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
