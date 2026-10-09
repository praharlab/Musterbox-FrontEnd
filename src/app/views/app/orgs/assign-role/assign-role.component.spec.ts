import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssignRoleComponent } from './assign-role.component';

describe('AssignRoleComponent', () => {
  let component: AssignRoleComponent;
  let fixture: ComponentFixture<AssignRoleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AssignRoleComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
