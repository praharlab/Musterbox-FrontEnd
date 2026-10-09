import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SkillsetsMasterComponent } from './skillsets-master.component';

describe('SkillsetsMasterComponent', () => {
  let component: SkillsetsMasterComponent;
  let fixture: ComponentFixture<SkillsetsMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SkillsetsMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsetsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
