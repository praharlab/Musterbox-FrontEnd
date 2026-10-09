import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditempLeaveComponent } from './editemp-leave.component';

describe('EditempLeaveComponent', () => {
  let component: EditempLeaveComponent;
  let fixture: ComponentFixture<EditempLeaveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditempLeaveComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditempLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
