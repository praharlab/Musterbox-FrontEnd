import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditCallFollowupComponent } from './edit-call-followup.component';

describe('EditCallFollowupComponent', () => {
  let component: EditCallFollowupComponent;
  let fixture: ComponentFixture<EditCallFollowupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditCallFollowupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCallFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
