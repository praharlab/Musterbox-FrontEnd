import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddJobRoleClassificationComponent } from './add-job-role-classification.component';

describe('AddJobRoleClassificationComponent', () => {
  let component: AddJobRoleClassificationComponent;
  let fixture: ComponentFixture<AddJobRoleClassificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddJobRoleClassificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJobRoleClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
