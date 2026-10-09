import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkAddEmployeeSkillCategoryComponent } from './bulk-add-employee-skill-category.component';

describe('BulkAddEmployeeSkillCategoryComponent', () => {
  let component: BulkAddEmployeeSkillCategoryComponent;
  let fixture: ComponentFixture<BulkAddEmployeeSkillCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkAddEmployeeSkillCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAddEmployeeSkillCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
