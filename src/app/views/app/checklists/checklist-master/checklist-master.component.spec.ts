import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChecklistMasterComponent } from './checklist-master.component';

describe('ChecklistMasterComponent', () => {
  let component: ChecklistMasterComponent;
  let fixture: ComponentFixture<ChecklistMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChecklistMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
