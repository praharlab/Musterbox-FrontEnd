import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeSkillCategoryComponent } from './list-employee-skill-category.component';

describe('ListEmployeeSkillCategoryComponent', () => {
  let component: ListEmployeeSkillCategoryComponent;
  let fixture: ComponentFixture<ListEmployeeSkillCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeSkillCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeSkillCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
