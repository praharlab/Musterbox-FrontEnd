import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListShortLeaveAuthorizationComponent } from './list-short-leave-authorization.component';

describe('ListShortLeaveAuthorizationComponent', () => {
  let component: ListShortLeaveAuthorizationComponent;
  let fixture: ComponentFixture<ListShortLeaveAuthorizationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListShortLeaveAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListShortLeaveAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
