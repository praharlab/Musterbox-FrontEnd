import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListCallFollowupComponent } from './list-call-followup.component';

describe('ListCallFollowupComponent', () => {
  let component: ListCallFollowupComponent;
  let fixture: ComponentFixture<ListCallFollowupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListCallFollowupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCallFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
