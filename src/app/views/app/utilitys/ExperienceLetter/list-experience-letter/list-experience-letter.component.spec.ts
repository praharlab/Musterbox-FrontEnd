import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListExperienceLetterComponent } from './list-experience-letter.component';

describe('ListExperienceLetterComponent', () => {
  let component: ListExperienceLetterComponent;
  let fixture: ComponentFixture<ListExperienceLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListExperienceLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListExperienceLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
