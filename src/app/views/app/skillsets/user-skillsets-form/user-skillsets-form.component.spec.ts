import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserSkillsetsFormComponent } from './user-skillsets-form.component';

describe('UserSkillsetsFormComponent', () => {
  let component: UserSkillsetsFormComponent;
  let fixture: ComponentFixture<UserSkillsetsFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserSkillsetsFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSkillsetsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
