import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDatewiseAttendancePolicyComponent } from './edit-datewise-attendance-policy.component';

describe('EditDatewiseAttendancePolicyComponent', () => {
  let component: EditDatewiseAttendancePolicyComponent;
  let fixture: ComponentFixture<EditDatewiseAttendancePolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDatewiseAttendancePolicyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditDatewiseAttendancePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
