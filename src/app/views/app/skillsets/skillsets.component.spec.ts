import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SkillsetsComponent } from './skillsets.component';

describe('SkillsetsComponent', () => {
  let component: SkillsetsComponent;
  let fixture: ComponentFixture<SkillsetsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SkillsetsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
