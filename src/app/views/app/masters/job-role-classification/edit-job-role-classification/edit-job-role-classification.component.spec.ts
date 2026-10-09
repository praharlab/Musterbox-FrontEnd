import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditJobRoleClassificationComponent } from './edit-job-role-classification.component';

describe('EditJobRoleClassificationComponent', () => {
  let component: EditJobRoleClassificationComponent;
  let fixture: ComponentFixture<EditJobRoleClassificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditJobRoleClassificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditJobRoleClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
