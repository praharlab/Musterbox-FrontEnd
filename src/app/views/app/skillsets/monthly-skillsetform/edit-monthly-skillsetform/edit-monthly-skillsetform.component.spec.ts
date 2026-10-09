import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditMonthlySkillsetformComponent } from './edit-monthly-skillsetform.component';

describe('EditMonthlySkillsetformComponent', () => {
  let component: EditMonthlySkillsetformComponent;
  let fixture: ComponentFixture<EditMonthlySkillsetformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditMonthlySkillsetformComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMonthlySkillsetformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
