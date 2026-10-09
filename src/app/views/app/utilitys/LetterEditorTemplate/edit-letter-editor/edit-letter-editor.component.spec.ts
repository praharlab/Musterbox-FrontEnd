import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditLetterEditorComponent } from './edit-letter-editor.component';

describe('EditLetterEditorComponent', () => {
  let component: EditLetterEditorComponent;
  let fixture: ComponentFixture<EditLetterEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditLetterEditorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLetterEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
