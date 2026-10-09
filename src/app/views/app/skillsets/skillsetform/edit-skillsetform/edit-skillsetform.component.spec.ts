import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditSkillsetformComponent } from './edit-skillsetform.component';

describe('EditSkillsetformComponent', () => {
  let component: EditSkillsetformComponent;
  let fixture: ComponentFixture<EditSkillsetformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditSkillsetformComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSkillsetformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
