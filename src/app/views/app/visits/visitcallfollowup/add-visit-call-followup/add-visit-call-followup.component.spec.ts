import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddVisitCallFollowupComponent } from './add-visit-call-followup.component';

describe('AddVisitCallFollowupComponent', () => {
  let component: AddVisitCallFollowupComponent;
  let fixture: ComponentFixture<AddVisitCallFollowupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddVisitCallFollowupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVisitCallFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
