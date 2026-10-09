import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditShiftComponent } from './edit-shift.component';

describe('EditShiftComponent', () => {
  let component: EditShiftComponent;
  let fixture: ComponentFixture<EditShiftComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditShiftComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
