import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FnfGenerateExperienceLetterComponent } from './fnf-generate-experience-letter.component';

describe('FnfGenerateExperienceLetterComponent', () => {
  let component: FnfGenerateExperienceLetterComponent;
  let fixture: ComponentFixture<FnfGenerateExperienceLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FnfGenerateExperienceLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FnfGenerateExperienceLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
