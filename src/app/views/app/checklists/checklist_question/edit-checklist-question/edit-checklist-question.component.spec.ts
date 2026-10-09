import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditChecklistQuestionComponent } from './edit-checklist-question.component';

describe('EditChecklistQuestionComponent', () => {
  let component: EditChecklistQuestionComponent;
  let fixture: ComponentFixture<EditChecklistQuestionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditChecklistQuestionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditChecklistQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
