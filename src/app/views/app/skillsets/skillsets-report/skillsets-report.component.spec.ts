import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SkillsetsReportComponent } from './skillsets-report.component';

describe('SkillsetsReportComponent', () => {
  let component: SkillsetsReportComponent;
  let fixture: ComponentFixture<SkillsetsReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SkillsetsReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsetsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
