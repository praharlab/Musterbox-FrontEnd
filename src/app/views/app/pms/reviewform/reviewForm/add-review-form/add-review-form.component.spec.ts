import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddReviewFormComponent } from './add-review-form.component';

describe('AddReviewFormComponent', () => {
  let component: AddReviewFormComponent;
  let fixture: ComponentFixture<AddReviewFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReviewFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
