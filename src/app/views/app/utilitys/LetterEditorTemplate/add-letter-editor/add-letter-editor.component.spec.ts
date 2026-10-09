import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddLetterEditorComponent } from './add-letter-editor.component';

describe('AddLetterEditorComponent', () => {
  let component: AddLetterEditorComponent;
  let fixture: ComponentFixture<AddLetterEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddLetterEditorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLetterEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
