import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListOrgAuthTypeComponent } from './list-org-auth-type.component';

describe('ListOrgAuthTypeComponent', () => {
  let component: ListOrgAuthTypeComponent;
  let fixture: ComponentFixture<ListOrgAuthTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOrgAuthTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOrgAuthTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
