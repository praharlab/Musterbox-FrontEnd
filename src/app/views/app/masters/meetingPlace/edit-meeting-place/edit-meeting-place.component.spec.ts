import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditMeetingPlaceComponent } from './edit-meeting-place.component';

describe('EditMeetingPlaceComponent', () => {
  let component: EditMeetingPlaceComponent;
  let fixture: ComponentFixture<EditMeetingPlaceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditMeetingPlaceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMeetingPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
