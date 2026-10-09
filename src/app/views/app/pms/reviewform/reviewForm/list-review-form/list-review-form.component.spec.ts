import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListReviewFormComponent } from './list-review-form.component';

describe('ListReviewFormComponent', () => {
  let component: ListReviewFormComponent;
  let fixture: ComponentFixture<ListReviewFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListReviewFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
