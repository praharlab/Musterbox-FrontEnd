import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddSkillsetformComponent } from './add-skillsetform.component';

describe('AddSkillsetformComponent', () => {
  let component: AddSkillsetformComponent;
  let fixture: ComponentFixture<AddSkillsetformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddSkillsetformComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSkillsetformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
