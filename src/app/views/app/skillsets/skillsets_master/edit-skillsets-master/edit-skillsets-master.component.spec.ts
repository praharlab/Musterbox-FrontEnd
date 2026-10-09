import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditSkillsetsMasterComponent } from './edit-skillsets-master.component';

describe('EditSkillsetsMasterComponent', () => {
  let component: EditSkillsetsMasterComponent;
  let fixture: ComponentFixture<EditSkillsetsMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditSkillsetsMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSkillsetsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
