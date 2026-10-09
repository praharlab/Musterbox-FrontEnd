import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReviewRequestComponent } from './review-request.component';

describe('ReviewRequestComponent', () => {
  let component: ReviewRequestComponent;
  let fixture: ComponentFixture<ReviewRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
