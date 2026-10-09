import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditExperienceLetterComponent } from './edit-experience-letter.component';

describe('EditExperienceLetterComponent', () => {
  let component: EditExperienceLetterComponent;
  let fixture: ComponentFixture<EditExperienceLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditExperienceLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExperienceLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
