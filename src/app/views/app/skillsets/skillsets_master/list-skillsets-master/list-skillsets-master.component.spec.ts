import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListSkillsetsMasterComponent } from './list-skillsets-master.component';

describe('ListSkillsetsMasterComponent', () => {
  let component: ListSkillsetsMasterComponent;
  let fixture: ComponentFixture<ListSkillsetsMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListSkillsetsMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSkillsetsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
