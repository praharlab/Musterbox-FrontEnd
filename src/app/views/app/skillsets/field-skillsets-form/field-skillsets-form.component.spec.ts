import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FieldSkillsetsFormComponent } from './field-skillsets-form.component';

describe('FieldSkillsetsFormComponent', () => {
  let component: FieldSkillsetsFormComponent;
  let fixture: ComponentFixture<FieldSkillsetsFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FieldSkillsetsFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldSkillsetsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
