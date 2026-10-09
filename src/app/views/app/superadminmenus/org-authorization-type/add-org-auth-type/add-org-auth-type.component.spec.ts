import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddOrgAuthTypeComponent } from './add-org-auth-type.component';

describe('AddOrgAuthTypeComponent', () => {
  let component: AddOrgAuthTypeComponent;
  let fixture: ComponentFixture<AddOrgAuthTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrgAuthTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrgAuthTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
