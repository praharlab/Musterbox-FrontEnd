import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListLetterEditorComponent } from './list-letter-editor.component';

describe('ListLetterEditorComponent', () => {
  let component: ListLetterEditorComponent;
  let fixture: ComponentFixture<ListLetterEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListLetterEditorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLetterEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
