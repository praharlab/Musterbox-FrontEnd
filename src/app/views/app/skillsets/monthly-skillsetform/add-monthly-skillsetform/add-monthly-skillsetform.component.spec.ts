import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddMonthlySkillsetformComponent } from './add-monthly-skillsetform.component';

describe('AddMonthlySkillsetformComponent', () => {
  let component: AddMonthlySkillsetformComponent;
  let fixture: ComponentFixture<AddMonthlySkillsetformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddMonthlySkillsetformComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMonthlySkillsetformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
