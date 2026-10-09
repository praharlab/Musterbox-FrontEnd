import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddBulkShortLeaveApplicationComponent } from './add-bulk-short-leave-application.component';

describe('AddBulkShortLeaveApplicationComponent', () => {
  let component: AddBulkShortLeaveApplicationComponent;
  let fixture: ComponentFixture<AddBulkShortLeaveApplicationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBulkShortLeaveApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBulkShortLeaveApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
