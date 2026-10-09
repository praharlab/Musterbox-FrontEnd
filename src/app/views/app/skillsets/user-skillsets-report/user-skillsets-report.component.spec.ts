import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserSkillsetsReportComponent } from './user-skillsets-report.component';

describe('UserSkillsetsReportComponent', () => {
  let component: UserSkillsetsReportComponent;
  let fixture: ComponentFixture<UserSkillsetsReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSkillsetsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSkillsetsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
