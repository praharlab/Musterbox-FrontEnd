import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeAuthorizationComponent } from './list-employee-authorization.component';

describe('ListEmployeeAuthorizationComponent', () => {
  let component: ListEmployeeAuthorizationComponent;
  let fixture: ComponentFixture<ListEmployeeAuthorizationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
