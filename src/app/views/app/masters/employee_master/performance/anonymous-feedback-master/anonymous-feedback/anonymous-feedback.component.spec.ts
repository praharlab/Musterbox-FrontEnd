import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnonymousFeedbackComponent } from './anonymous-feedback.component';

describe('AnonymousFeedbackComponent', () => {
  let component: AnonymousFeedbackComponent;
  let fixture: ComponentFixture<AnonymousFeedbackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnonymousFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonymousFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
