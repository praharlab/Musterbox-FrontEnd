import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListJobRoleClassificationComponent } from './list-job-role-classification.component';

describe('ListJobRoleClassificationComponent', () => {
  let component: ListJobRoleClassificationComponent;
  let fixture: ComponentFixture<ListJobRoleClassificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListJobRoleClassificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListJobRoleClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
