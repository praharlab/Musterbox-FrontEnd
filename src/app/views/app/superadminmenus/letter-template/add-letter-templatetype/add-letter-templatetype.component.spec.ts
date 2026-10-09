import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddLetterTemplatetypeComponent } from './add-letter-templatetype.component';

describe('AddLetterTemplatetypeComponent', () => {
  let component: AddLetterTemplatetypeComponent;
  let fixture: ComponentFixture<AddLetterTemplatetypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddLetterTemplatetypeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLetterTemplatetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
