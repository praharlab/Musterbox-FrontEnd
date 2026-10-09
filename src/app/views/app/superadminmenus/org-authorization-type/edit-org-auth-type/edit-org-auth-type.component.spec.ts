import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditOrgAuthTypeComponent } from './edit-org-auth-type.component';

describe('EditOrgAuthTypeComponent', () => {
  let component: EditOrgAuthTypeComponent;
  let fixture: ComponentFixture<EditOrgAuthTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOrgAuthTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrgAuthTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
