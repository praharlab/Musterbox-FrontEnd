import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListOrgAuthorizationComponent } from './list-org-authorization.component';

describe('ListOrgAuthorizationComponent', () => {
  let component: ListOrgAuthorizationComponent;
  let fixture: ComponentFixture<ListOrgAuthorizationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOrgAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOrgAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
