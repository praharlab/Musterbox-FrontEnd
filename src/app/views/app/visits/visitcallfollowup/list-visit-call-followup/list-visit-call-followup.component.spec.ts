import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListVisitCallFollowupComponent } from './list-visit-call-followup.component';

describe('ListVisitCallFollowupComponent', () => {
  let component: ListVisitCallFollowupComponent;
  let fixture: ComponentFixture<ListVisitCallFollowupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListVisitCallFollowupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVisitCallFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
