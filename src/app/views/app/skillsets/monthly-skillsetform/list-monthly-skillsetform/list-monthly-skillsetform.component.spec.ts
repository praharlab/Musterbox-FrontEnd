import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListMonthlySkillsetformComponent } from './list-monthly-skillsetform.component';

describe('ListMonthlySkillsetformComponent', () => {
  let component: ListMonthlySkillsetformComponent;
  let fixture: ComponentFixture<ListMonthlySkillsetformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListMonthlySkillsetformComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMonthlySkillsetformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
