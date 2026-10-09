import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeSkillsComponent } from './list-employee-skills.component';

describe('ListEmployeeSkillsComponent', () => {
  let component: ListEmployeeSkillsComponent;
  let fixture: ComponentFixture<ListEmployeeSkillsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeSkillsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
