import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListSkillsetformComponent } from './list-skillsetform.component';

describe('ListSkillsetformComponent', () => {
  let component: ListSkillsetformComponent;
  let fixture: ComponentFixture<ListSkillsetformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListSkillsetformComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSkillsetformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
