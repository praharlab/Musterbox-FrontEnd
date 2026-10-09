import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAnonymousFeedbackComponent } from './list-anonymous-feedback.component';

describe('ListAnonymousFeedbackComponent', () => {
  let component: ListAnonymousFeedbackComponent;
  let fixture: ComponentFixture<ListAnonymousFeedbackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAnonymousFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAnonymousFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
