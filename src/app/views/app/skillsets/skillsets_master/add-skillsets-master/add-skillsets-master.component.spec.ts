import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddSkillsetsMasterComponent } from './add-skillsets-master.component';

describe('AddSkillsetsMasterComponent', () => {
  let component: AddSkillsetsMasterComponent;
  let fixture: ComponentFixture<AddSkillsetsMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddSkillsetsMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSkillsetsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
