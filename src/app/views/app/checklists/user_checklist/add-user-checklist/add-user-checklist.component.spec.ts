import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddUserChecklistComponent } from './add-user-checklist.component';

describe('AddUserChecklistComponent', () => {
  let component: AddUserChecklistComponent;
  let fixture: ComponentFixture<AddUserChecklistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserChecklistComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
