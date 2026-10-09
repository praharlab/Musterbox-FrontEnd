import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditUserChecklistComponent } from './edit-user-checklist.component';

describe('EditUserChecklistComponent', () => {
  let component: EditUserChecklistComponent;
  let fixture: ComponentFixture<EditUserChecklistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserChecklistComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
