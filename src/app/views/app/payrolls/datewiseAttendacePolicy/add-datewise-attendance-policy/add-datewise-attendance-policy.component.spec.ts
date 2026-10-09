import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDatewiseAttendancePolicyComponent } from './add-datewise-attendance-policy.component';

describe('AddDatewiseAttendancePolicyComponent', () => {
  let component: AddDatewiseAttendancePolicyComponent;
  let fixture: ComponentFixture<AddDatewiseAttendancePolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDatewiseAttendancePolicyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddDatewiseAttendancePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
