import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddmanualLeaveComponent } from './addmanual-leave.component';

describe('AddmanualLeaveComponent', () => {
  let component: AddmanualLeaveComponent;
  let fixture: ComponentFixture<AddmanualLeaveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddmanualLeaveComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmanualLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
