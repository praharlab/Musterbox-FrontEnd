import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditIncrementLetterComponent } from './edit-increment-letter.component';

describe('EditIncrementLetterComponent', () => {
  let component: EditIncrementLetterComponent;
  let fixture: ComponentFixture<EditIncrementLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditIncrementLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIncrementLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
