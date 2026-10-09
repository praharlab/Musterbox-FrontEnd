import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddMeetingPlaceComponent } from './add-meeting-place.component';

describe('AddMeetingPlaceComponent', () => {
  let component: AddMeetingPlaceComponent;
  let fixture: ComponentFixture<AddMeetingPlaceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddMeetingPlaceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMeetingPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
