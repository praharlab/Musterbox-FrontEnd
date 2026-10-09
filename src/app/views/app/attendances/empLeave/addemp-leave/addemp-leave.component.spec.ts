import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddempLeaveComponent } from './addemp-leave.component';

describe('AddempLeaveComponent', () => {
  let component: AddempLeaveComponent;
  let fixture: ComponentFixture<AddempLeaveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddempLeaveComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddempLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
