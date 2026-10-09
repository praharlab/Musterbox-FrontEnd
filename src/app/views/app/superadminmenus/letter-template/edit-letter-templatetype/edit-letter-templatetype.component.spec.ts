import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditLetterTemplatetypeComponent } from './edit-letter-templatetype.component';

describe('EditLetterTemplatetypeComponent', () => {
  let component: EditLetterTemplatetypeComponent;
  let fixture: ComponentFixture<EditLetterTemplatetypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditLetterTemplatetypeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLetterTemplatetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
