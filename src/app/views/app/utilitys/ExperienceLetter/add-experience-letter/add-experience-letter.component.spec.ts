import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddExperienceLetterComponent } from './add-experience-letter.component';

describe('AddExperienceLetterComponent', () => {
  let component: AddExperienceLetterComponent;
  let fixture: ComponentFixture<AddExperienceLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExperienceLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExperienceLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
