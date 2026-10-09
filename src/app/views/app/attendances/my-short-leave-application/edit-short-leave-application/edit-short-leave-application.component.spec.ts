import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditShortLeaveApplicationComponent } from './edit-short-leave-application.component';

describe('EditShortLeaveApplicationComponent', () => {
  let component: EditShortLeaveApplicationComponent;
  let fixture: ComponentFixture<EditShortLeaveApplicationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditShortLeaveApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShortLeaveApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
