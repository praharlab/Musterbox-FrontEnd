import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditVisitCallFollowupComponent } from './edit-visit-call-followup.component';

describe('EditVisitCallFollowupComponent', () => {
  let component: EditVisitCallFollowupComponent;
  let fixture: ComponentFixture<EditVisitCallFollowupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditVisitCallFollowupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVisitCallFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
