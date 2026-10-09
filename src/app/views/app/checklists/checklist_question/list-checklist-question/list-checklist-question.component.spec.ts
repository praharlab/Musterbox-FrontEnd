import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListChecklistQuestionComponent } from './list-checklist-question.component';

describe('ListChecklistQuestionComponent', () => {
  let component: ListChecklistQuestionComponent;
  let fixture: ComponentFixture<ListChecklistQuestionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListChecklistQuestionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListChecklistQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
