import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddIncrementLetterComponent } from './add-increment-letter.component';

describe('AddIncrementLetterComponent', () => {
  let component: AddIncrementLetterComponent;
  let fixture: ComponentFixture<AddIncrementLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIncrementLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncrementLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
