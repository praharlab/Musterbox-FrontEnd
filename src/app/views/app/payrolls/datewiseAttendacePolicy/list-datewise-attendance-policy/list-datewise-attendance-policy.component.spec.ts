import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDatewiseAttendancePolicyComponent } from './list-datewise-attendance-policy.component';

describe('ListDatewiseAttendancePolicyComponent', () => {
  let component: ListDatewiseAttendancePolicyComponent;
  let fixture: ComponentFixture<ListDatewiseAttendancePolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListDatewiseAttendancePolicyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListDatewiseAttendancePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
