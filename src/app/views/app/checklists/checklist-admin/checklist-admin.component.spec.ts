import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChecklistAdminComponent } from './checklist-admin.component';

describe('ChecklistAdminComponent', () => {
  let component: ChecklistAdminComponent;
  let fixture: ComponentFixture<ChecklistAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChecklistAdminComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
