import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditFieldskillsetsFormComponent } from './edit-fieldskillsets-form.component';

describe('EditFieldskillsetsFormComponent', () => {
  let component: EditFieldskillsetsFormComponent;
  let fixture: ComponentFixture<EditFieldskillsetsFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditFieldskillsetsFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFieldskillsetsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
